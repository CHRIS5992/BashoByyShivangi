# Basho Products Page - Django Views (REST API)
#
# REST API views for React frontend
# Your friend needs to complete these view functions

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Product, CustomOrder, Order, OrderItem
from .serializers import ProductSerializer, CustomOrderSerializer, OrderSerializer


# ====================
# PRODUCTS API VIEWSET
# Purpose: REST API for products (GET, POST, PUT, DELETE)
# URLs: /api/products/ and /api/products/{id}/
# ====================
class ProductViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for Product model
    Provides: list, retrieve, create, update, delete
    
    TODO for your friend:
    1. Add custom filtering (by category, price range, tags)
    2. Add search functionality
    3. Add pagination customization
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'product_id'
    
    def get_queryset(self):
        """
        Filter products based on query parameters
        """
        queryset = Product.objects.filter(in_stock=True)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category and category != 'all':
            queryset = queryset.filter(category=category)
        
        # Filter by featured
        featured = self.request.query_params.get('featured', None)
        if featured:
            queryset = queryset.filter(is_featured=True)
        
        # Search by name or description
        search = self.request.query_params.get('search', None)
        if search:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search)
            )
        
        # Sort
        sort = self.request.query_params.get('sort', 'featured')
        if sort == 'price-low':
            queryset = queryset.order_by('price')
        elif sort == 'price-high':
            queryset = queryset.order_by('-price')
        elif sort == 'newest':
            queryset = queryset.order_by('-created_at')
        else:  # featured
            queryset = queryset.order_by('-is_featured', '-created_at')
        
        return queryset


