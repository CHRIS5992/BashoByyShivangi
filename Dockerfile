# Use Python base image
FROM python:3.12-slim

# Install Node.js
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# --- Build Frontend ---
WORKDIR /app/frontend_build
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- Setup Backend ---
WORKDIR /app

# Copy the rest of the project
COPY . .

# Copy built frontend assets to the expected location
# We do this AFTER "COPY . ." to ensure they aren't overwritten
RUN rm -rf frontend/build && \
    mkdir -p frontend/build && \
    cp -r /app/frontend_build/build/* frontend/build/

# Check if index.html exists (for debugging build logs)
RUN ls -la frontend/build/index.html

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
ENV PORT=8080
EXPOSE 8080

# Start command
CMD python manage.py migrate && gunicorn basho_project.wsgi:application --bind 0.0.0.0:$PORT --log-file -
