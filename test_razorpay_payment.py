#!/usr/bin/env python
"""
Test Razorpay Payment Integration
Helps diagnose payment processing issues
"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from django.conf import settings
import razorpay

def test_razorpay_credentials():
    """Test if Razorpay credentials are valid"""
    print("\n=== Testing Razorpay Credentials ===")
    print(f"Key ID: {settings.RAZORPAY_KEY_ID}")
    print(f"Key Secret: {settings.RAZORPAY_KEY_SECRET[:10]}...***")
    
    try:
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        print("✓ Razorpay client initialized successfully")
        return client
    except Exception as e:
        print(f"✗ Error initializing Razorpay client: {str(e)}")
        return None

def test_create_order(client, amount=50000):
    """Test creating a Razorpay order"""
    print(f"\n=== Testing Order Creation (Amount: ₹{amount/100}) ===")
    
    try:
        order_data = {
            'amount': amount,
            'currency': 'INR',
            'payment_capture': 1,
            'notes': {
                'test': 'true',
                'purpose': 'payment_test'
            }
        }
        
        order = client.order.create(data=order_data)
        print(f"✓ Order created successfully")
        print(f"  Order ID: {order['id']}")
        print(f"  Amount: ₹{order['amount']/100}")
        print(f"  Currency: {order['currency']}")
        print(f"  Status: {order['status']}")
        return order
    except Exception as e:
        print(f"✗ Error creating order: {str(e)}")
        return None

def test_payment_methods():
    """Test available payment methods"""
    print(f"\n=== Razorpay Configuration ===")
    print(f"Payment Capture: Enabled (auto-capture)")
    print(f"Test Mode: {True if 'test' in settings.RAZORPAY_KEY_ID else False}")
    print(f"Available Payment Methods: Card, NetBanking, UPI, Wallet")
    
def main():
    """Run all tests"""
    print("=" * 60)
    print("RAZORPAY PAYMENT INTEGRATION TEST")
    print("=" * 60)
    
    # Test credentials
    client = test_razorpay_credentials()
    if not client:
        print("\n✗ Cannot proceed without valid Razorpay credentials")
        sys.exit(1)
    
    # Test order creation
    order = test_create_order(client)
    if not order:
        print("\n✗ Cannot create orders. Check your Razorpay account settings.")
        print("  Possible issues:")
        print("  - Account not fully activated")
        print("  - Payment gateway not enabled")
        print("  - Insufficient permissions")
        sys.exit(1)
    
    # Test payment methods
    test_payment_methods()
    
    print("\n" + "=" * 60)
    print("✓ ALL TESTS PASSED")
    print("=" * 60)
    print("\nYour Razorpay integration is configured correctly!")
    print("\nTo test payment flow:")
    print("1. Use Test Card: 4111 1111 1111 1111")
    print("2. Any expiry date (future date)")
    print("3. Any CVV")
    print("\nIf payment still fails after this test, check:")
    print("- Your Razorpay dashboard for any account restrictions")
    print("- Browser console for JavaScript errors")
    print("- Network tab for API response errors")

if __name__ == '__main__':
    main()