# ====================
# CUSTOM ORDER API VIEWSET
# Purpose: Handle custom order submissions
# URL: /api/custom-orders/
# ====================
class CustomOrderViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for CustomOrder model
    
    TODO for your friend:
    1. Send email notification when order created
    2. Send confirmation email to customer
    3. Add file upload handling for reference images
    """
    queryset = CustomOrder.objects.all()
    serializer_class = CustomOrderSerializer
    http_method_names = ['get', 'post', 'head', 'options']  # Only allow GET and POST
    
    def create(self, request, *args, **kwargs):
        """
        Create new custom order and send email notifications asynchronously
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        custom_order = serializer.save()
        
        # Trigger asynchronous email tasks
        try:
            from .tasks import send_custom_order_admin_email, send_custom_order_customer_email
            
            # Send admin email in background
            send_custom_order_admin_email.delay(
                order_id=custom_order.id,
                order_number=custom_order.order_number,
                name=custom_order.name,
                email=custom_order.email,
                phone=custom_order.phone,
                project_type_display=custom_order.get_project_type_display(),
                budget_display=custom_order.get_budget_display() if custom_order.budget else None,
                description=custom_order.description
            )
            
            # Send customer confirmation email in background
            send_custom_order_customer_email.delay(
                order_number=custom_order.order_number,
                name=custom_order.name,
                email=custom_order.email,
                project_type_display=custom_order.get_project_type_display()
            )
            
        except Exception as e:
            # Log the error but don't fail the request
            # Emails will still be attempted by Celery
            print(f"Failed to queue email tasks: {str(e)}")
        
        return Response({
            'success': True,
            'order_number': custom_order.order_number,
            'message': 'Custom order request received. We will contact you within 24 hours.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


# ====================
# ORDER API VIEWSET
# Purpose: Handle product orders (checkout)
# URL: /api/orders/
# ====================
class OrderViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for Order model
    Handles product orders from checkout
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def create(self, request, *args, **kwargs):
        """
        Create new order from checkout
        Links to user if firebase_uid provided, otherwise guest checkout
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # TODO: Send email notifications
        # TODO: Integrate with payment gateway
        
        return Response({
            'success': True,
            'order_number': order.order_number,
            'message': 'Order placed successfully!',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


# ====================
# SHIPPING CALCULATOR API
# Purpose: Calculate shipping cost
# URL: /api/calculate-shipping/
# Method: POST
# ====================
@api_view(['POST'])
def calculate_shipping(request):
    """
    Calculate shipping cost based on weight
    
    Request body: {"weight": 2.5}
    Response: {"weight": 2.5, "shippingCost": 125, "ratePerKg": 50}
    
    TODO for your friend:
    1. Add region-based rates
    2. Add express shipping option
    3. Integrate with shipping provider API
    """
    try:
        weight_kg = float(request.data.get('weight', 0))
        
        if weight_kg <= 0:
            return Response({
                'error': 'Weight must be greater than 0'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Shipping calculation
        rate_per_kg = 50
        shipping_cost = weight_kg * rate_per_kg
        
        # Minimum shipping charge
        if shipping_cost < 100:
            shipping_cost = 100
        
        return Response({
            'weight': weight_kg,
            'shippingCost': shipping_cost,
            'ratePerKg': rate_per_kg
        })
        
    except (ValueError, TypeError):
        return Response({
            'error': 'Invalid weight value'
        }, status=status.HTTP_400_BAD_REQUEST)


# ====================
# CREATE USER API
# Purpose: Create Django user from Firebase authentication
# URL: /api/create-user/
# Method: POST
# ====================
@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    """
    Create or update Django user from Firebase authentication
    
    Request body: {
        "username": "firebase_uid",
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe"
    }
    """
    try:
        username = request.data.get('username')  # Firebase UID
        email = request.data.get('email')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        if not username or not email:
            return Response({
                'error': 'Username and email are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create or update user
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name
            }
        )
        
        # Update if user already exists
        if not created:
            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.save()
        
        return Response({
            'success': True,
            'created': created,
            'message': 'User created' if created else 'User updated',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ====================
# RAZORPAY PAYMENT INTEGRATION
# ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def create_razorpay_order(request):
    """
    Create Razorpay order for payment
    
    Request body: {
        "amount": 5000,  // Amount in rupees
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_phone": "9876543210"
    }
    
    Response: {
        "order_id": "order_xyz123",
        "amount": 500000,  // Amount in paise
        "currency": "INR",
        "key": "rzp_test_xxxxx"
    }
    """
    try:
        import razorpay
        from django.conf import settings
        
        # Initialize Razorpay client
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        # Get amount from request (in rupees)
        amount_rupees = float(request.data.get('amount', 0))
        
        if amount_rupees <= 0:
            return Response({
                'error': 'Amount must be greater than 0'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Convert to paise (Razorpay accepts amount in smallest currency unit)
        amount_paise = int(amount_rupees * 100)
        
        # Create Razorpay order
        order_data = {
            'amount': amount_paise,
            'currency': 'INR',
            'payment_capture': 1,  # Auto capture payment
            'notes': {
                'customer_name': request.data.get('customer_name', ''),
                'customer_email': request.data.get('customer_email', ''),
                'customer_phone': request.data.get('customer_phone', '')
            }
        }
        
        razorpay_order = client.order.create(data=order_data)
        
        return Response({
            'success': True,
            'order_id': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency'],
            'key': settings.RAZORPAY_KEY_ID
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Failed to create Razorpay order: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_payment(request):
    """
    Verify Razorpay payment signature
    
    Request body: {
        "razorpay_order_id": "order_xyz123",
        "razorpay_payment_id": "pay_abc456",
        "razorpay_signature": "signature_hash",
        "order_data": {
            // All order fields for creating Order in database
        }
    }
    """
    try:
        import razorpay
        from django.conf import settings
        
        # Initialize Razorpay client
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        # Get payment details
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({
                'error': 'Missing payment verification parameters'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify payment signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        try:
            client.utility.verify_payment_signature(params_dict)
            payment_verified = True
        except razorpay.errors.SignatureVerificationError:
            payment_verified = False
            return Response({
                'success': False,
                'error': 'Payment verification failed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # If payment verified, create order in database
        if payment_verified:
            order_data = request.data.get('order_data', {})
            
            # Update order data with payment info
            order_data['payment_method'] = 'razorpay'
            order_data['payment_status'] = True
            order_data['shipping_charge'] = 0  # Shipping is 0 for now
            
            # Create order
            from .serializers import OrderSerializer
            serializer = OrderSerializer(data=order_data)
            
            if serializer.is_valid():
                order = serializer.save()
                
                # Store payment details in order notes
                order.internal_notes = f"Razorpay Payment\nOrder ID: {razorpay_order_id}\nPayment ID: {razorpay_payment_id}"
                order.save()
                
                return Response({
                    'success': True,
                    'message': 'Payment verified and order created successfully',
                    'order_number': order.order_number,
                    'order_id': order.id,
                    'payment_id': razorpay_payment_id
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'error': 'Failed to create order',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': f'Payment verification failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

