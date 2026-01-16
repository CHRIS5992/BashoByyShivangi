web: cd frontend && npm install && npm run build && cd .. && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn basho_project.wsgi:application --bind 0.0.0.0:$PORT
