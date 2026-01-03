from rest_framework import serializers
from .models import UserProfile, Order, OrderItem


class UserProfileSerializer(serializers.ModelSerializer):
    order_count = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['id', 'firebase_uid', 'email', 'display_name', 'phone_number', 
                  'photo_url', 'is_email_verified', 'created_at', 'last_login',
                  'order_count', 'total_spent']
        read_only_fields = ['id', 'created_at', 'last_login']
    
    def get_order_count(self, obj):
        return obj.get_order_count()
    
    def get_total_spent(self, obj):
        return float(obj.get_total_spent())


class UserOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_price', 'quantity']


class UserOrderSerializer(serializers.ModelSerializer):
    items = UserOrderItemSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'customer_name', 'customer_email', 
                  'customer_phone', 'shipping_address', 'shipping_city', 
                  'shipping_state', 'shipping_pincode', 'status', 'payment_method',
                  'payment_status', 'subtotal', 'shipping_charge', 'tax_amount',
                  'discount_amount', 'total_amount', 'created_at', 'delivered_at',
                  'tracking_number', 'courier_service', 'items', 'item_count']
        read_only_fields = ['id', 'order_number', 'created_at']
    
    def get_item_count(self, obj):
        return obj.get_item_count()
