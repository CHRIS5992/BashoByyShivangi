# Redis Setup for Windows (No Password Required!)

## Option 1: Download Windows Native Redis (Easiest - No Admin/Password)

### Step 1: Download Redis
1. Go to: https://github.com/tporadowski/redis/releases
2. Download: **Redis-x64-5.0.14.1.zip** (or latest version)
3. Extract to: `C:\Redis` (or any folder you prefer)

### Step 2: Start Redis Server
Open PowerShell in the Redis folder and run:
```powershell
cd C:\Redis
.\redis-server.exe
```

**Keep this window open!** Redis is now running.

### Step 3: Verify Redis is Running
Open another PowerShell window:
```powershell
cd C:\Redis
.\redis-cli.exe ping
# Should return: PONG
```

---

## Option 2: Using Chocolatey (If you have it)

```powershell
choco install redis-64
redis-server
```

---

## After Redis is Running

### Start Celery Worker
Open a **new PowerShell terminal**:
```powershell
cd c:\Users\asus\Downloads\gwoc26_SnowStack
celery -A basho_project worker --loglevel=info --pool=solo
```

### Your Setup
Now you have:
1. ✅ Django server (already running)
2. ✅ Frontend (already running)
3. ✅ Redis server (redis-server.exe)
4. ✅ Celery worker (processing emails)

## Test It!
Submit a custom order and watch real emails being sent via Gmail! 📧

---

**Direct Download Link**: https://github.com/tporadowski/redis/releases/download/v5.0.14.1/Redis-x64-5.0.14.1.zip
