# 🚀 Quick Deployment Commands

## Before Deployment (Run these locally):

### 1️⃣ Build Frontend
```bash
cd frontend
npm run build
cd ..
```

### 2️⃣ Collect Static Files  
```bash
python manage.py collectstatic --noinput
```

### 3️⃣ Test Production Locally
```bash
gunicorn basho_project.wsgi:application
```
Then visit: http://localhost:8000

### 4️⃣ Create Superuser (if not done)
```bash
python manage.py createsuperuser
```

---

## Push to GitHub:
```bash
git add .
git commit -m "Ready for deployment - all features complete"
git push origin main
```

---

## 🎯 Render Deployment (RECOMMENDED):

1. **Go to:** https://render.com → Sign up with GitHub

2. **New Web Service:**
   - Repository: Select your repo
   - Name: `basho-pottery`
   - Runtime: `Python 3`
   - Build Command: `./build.sh`
   - Start Command: `gunicorn basho_project.wsgi:application`

3. **Environment Variables** (Add these in Render dashboard):
   ```
   SECRET_KEY=<generate-new-one>
   DEBUG=False
   ALLOWED_HOSTS=basho-pottery.onrender.com
   EMAIL_HOST_USER=vinanthp@gmail.com
   EMAIL_HOST_PASSWORD=pudd wqdo ygnh qnyq
   RAZORPAY_KEY_ID=rzp_test_S1lAGZcFMuNU0Y
   RAZORPAY_KEY_SECRET=AI3Nxw061P2yE5nTj95yaG8S
   PYTHON_VERSION=3.11.0
   ```

4. **Generate SECRET_KEY:**
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

5. **Deploy!** → Render will automatically build and deploy

6. **After first deployment, create superuser:**
   - Go to Render dashboard → Shell
   - Run: `python manage.py createsuperuser`

---

## 🧪 Test After Deployment:

- ✅ Homepage: `https://your-app.onrender.com/`
- ✅ Admin: `https://your-app.onrender.com/admin`
- ✅ Products: `https://your-app.onrender.com/products`
- ✅ API: `https://your-app.onrender.com/api/products/products/`

---

## ⚡ Quick Troubleshooting:

**Admin not working?**
```bash
python manage.py collectstatic --noinput
```

**Database issues?**
```bash
python manage.py migrate
```

**Need to rebuild?**
- Push new changes to GitHub
- Render auto-deploys on push

---

## 📞 Your Current Setup Status:

✅ Frontend built (frontend/build/)
✅ Procfile configured  
✅ requirements.txt ready
✅ runtime.txt set to Python 3.11.0
✅ build.sh ready and executable
✅ WhiteNoise configured for static files
✅ SQLite database ready
✅ Razorpay integration complete
✅ Email system configured
✅ Toast notifications added

**You're 100% ready to deploy! 🎉**
