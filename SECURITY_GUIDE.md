# Security Configuration Guide

## 🔐 Razorpay API Credentials

### Important Security Notes

> **⚠️ CRITICAL: NEVER commit real API keys to version control!**

Your Razorpay credentials are sensitive and should be kept secure. Follow these guidelines:

### Setup Instructions

1. **Get your Razorpay credentials:**
   - Visit [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
   - Copy your Test/Live Key ID and Key Secret

2. **Create a `.env` file:**
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

3. **Add your Razorpay credentials to `.env`:**
   ```env
   RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET
   ```

4. **Load environment variables (if needed):**
   
   If using `python-dotenv`:
   ```bash
   pip install python-dotenv
   ```

   Add to `settings.py` (if not already present):
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

### Verification

The `.env` file is already in `.gitignore`, so it will NOT be committed to git.

To verify:
```bash
git status
# .env should NOT appear in the list
```

### How It Works

The Django settings now use environment variables:

```python
# settings.py
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'your_razorpay_key_id')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'your_razorpay_key_secret')
```

This means:
- ✅ If `.env` file exists with real credentials, those are used
- ✅ If not, placeholder values are used (won't work for payments)
- ✅ Real credentials are never in the codebase

### Current Status

✅ **Settings.py**: Now loads from environment variables  
✅ **.env.example**: Updated with Razorpay configuration  
✅ **.gitignore**: Already configured to ignore `.env` files  
✅ **Codebase**: No hardcoded credentials found  

### Before Pushing to Git

**Checklist:**
- [ ] Verify `.env` is in `.gitignore`
- [ ] Ensure no credentials in committed files
- [ ] Check `settings.py` uses `os.environ.get()`
- [ ] Confirm `.env.example` has placeholders only

**Quick Verification:**
```bash
# Search for potential leaked credentials
git grep -i "rzp_test_" -- ':!.env' ':!.env.example'
git grep -i "rzp_live_" -- ':!.env' ':!.env.example'

# Should return no results
```

### Production Deployment

For production (Heroku, AWS, etc.):

1. **Set environment variables in your hosting platform:**
   - Heroku: `heroku config:set RAZORPAY_KEY_ID=your_key`
   - AWS/DigitalOcean: Add to environment variables in dashboard

2. **Never use test keys in production!**
   - Use live keys (starts with `rzp_live_`)

3. **Enable webhook signature verification** for added security

---

## 📧 Email Credentials

Similar security applies to email credentials in `.env`:

```env
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
```

> **Note:** For Gmail, use [App Passwords](https://support.google.com/accounts/answer/185833), not your regular password.

---

## 🚨 If Credentials Were Accidentally Committed

If you accidentally committed credentials:

1. **Immediately rotate the keys:**
   - Go to Razorpay Dashboard → Settings → API Keys
   - Generate new keys
   - Update `.env` with new credentials

2. **Remove from Git history:**
   ```bash
   # This is complex - consider repo as compromised
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force push** (warning: affects collaborators):
   ```bash
   git push origin --force --all
   ```

4. **Better approach:** Create a new repository and migrate code without sensitive history.

---

## ✅ Security Best Practices

1. **Always use environment variables** for secrets
2. **Never commit `.env` files** to version control
3. **Use different credentials** for development and production
4. **Rotate credentials periodically**
5. **Use test mode** during development
6. **Monitor API usage** in Razorpay Dashboard for suspicious activity

---

*Last updated: 2026-01-09*
