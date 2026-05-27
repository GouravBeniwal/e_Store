from datetime import datetime
from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(
        db.String(80),
        unique=True,
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(200),
        nullable=False
    )

    is_admin = db.Column(
        db.Boolean,
        default=False
    )

    phone = db.Column(
        db.String(20)
    )

    address = db.Column(
        db.Text
    )

    city = db.Column(
        db.String(80)
    )

    state = db.Column(
        db.String(80)
    )

    pincode = db.Column(
        db.String(15)
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )