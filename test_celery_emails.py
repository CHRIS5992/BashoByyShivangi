"""
Test script for Celery async email tasks
"""
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from products.models import Order, OrderItem, Product
from decimal import Decimal
from products.tasks import send_product_order_confirmation_email, send_product_order_admin_notification

print("=" * 60)
print("TESTING CELERY ASYNC EMAIL SYSTEM")
print("=" * 60)

# Create test order
product = Product.objects.first()
if not product:
    print("ERROR: No products found in database")
    exit(1)

order = Order.objects.create(
    customer_name='Vinanth P',
    customer_email='vinanth60@gmail.com',
    customer_phone='9876543210',
    shipping_address='123 Test Street',
    shipping_city='Mumbai',
    shipping_state='Maharashtra',
    shipping_pincode='400001',
    status='confirmed',
    payment_method='razorpay',
    payment_status=True,
    subtotal=Decimal(str(product.price)),
    shipping_charge=Decimal('0.00'),
    tax_amount=Decimal('0.00'),
    discount_amount=Decimal('0.00'),
    total_amount=Decimal(str(product.price))
)

OrderItem.objects.create(
    order=order,
    product=product,
    quantity=1,
    product_name=product.name,
    product_price=product.price
)

print(f"\n✓ Test order created:")
print(f"  Order Number: {order.order_number}")
print(f"  Customer: {order.customer_email}")
print(f"  Product: {product.name}")
print(f"  Total: ₹{order.total_amount}")

print(f"\n{'=' * 60}")
print("TESTING CELERY ASYNC TASKS")
print("=" * 60)

# Test async email sending
try:
    print("\n1. Queueing customer confirmation email...")
    result1 = send_product_order_confirmation_email.delay(order.id)
    print(f"   ✓ Task queued successfully")
    print(f"   Task ID: {result1.id}")
    print(f"   Status: {result1.status}")
    
    print("\n2. Queueing admin notification email...")
    result2 = send_product_order_admin_notification.delay(order.id)
    print(f"   ✓ Task queued successfully")
    print(f"   Task ID: {result2.id}")
    print(f"   Status: {result2.status}")
    
    print(f"\n{'=' * 60}")
    print("CELERY WORKER STATUS")
    print("=" * 60)
    print("\n✓ Tasks successfully queued in Redis")
    print("\nTo process these tasks, ensure Celery worker is running:")
    print("  celery -A basho_project worker -l info -P eventlet")
    print("\nThe worker will:")
    print("  1. Pick up the tasks from Redis queue")
    print("  2. Send emails asynchronously")
    print("  3. Retry automatically if emails fail")
    
except Exception as e:
    print(f"\n✗ ERROR queueing tasks: {e}")
    print("\nThis likely means:")
    print("  - Redis is not running, OR")
    print("  - Celery is not configured properly")
    print("\nFalling back to synchronous execution...")
    
    try:
        print("\n1. Sending customer email synchronously...")
        send_product_order_confirmation_email(order.id)
        print("   ✓ Customer email sent")
        
        print("\n2. Sending admin email synchronously...")
        send_product_order_admin_notification(order.id)
        print("   ✓ Admin email sent")
        
        print("\n✓ Emails sent successfully (synchronous mode)")
    except Exception as sync_error:
        print(f"\n✗ ERROR sending emails: {sync_error}")

print(f"\n{'=' * 60}")
print("Check your email at: vinanth60@gmail.com")
print("=" * 60)
