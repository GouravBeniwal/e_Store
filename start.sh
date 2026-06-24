#!/bin/sh
set -e

cd /app/backend

# Initialize database tables and seed if empty
python -c "
from app import create_app, db
app = create_app()
with app.app_context():
    db.create_all()
"

# Start nginx in the background (serves frontend + proxies /api to gunicorn)
nginx

# Start gunicorn for the Flask backend
exec gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 2 "app:app"
