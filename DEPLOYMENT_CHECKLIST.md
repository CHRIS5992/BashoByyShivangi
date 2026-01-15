# 🚀 Basho Pottery - Complete Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Frontend Build (Already Done ✓)
Your React frontend has been built successfully. The build files are in `frontend/build/`.

```bash
# To rebuild if needed:
cd frontend
npm run build
cd ..
```

---

### 2. Collect Static Files
Django needs to collect all static files (admin, React build, images) into `staticfiles/` directory.

```bash
python manage.py collectstatic --noinput
```

**What this does:**
- Copies all static files to `staticfiles/` directory
- Includes Django admin static files
- Includes your React build files
- WhiteNoise will serve these files in production

---

### 3. Database Setup
You're using SQLite which is fine for small-medium deployments.

**Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Create superuser for admin access:**
```bash
python manage.py createsuperuser
```
- Username: (choose yours)
- Email: vinanthp@gmail.com (or your email)
- Password: (choose a strong password)

**IMPORTANT:** Save these credentials securely!

---

### 4. Environment Variables (.env file)

Your `.env` file exists. Make sure it has the correct values:

```bash
# Check your .env file
cat .env
```

**Required variables for production:**
```env
# Django Security
SECRET_KEY=your-super-secret-key-here-change-this
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Email (Gmail)
EMAIL_HOST_USER=vinanthp@gmail.com
EMAIL_HOST_PASSWORD=pudd wqdo ygnh qnyq

# Razorpay
RAZORPAY_KEY_ID=rzp_test_S1lAGZcFMuNU0Y
RAZORPAY_KEY_SECRET=AI3Nxw061P2yE5nTj95yaG8S
```

**To generate a new SECRET_KEY:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

---

### 5. Update Settings for Production

Edit `basho_project/settings.py`:

**CRITICAL CHANGES:**

1. **DEBUG Mode:**
```python
DEBUG = os.environ.get('DEBUG', 'False') == 'True'  # Should be False in production
```

2. **ALLOWED_HOSTS:**
```python
# Add your actual domain
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'your-domain.com,www.your-domain.com').split(',')
```

3. **SECURE Settings (add these if deploying to HTTPS):**
```python
# Add these at the end of settings.py
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
```

---

## 🌐 Deployment Platform Specific Instructions

### Option A: Deploy to **Render** (Recommended - Free Tier Available)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

#### Step 3: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name:** basho-pottery
   - **Region:** Choose closest to you
   - **Branch:** main
   - **Runtime:** Python 3
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn basho_project.wsgi:application`

#### Step 4: Add Environment Variables in Render
Add these in "Environment" section:
```
SECRET_KEY=<your-secret-key>
DEBUG=False
ALLOWED_HOSTS=basho-pottery.onrender.com
PYTHON_VERSION=3.11.0
EMAIL_HOST_USER=vinanthp@gmail.com
EMAIL_HOST_PASSWORD=pudd wqdo ygnh qnyq
RAZORPAY_KEY_ID=rzp_test_S1lAGZcFMuNU0Y
RAZORPAY_KEY_SECRET=AI3Nxw061P2yE5nTj95yaG8S
```

#### Step 5: Create build.sh
Already exists! Just verify it:
```bash
cat build.sh
```

Should contain:
```bash
#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
```

Make it executable:
```bash
chmod +x build.sh
```

---

### Option B: Deploy to **Railway** (Easy, Free Tier)

#### Step 1: Push to GitHub (same as above)

#### Step 2: Create Railway Account
1. Go to https://railway.app
2. Sign in with GitHub

#### Step 3: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository

#### Step 4: Add Environment Variables
Same as Render above, but adjust ALLOWED_HOSTS to your Railway domain.

---

### Option C: Deploy to **Heroku**

#### Step 1: Install Heroku CLI
```bash
# Check if installed
heroku --version

# If not, install:
curl https://cli-assets.heroku.com/install.sh | sh
```

#### Step 2: Login and Create App
```bash
heroku login
heroku create basho-pottery
```

#### Step 3: Set Environment Variables
```bash
heroku config:set SECRET_KEY="your-secret-key"
heroku config:set DEBUG=False
heroku config:set EMAIL_HOST_USER=vinanthp@gmail.com
heroku config:set EMAIL_HOST_PASSWORD="pudd wqdo ygnh qnyq"
heroku config:set RAZORPAY_KEY_ID=rzp_test_S1lAGZcFMuNU0Y
heroku config:set RAZORPAY_KEY_SECRET=AI3Nxw061P2yE5nTj95yaG8S
```

#### Step 4: Deploy
```bash
git push heroku main
```

#### Step 5: Run Migrations
```bash
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

