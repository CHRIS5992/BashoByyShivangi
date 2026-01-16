#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Note: Frontend is pre-built locally and committed to repo
# Skipping npm build on Render (Node.js not available in Python env)
# cd frontend
# npm install
# npm run build
# cd ..

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate
