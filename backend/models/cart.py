from extensions import db

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey('product.id'),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        default=1
    )
    user       = db.relationship('User',    backref=db.backref('cart_items', lazy=True))
    product    = db.relationship('Product', backref=db.backref('cart_items', lazy=True))
