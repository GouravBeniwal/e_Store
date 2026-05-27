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

     # ✅ PAYMENT FIELDS
    payment_method = db.Column(db.String(30), default='cod')
    payment_status = db.Column(db.String(30), default='pending')

    # ✅ SHIPPING FIELDS
    shipping_id = db.Column(
        db.Integer,
        db.ForeignKey('shipping.id'),
        nullable=False
    )

    payment_id = db.Column(
        db.Integer,
        db.ForeignKey('payment.id'),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    shipping = db.relationship('Shipping', backref=db.backref('orders', lazy=True))
    payment = db.relationship('Payment', backref=db.backref('orders', lazy=True))


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
