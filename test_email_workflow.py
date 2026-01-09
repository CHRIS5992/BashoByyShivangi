"""
Test script to verify email workflow for order confirmations
"""
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from products.models import Order, OrderItem, Product
from products.email_utils import send_order_confirmation_email, send_admin_order_notification
from datetime import datetime

print("=" * 60)
print("TESTING EMAIL WORKFLOW")
print("=" * 60)

# Check if there are any recent orders
recent_orders = Order.objects.all().order_by('-created_at')[:1]

if recent_orders:
    order = recent_orders[0]
    print(f"\n✓ Found recent order: {order.order_number}")
    print(f"  Customer: {order.customer_name}")
    print(f"  Email: {order.customer_email}")
    print(f"  Total: ₹{order.total_amount}")
    print(f"  Status: {order.status}")
    print(f"  Payment: {'Paid' if order.payment_status else 'Pending'}")
    
    # Test sending emails
    print(f"\n{'=' * 60}")
    print("TESTING EMAIL SENDING...")
    print("=" * 60)
    
    print("\n1. Testing customer confirmation email...")
    try:
        success = send_order_confirmation_email(order)
        if success:
            print(f"   ✓ SUCCESS: Email sent to {order.customer_email}")
        else:
            print(f"   ✗ FAILED: Could not send email to {order.customer_email}")
    except Exception as e:
        print(f"   ✗ ERROR: {str(e)}")
    
    print("\n2. Testing admin notification email...")
    try:
        success = send_admin_order_notification(order)
        if success:
            print(f"   ✓ SUCCESS: Admin notification sent")
        else:
            print(f"   ✗ FAILED: Could not send admin notification")
    except Exception as e:
        print(f"   ✗ ERROR: {str(e)}")
    
else:
    print("\n⚠ No orders found in database")
    print("\nTo test the email workflow:")
    print("1. Complete a test purchase through the website")
    print("2. Run this script again")
    print("\nOR create a test order manually:")
    print("python manage.py shell")
    print(">>> from test_email_workflow import create_test_order")
    print(">>> create_test_order()")

print(f"\n{'=' * 60}")
print("Email Configuration:")
print("=" * 60)
from django.conf import settings
print(f"Backend: {settings.EMAIL_BACKEND}")
print(f"Host: {settings.EMAIL_HOST}")
print(f"Port: {settings.EMAIL_PORT}")
print(f"From: {settings.DEFAULT_FROM_EMAIL}")
print(f"Admin: {settings.COMPANY_EMAIL}")
print("=" * 60)


def create_test_order():
    """Helper function to create a test order for email testing"""
    from decimal import Decimal
    
    # Get a product
    product = Product.objects.first()
    if not product:
        print("No products found. Please add products first.")
        return None
    
    # Create test order
    order = Order.objects.create(
        customer_name="Test User",
        customer_email="test@example.com",  # Change this to your email
        customer_phone="9876543210",
        shipping_address="123 Test Street",
        shipping_city="Mumbai", 
        shipping_state="Maharashtra",
        shipping_pincode="400001",
        status="confirmed",
        payment_method="razorpay",
        payment_status=True,
        subtotal=Decimal("1000.00"),
        shipping_charge=Decimal("0.00"),
        tax_amount=Decimal("0.00"),
        discount_amount=Decimal("0.00"),
        total_amount=Decimal("1000.00")
    )
    
    # Add order item
    OrderItem.objects.create(
        order=order,
        product=product,
        quantity=1,
        product_name=product.name,
        product_price=product.price
    )
    
    print(f"✓ Test order created: {order.order_number}")
    print(f"  Email: {order.customer_email}")
    
    # Send emails
    print("\nSending emails...")
    send_order_confirmation_email(order)
    send_admin_order_notification(order)
    
    return order


if __name__ == "__main__":
    pass
