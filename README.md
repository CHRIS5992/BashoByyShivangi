# Basho By Shivangi

E-commerce platform for handcrafted ceramic products and pottery workshops.

## Tech Stack

- **Backend**: Django 6.0 + Django REST Framework
- **Frontend**: React (create-react-app)
- **Database**: SQLite (development), MySQL-ready for production

## Features

- **Products**: Browse and explore handcrafted ceramic collections
- **Workshops**: Register for pottery workshops and experiences
- **Admin Panel**: Django admin for content management
- **RESTful API**: Full-featured API with filtering and search

## Setup Instructions

1. **Create virtual environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   cd frontend && npm install && cd ..
   ```

3. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Load sample data** (optional):
   ```bash
   python load_sample_data.py
   python load_sample_workshops.py
   ```

5. **Create admin user**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Build React frontend**:
   ```bash
   cd frontend && npm run build && cd ..
   ```

7. **Run development server**:
   ```bash
   python manage.py runserver
   ```

8. **Access the application**:
   - Website: http://127.0.0.1:8000/
   - Admin Panel: http://127.0.0.1:8000/admin/


### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- Filter by: `?category=`, `?featured=`, `?sort=`

### Workshops
- `GET /api/workshops/` - List all workshops
- `GET /api/workshops/{id}/` - Get workshop details
- `GET /api/workshops/{id}/slots/` - Get available time slots
- `POST /api/registrations/` - Register for a workshop

See `WORKSHOPS_API.md` for detailed API documentation.

## Project Structure

```
basho_project/          # Django project settings
products/               # Products app (models, views, serializers)
workshops/              # Workshops app (models, views, serializers)
frontend/               # React frontend
  src/                  # React source code
  public/               # Static assets
  build/                # Production build (generated)
static/                 # Django static files
templates/              # Django templates
```

## Development

- Python virtual environment in `.venv/`
- Django admin available at `/admin/`
- React development: `cd frontend && npm start`
- Production build: `cd frontend && npm run build`

## Color Palette

- Primary: #442D1C (Dark Brown)
- Secondary: #652810, #8E5022, #C85428
- Accent: #EDD8B4 (Cream)

---
Built by SnowStack for Basho By Shivangi
