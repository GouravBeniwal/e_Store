from datetime import datetime
from extensions import db

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=False
    )

    total_amount = db.Column(
        db.Float,
        nullable=False
    )

    status = db.Column(
        db.String(20),
        default='confirmed'
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user = db.relationship('User', backref=db.backref('orders', lazy=True))


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey('order.id'),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey('product.id'),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    price = db.Column(
        db.Float,
        nullable=False
    )

    order      = db.relationship('Order',   backref=db.backref('items',       lazy=True))
    product    = db.relationship('Product', backref=db.backref('order_items', lazy=True))
