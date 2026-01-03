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
        Create new custom order and send email notifications
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        custom_order = serializer.save()
        
        # Send email notification to admin
        try:
            from django.core.mail import send_mail
            from django.conf import settings
            
            # Email to admin
            admin_subject = f'New Custom Order: {custom_order.order_number}'
            admin_message = f'''
New Custom Order Received

Order Number: {custom_order.order_number}
Customer: {custom_order.name}
Email: {custom_order.email}
Phone: {custom_order.phone}
Project Type: {custom_order.get_project_type_display()}
Budget: {custom_order.get_budget_display() if custom_order.budget else 'Not specified'}

Description:
{custom_order.description}

Login to admin panel to review: http://127.0.0.1:8000/admin/products/customorder/{custom_order.id}/
            '''
            
            send_mail(
                subject=admin_subject,
                message=admin_message,
                from_email=settings.COMPANY_EMAIL,
                recipient_list=[settings.COMPANY_EMAIL],
                fail_silently=True,  # Don't crash if email fails
            )
            
            # Email confirmation to customer
            customer_subject = f'Order Confirmation - {custom_order.order_number}'
            customer_message = f'''
Dear {custom_order.name},

Thank you for your custom order request at Basho By Shivangi!

Order Number: {custom_order.order_number}
Project Type: {custom_order.get_project_type_display()}

We have received your request and will contact you within 24 hours to discuss your project in detail.

If you have any immediate questions, please contact us at:
Email: {settings.COMPANY_EMAIL}
Phone: {settings.COMPANY_PHONE}

Best regards,
Basho By Shivangi Team
            '''
            
            send_mail(
                subject=customer_subject,
                message=customer_message,
                from_email=settings.COMPANY_EMAIL,
                recipient_list=[custom_order.email],
                fail_silently=True,
            )
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Email sending failed: {str(e)}")
        
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
