from datetime import datetime
from extensions import db


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=False
    )

    method = db.Column(db.String(30), nullable=False, default='cod')
    details = db.Column(db.Text)
    status = db.Column(db.String(30), nullable=False, default='pending')

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user = db.relationship('User', backref=db.backref('payments', lazy=True))
