# Basho Products - REST API Serializers
#
# Serializers convert Django models to JSON for the React frontend

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, CustomOrder, Order, OrderItem


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for Product model
    Converts Product objects to JSON for React frontend
    """
    tags = serializers.SerializerMethodField()
    image_url_full = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'product_id',
            'name',
            'category',
            'description',
            'short_description',
            'price',
            'weight',
            'dimensions',
            'is_food_safe',
            'is_microwave_safe',
            'is_dishwasher_safe',
            'is_handmade',
            'in_stock',
            'stock_quantity',
            'is_featured',
            'is_bestseller',
            'image',
            'image_url',
            'image_url_full',
            'tags',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'tags', 'image_url_full']
    
    def get_tags(self, obj):
        """Return product tags as array"""
        return obj.get_tags()
    
    def get_image_url_full(self, obj):
        """Return full image URL"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return obj.image_url or None


class CustomOrderSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomOrder model
    Handles custom order form submissions from React
    """
    
    class Meta:
        model = CustomOrder
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'project_type',
            'description',
            'budget',
            'gst_number',
            'reference_images',
            'status',
            'order_number',
            'created_at',
        ]
        read_only_fields = ['id', 'order_number', 'status', 'created_at']
    
    def validate_email(self, value):
        """Validate email format"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError("Invalid email format")
        return value
    
    def validate_phone(self, value):
        """Validate phone number"""
        import re
        # Remove spaces and dashes
        cleaned = re.sub(r'[\s\-\(\)]', '', value)
        if not re.match(r'^\+?[\d]{10,15}$', cleaned):
            raise serializers.ValidationError("Invalid phone number format")
        return value


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price_at_purchase', 'subtotal']
        read_only_fields = ['id', 'subtotal', 'product_name', 'product_image']
    
    def get_product_image(self, obj):
        """Return product image URL"""
        if obj.product.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
        return obj.product.image_url or None


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model - handles checkout"""
    items = OrderItemSerializer(many=True)
    user_firebase_uid = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user_firebase_uid',
            'customer_name', 'customer_email', 'customer_phone',
            'shipping_address', 'shipping_city', 'shipping_state', 'shipping_pincode',
            'billing_address', 'status', 'payment_method', 'payment_status',
            'subtotal', 'shipping_charge', 'tax_amount', 'discount_amount', 'total_amount',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at', 'status']
    
    def create(self, validated_data):
        """Create order with items and link to user if firebase_uid provided"""
        items_data = validated_data.pop('items')
        firebase_uid = validated_data.pop('user_firebase_uid', None)
        
        # Link to user if firebase_uid provided
        if firebase_uid:
            try:
                user = User.objects.get(username=firebase_uid)
                validated_data['user'] = user
            except User.DoesNotExist:
                pass  # Continue without user link (guest checkout)
        
        # Create the order
        order = Order.objects.create(**validated_data)
        
        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order