---

## 📋 Files Required for Deployment (Already Present ✓)

✅ `Procfile` - Tells platform how to run the app
✅ `requirements.txt` - Python dependencies
✅ `runtime.txt` - Python version
✅ `build.sh` - Build script for deployment
✅ `frontend/build/` - React production build

---

## 🔍 Testing Before Deployment

### Test Local Production Setup:
```bash
# 1. Collect static files
python manage.py collectstatic --noinput

# 2. Set production environment
export DEBUG=False
export ALLOWED_HOSTS=localhost,127.0.0.1

# 3. Test with Gunicorn
gunicorn basho_project.wsgi:application

# 4. Visit http://localhost:8000
```

**Test these URLs:**
- `/` - Homepage ✓
- `/admin` - Admin login ✓
- `/api/products/products/` - API endpoint ✓
- `/products` - Products page ✓

---

## 🚨 Common Issues & Solutions

### Issue 1: Admin page not loading / 404 errors
**Solution:**
```bash
python manage.py collectstatic --noinput
```
Ensure `whitenoise` is in MIDDLEWARE in settings.py

### Issue 2: Static files (CSS/JS) not loading
**Solution:**
- Check `STATIC_ROOT` is set to `BASE_DIR / 'staticfiles'`
- Check `STATICFILES_STORAGE` is set to WhiteNoise
- Run `collectstatic` again

### Issue 3: Database not working on deployment
**Solution:**
- SQLite file won't persist on some platforms (Heroku)
- For permanent storage, use PostgreSQL (can do later)
- For now, migrations should create new db.sqlite3

### Issue 4: CORS errors
**Solution:**
Add your domain to CORS settings:
```python
if not DEBUG:
    CORS_ALLOWED_ORIGINS = [
        'https://your-domain.com',
        'https://www.your-domain.com',
    ]
else:
    CORS_ALLOW_ALL_ORIGINS = True
```

### Issue 5: Media files (uploaded images) not showing
**Solution:**
- User uploads won't work with SQLite on some platforms
- Need to use cloud storage (Cloudinary, AWS S3) - can add later
- For now, uploaded images work but may reset on platform restart

---

## 📝 Quick Deployment Steps Summary

1. **Build Frontend:**
   ```bash
   cd frontend && npm run build && cd ..
   ```

2. **Collect Static Files:**
   ```bash
   python manage.py collectstatic --noinput
   ```

3. **Test Locally:**
   ```bash
   gunicorn basho_project.wsgi:application
   ```

4. **Update .env with production values**

5. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

6. **Deploy to Platform:**
   - Choose Render/Railway/Heroku
   - Connect GitHub repo
   - Add environment variables
   - Deploy!

7. **After Deployment:**
   ```bash
   # On platform terminal (Render/Railway) or via CLI (Heroku)
   python manage.py migrate
   python manage.py createsuperuser
   ```

---

## 🎯 After Successful Deployment

### Access Admin Panel:
`https://your-domain.com/admin`

Login with superuser credentials you created.

### Test Everything:
- [ ] Homepage loads
- [ ] Products page loads with images
- [ ] Workshops page works
- [ ] Cart functionality works
- [ ] Checkout with Razorpay works
- [ ] Admin panel accessible
- [ ] Can login to admin
- [ ] Can add/edit products
- [ ] Email notifications work

---

## 🔐 Security Checklist

- [ ] DEBUG = False in production
- [ ] SECRET_KEY is unique and not in git
- [ ] ALLOWED_HOSTS set to your domain
- [ ] Razorpay keys are test keys (switch to live when ready)
- [ ] Gmail App Password is used (not real password)
- [ ] .env file is in .gitignore

---

## 📞 Support & Next Steps

### If deployment is successful:
1. Test all features thoroughly
2. Create test orders
3. Verify email notifications
4. Test admin panel
5. Monitor for errors

### Future Improvements:
1. Switch to PostgreSQL for better data persistence
2. Add Cloudinary/S3 for media file storage
3. Set up custom domain
4. Add SSL certificate
5. Set up Redis for Celery (background tasks)
6. Switch Razorpay to live mode

---

## 🎉 Ready to Deploy!

Your project is well-configured. Just follow the steps for your chosen platform (Render recommended for beginners).

**Need help?** Check the platform documentation or let me know which platform you're using!
