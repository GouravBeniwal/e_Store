from datetime import datetime
from extensions import db

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    description = db.Column(db.Text, nullable=False)

    price = db.Column(db.Float, nullable=False)

    category = db.Column(db.String(50), nullable=False)

    image_url = db.Column(db.String(200))

    stock = db.Column(db.Integer, default=0)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )