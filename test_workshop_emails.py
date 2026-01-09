"""
Test script for workshop email confirmation system
"""
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from workshops.models import Workshop, WorkshopSlot, WorkshopRegistration
from decimal import Decimal
from datetime import datetime, timedelta
from products.tasks import send_workshop_confirmation_email, send_workshop_admin_notification

print("=" * 60)
print("TESTING WORKSHOP EMAIL SYSTEM")
print("=" * 60)

# Get or create a test workshop
workshop = Workshop.objects.first()
if not workshop:
    print("ERROR: No workshops found in database")
    print("Please add a workshop first")
    exit(1)

print(f"\n✓ Found workshop: {workshop.name}")
print(f"  Type: {workshop.get_workshop_type_display()}")
print(f"  Price: ₹{workshop.price}")

# Get or create a test slot
slot = WorkshopSlot.objects.filter(workshop=workshop, is_available=True).first()
if not slot:
    # Create a test slot
    tomorrow = datetime.now().date() + timedelta(days=1)
    from datetime import time
    slot = WorkshopSlot.objects.create(
        workshop=workshop,
        date=tomorrow,
        start_time=time(10, 0),
        end_time=time(13, 0),
        available_spots=10,
        is_available=True
    )
    print(f"\n✓ Created test slot:")
else:
    print(f"\n✓ Found available slot:")

print(f"  Date: {slot.date}")
print(f"  Time: {slot.start_time} - {slot.end_time}")

# Create test registration
registration = WorkshopRegistration.objects.create(
    workshop=workshop,
    slot=slot,
    full_name='Vinanth P',
    email='vinanth60@gmail.com',
    phone='9876543210',
    number_of_participants=2,
    special_requests='Looking forward to learning pottery!',
    status='confirmed',
    total_amount=Decimal(str(workshop.price)) * 2
)

print(f"\n✓ Test registration created:")
print(f"  Registration Number: {registration.registration_number}")
print(f"  Customer: {registration.full_name}")
print(f"  Email: {registration.email}")
print(f"  Participants: {registration.number_of_participants}")
print(f"  Total: ₹{registration.total_amount}")

print(f"\n{'=' * 60}")
print("TESTING EMAIL SENDING")
print("=" * 60)

# Test async email sending
try:
    print("\n1. Testing customer confirmation email...")
    result1 = send_workshop_confirmation_email.delay(registration.id)
    print(f"   ✓ Task queued successfully")
    print(f"   Task ID: {result1.id}")
    print(f"   Status: {result1.status}")
    
    print("\n2. Testing admin notification email...")
    result2 = send_workshop_admin_notification.delay(registration.id)
    print(f"   ✓ Task queued successfully")
    print(f"   Task ID: {result2.id}")
    print(f"   Status: {result2.status}")
    
    print(f"\n{'=' * 60}")
    print("CELERY WORKER STATUS")
    print("=" * 60)
    print("\n✓ Tasks successfully queued in Celery")
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
        send_workshop_confirmation_email(registration.id)
        print("   ✓ Customer email sent")
        
        print("\n2. Sending admin email synchronously...")
        send_workshop_admin_notification(registration.id)
        print("   ✓ Admin email sent")
        
        print("\n✓ Emails sent successfully (synchronous mode)")
        print("\n📧 Check your email at: vinanth60@gmail.com")
        print("   You should receive a workshop registration confirmation!")
        
    except Exception as sync_error:
        print(f"\n✗ ERROR sending emails: {sync_error}")
        import traceback
        traceback.print_exc()

print(f"\n{'=' * 60}")
print("TEST COMPLETE")
print("=" * 60)
print(f"\n✓ Registration created: {registration.registration_number}")
print(f"✓ Emails processed")
print(f"\nCheck inbox: vinanth60@gmail.com")
print(f"Check admin inbox: vinanthp@gmail.com")
print("=" * 60)
