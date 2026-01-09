# Real-Time Email Setup for Custom Orders

This guide explains how to run the Celery worker for real-time (asynchronous) email delivery.

## Prerequisites

1. **Redis** must be installed and running on your system
2. Python dependencies installed: `pip install -r requirements.txt`

## Installing Redis

### Option 1: Windows with WSL2 (Recommended)
```bash
# In WSL2 terminal
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

### Option 2: Windows Native
Download and install from: https://github.com/tporadowski/redis/releases
Or use: `choco install redis-64` (if you have Chocolatey)

### Option 3: Docker
```bash
docker run -d -p 6379:6379 redis:alpine
```

## Running the Application

You need **3 terminal windows** running simultaneously:

### Terminal 1: Redis Server
```bash
# WSL2
sudo service redis-server start

# Windows native/Docker
redis-server

# Verify it's running
redis-cli ping
# Should return: PONG
```

### Terminal 2: Celery Worker
```bash
cd c:\Users\asus\Downloads\gwoc26_SnowStack

# Windows uses 'solo' pool (eventlet/gevent don't work well on Windows)
celery -A basho_project worker --loglevel=info --pool=solo
```

### Terminal 3: Django Server
```bash
cd c:\Users\asus\Downloads\gwoc26_SnowStack
python manage.py runserver
```

## How It Works

1. **User submits custom order** → Django API responds immediately
2. **Email tasks queued in Redis** → User gets instant confirmation
3. **Celery worker processes emails** → Sends in background without blocking

## Testing

1. Submit a custom order through the frontend
2. Check Terminal 2 (Celery worker) - you should see:
   ```
   [2026-01-08 20:16:00,000: INFO/MainProcess] Task products.tasks.send_custom_order_admin_email[...] received
   [2026-01-08 20:16:01,000: INFO/MainProcess] Task products.tasks.send_custom_order_admin_email[...] succeeded
   ```
3. Emails will print to the terminal (console backend)

## Troubleshooting

### "Cannot connect to Redis"
- Ensure Redis is running: `redis-cli ping`
- Check Redis is on port 6379: `netstat -an | findstr 6379`

### Celery worker not picking up tasks
- Restart the worker
- Check for Python errors in worker terminal
- Verify `basho_project/__init__.py` imports celery app

### Emails not sending
- Check Celery worker logs for errors
- Verify email settings in `basho_project/settings.py`
- For production, configure SMTP settings

## Production Deployment

For production, configure real SMTP email backend in `settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
```

And run Celery with a process manager like systemd or supervisor.
