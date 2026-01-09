"""
Test script to verify email template rendering
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from django.template.loader import render_to_string

# Test context
context = {
    'order_number': 'CO-20260108-TEST123',
    'customer_name': 'John Doe',
    'customer_email': 'test@example.com',
    'customer_phone': '+91 9876543210',
    'project_type': 'Tableware Set',
    'budget': '₹10,000 - ₹25,000',
    'description': 'I need a custom dinnerware set with blue glaze.',
    'admin_url': 'http://127.0.0.1:8000/admin/products/customorder/1/',
}

print("=" *60)
print("Testing Admin Email Template")
print("=" * 60)

try:
    html_content = render_to_string('emails/admin_notification.html', context)
    print(f"\n✓ Template rendered successfully")
    print(f"Length: {len(html_content)} characters")
    
    # Check if variables were replaced
    if '{{ order_number }}' in html_content:
        print("\n❌ ERROR: Variables NOT replaced - still showing {{ }}")
        print("First 500 chars:")
        print(html_content[:500])
    elif 'CO-20260108-TEST123' in html_content:
        print(f"\n✓ Variables CORRECTLY replaced")
        print(f"✓ Found order number: CO-20260108-TEST123")
        print(f"✓ Found customer name: John Doe" if 'John Doe' in html_content else "❌ Customer name not found")
    else:
        print("\n⚠ WARNING: Unclear - need to check content")
        print("First 1000 chars:")
        print(html_content[:1000])
        
except Exception as e:
    print(f"\n❌ ERROR rendering template: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("Testing Customer Email Template")
print("=" * 60)

context2 = {
    'customer_name': 'Jane Smith',
    'order_number': 'CO-20260108-TEST456',
    'project_type': 'Art Piece',
    'company_email': 'vinanthp@gmail.com',
    'company_phone': '+91 XXXXX XXXXX',
}

try:
    html_content2 = render_to_string('emails/customer_confirmation.html', context2)
    print(f"\n✓ Template rendered successfully")
    print(f"Length: {len(html_content2)} characters")
    
    if '{{ customer_name }}' in html_content2:
        print("\n❌ ERROR: Variables NOT replaced")
    elif 'Jane Smith' in html_content2:
        print(f"\n✓ Variables CORRECTLY replaced")
        print(f"✓ Found customer name: Jane Smith")
        print(f"✓ Found order number: CO-20260108-TEST456" if 'CO-20260108-TEST456' in html_content2 else "❌ Order number not found")
    else:
        print("\n⚠ WARNING: Check content")
        print("First 1000 chars:")
        print(html_content2[:1000])
        
except Exception as e:
    print(f"\n❌ ERROR rendering template: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("Test Complete")
print("=" * 60)
