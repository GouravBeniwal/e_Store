#!/bin/bash
cd "$(dirname "$0")/backend"
echo "Starting Ben's Store backend on http://127.0.0.1:5000 ..."
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors bcrypt --break-system-packages -q 2>/dev/null
mkdir -p instance
# Seed DB if empty
python3 -c "
from app import app, db, User
with app.app_context():
    db.create_all()
    if User.query.count() == 0:
        exec(open('populate_db.py').read())
"
python3 app.py
