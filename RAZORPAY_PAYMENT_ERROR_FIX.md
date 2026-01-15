# Razorpay Payment Error Resolution Guide

## Issue
When attempting to pay with a dummy card in Razorpay dashboard:
- Error: "Payment could not be completed"
- Returns 500 Internal Server Error from Razorpay API validation endpoint
- Error URL includes validation endpoint that's failing

## Root Causes
The 500 error from Razorpay's validation endpoint typically indicates:

1. **Account Activation Incomplete**
   - Razorpay account needs full verification
   - KYC (Know Your Customer) documents might be pending
   - Account might be in test mode without full activation

2. **Payment Gateway Not Enabled**
   - Razorpay standard checkout might not be enabled
   - Live/Test mode toggle might need adjustment
   - Payment capture settings might be misconfigured

3. **Account Permissions/Restrictions**
   - Account might have payment restrictions
   - Rate limiting might be applied
   - IP whitelisting could be blocking requests

## Solution Steps

### Step 1: Verify Razorpay Account Status
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Check your account status in the top-right corner
3. Ensure you're in **Test Mode** (for testing)
4. Look for any warning banners about incomplete setup

### Step 2: Enable Standard Checkout
1. In Razorpay Dashboard, go to **Settings → API Keys**
2. Verify both **Test** and **Live** keys are visible
3. Go to **Settings → Integrations**
4. Ensure **Razorpay Checkout** (Standard Checkout) is enabled
5. Verify payment capture is enabled

### Step 3: Test with Different Payment Methods
Try these test credentials in the Razorpay checkout:

**Test Card (Should work in test mode):**
- Card Number: **4111 1111 1111 1111**
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- Name: Any name

**Alternative Test Card:**
- Card Number: **5555 5555 5555 4444**
- Expiry: Any future date
- CVV: Any 3 digits

### Step 4: Check Browser Console
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Look for JavaScript errors
4. Check **Network** tab for failed API requests
5. Look for CORS errors or blocked requests

### Step 5: Frontend Troubleshooting
If you see the Razorpay modal but payment still fails:

**Issue: CORS Error**
- Backend might need CORS configuration
- Solution: Add your frontend domain to CORS allowed origins
- In Django settings: `CORS_ALLOWED_ORIGINS` should include frontend URL

**Issue: Payment gateway down**
- Check [Razorpay Status](https://status.razorpay.com)
- Try again in a few minutes

**Issue: Test account limitations**
- Switch to a verified Live account (if needed for testing)
- Contact Razorpay support for test mode assistance

### Step 6: Backend Verification
Ensure backend is correctly processing payments:

```bash
# Run the test script
cd /home/karthik/gwoc26_SnowStack
source .venv/bin/activate
python test_razorpay_payment.py
```

If test passes, the issue is on Razorpay dashboard side.

## Current Configuration ✓
- ✓ Razorpay API credentials are valid
- ✓ Orders can be created successfully
- ✓ Backend integration is correctly configured
- ✓ Test mode is active

## Next Steps
1. **Login to Razorpay Dashboard**
2. **Click "Need Help?" button** for account-specific guidance
3. **Contact Razorpay Support** if issue persists
4. **Check email** for any notifications about account issues
5. **Verify account hasn't reached test mode limits**

## For Local Testing (if account still has issues)
You can bypass Razorpay temporarily for development:

```jsx
// In Checkout.jsx - add this for testing without Razorpay
if (process.env.REACT_APP_ENV === 'development') {
  // Test payment flow without actual Razorpay validation
  const testPaymentData = {
    razorpay_payment_id: 'pay_test_' + Date.now(),
    razorpay_order_id: orderId,
    razorpay_signature: 'test_signature_' + Date.now()
  };
  // Process as successful
}
```

## Contact Information
- **Razorpay Support**: https://razorpay.com/support
- **Status Page**: https://status.razorpay.com
- **Documentation**: https://razorpay.com/docs/api/orders/

## Debugging Checklist
- [ ] Account is activated and verified
- [ ] In correct mode (Test/Live)
- [ ] Keys are correct in Django settings
- [ ] Standard Checkout is enabled
- [ ] Payment capture is enabled
- [ ] Browser console has no CORS errors
- [ ] Network tab shows successful API calls
- [ ] Test card format is correct
- [ ] No account-level restrictions
- [ ] Razorpay service is up (check status page)
