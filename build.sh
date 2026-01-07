#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies and build React app
cd frontend
npm install
npm run build
cd ..

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate
