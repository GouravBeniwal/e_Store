from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_cors import CORS
import bcrypt
import os
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='static')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'ecommerce.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'shopify-super-secret-2025-change-in-prod'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=12)

CORS(app, resources={r"/api/*": {"origins": "*"}, r"/images/*": {"origins": "*"}})
db  = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    username   = db.Column(db.String(80),  unique=True, nullable=False)
    email      = db.Column(db.String(120), unique=True, nullable=False)
    password   = db.Column(db.String(200), nullable=False)
    is_admin   = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text,        nullable=False)
    price       = db.Column(db.Float,       nullable=False)
    category    = db.Column(db.String(50),  nullable=False)
    image_url   = db.Column(db.String(200))
    stock       = db.Column(db.Integer, default=0)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

class Cart(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('user.id'),    nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity   = db.Column(db.Integer, default=1)
    user       = db.relationship('User',    backref=db.backref('cart_items', lazy=True))
    product    = db.relationship('Product', backref=db.backref('cart_items', lazy=True))

class Order(db.Model):
    id           = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_amount = db.Column(db.Float,   nullable=False)
    status       = db.Column(db.String(20), default='confirmed')
    created_at   = db.Column(db.DateTime,  default=datetime.utcnow)
    user         = db.relationship('User', backref=db.backref('orders', lazy=True))

class OrderItem(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    order_id   = db.Column(db.Integer, db.ForeignKey('order.id'),   nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity   = db.Column(db.Integer, nullable=False)
    price      = db.Column(db.Float,   nullable=False)
    order      = db.relationship('Order',   backref=db.backref('items',       lazy=True))
    product    = db.relationship('Product', backref=db.backref('order_items', lazy=True))

def product_to_dict(p):
    return {'id': p.id,'name': p.name,'description': p.description,'price': p.price,'category': p.category,'image_url': p.image_url,'stock': p.stock}

def require_admin(user_id):
    user = db.session.get(User, user_id)
    if not user or not user.is_admin:
        return jsonify({'message': 'Admin access required'}), 403
    return None

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'static', 'images'), filename)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = (data.get('username') or '').strip()
    email    = (data.get('email')    or '').strip().lower()
    password = (data.get('password') or '').strip()
    if not username or not email or not password:
        return jsonify({'message': 'All fields are required'}), 400
    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 409
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already taken'}), 409
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user   = User(username=username, email=email, password=hashed.decode('utf-8'))
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Account created successfully! Please log in.'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data     = request.get_json() or {}
    email    = (data.get('email')    or '').strip().lower()
    password = (data.get('password') or '').strip()
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'message': 'Invalid email or password'}), 401
    token = create_access_token(identity=user.id, additional_claims={'is_admin': user.is_admin, 'username': user.username})
    return jsonify({'access_token': token, 'is_admin': user.is_admin, 'username': user.username, 'user_id': user.id}), 200

@app.route('/api/me', methods=['GET'])
@jwt_required()
def get_me():
    user = db.session.get(User, get_jwt_identity())
    if not user: return jsonify({'message': 'User not found'}), 404
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email, 'is_admin': user.is_admin, 'created_at': user.created_at.isoformat()})

@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category', '').strip()
    search   = request.args.get('search',   '').strip()
    q = Product.query
    if category and category != 'all':
        q = q.filter_by(category=category)
    if search:
        q = q.filter(Product.name.ilike(f'%{search}%') | Product.description.ilike(f'%{search}%'))
    return jsonify([product_to_dict(p) for p in q.order_by(Product.created_at.desc()).all()])

@app.route('/api/products/<int:pid>', methods=['GET'])
def get_product(pid):
    p = db.session.get(Product, pid)
    if not p: return jsonify({'message': 'Product not found'}), 404
    return jsonify(product_to_dict(p))

@app.route('/api/categories', methods=['GET'])
def get_categories():
    cats = db.session.query(Product.category).distinct().all()
    return jsonify([c[0] for c in cats if c[0]])

@app.route('/api/cart', methods=['GET'])
@jwt_required()
def get_cart():
    uid   = get_jwt_identity()
    items = Cart.query.filter_by(user_id=uid).all()
    return jsonify([{'id': i.id, 'quantity': i.quantity, 'product': {'id': i.product.id, 'name': i.product.name, 'price': i.product.price, 'image_url': i.product.image_url, 'stock': i.product.stock}} for i in items])

@app.route('/api/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    uid  = get_jwt_identity()
    data = request.get_json() or {}
    product_id = data.get('product_id')
    quantity   = int(data.get('quantity', 1))
    if not product_id or quantity < 1:
        return jsonify({'message': 'Invalid product or quantity'}), 400
    product = db.session.get(Product, product_id)
    if not product: return jsonify({'message': 'Product not found'}), 404
    if product.stock < quantity: return jsonify({'message': f'Only {product.stock} item(s) in stock'}), 400
    item = Cart.query.filter_by(user_id=uid, product_id=product_id).first()
    if item:
        new_qty = item.quantity + quantity
        if new_qty > product.stock: return jsonify({'message': f'Cannot add more. Only {product.stock} in stock'}), 400
        item.quantity = new_qty
    else:
        item = Cart(user_id=uid, product_id=product_id, quantity=quantity)
        db.session.add(item)
    db.session.commit()
    return jsonify({'message': f'"{product.name}" added to cart!'}), 201

@app.route('/api/cart/<int:cid>', methods=['PUT'])
@jwt_required()
def update_cart_item(cid):
    uid  = get_jwt_identity()
    data = request.get_json() or {}
    quantity = int(data.get('quantity', 1))
    item = Cart.query.filter_by(id=cid, user_id=uid).first()
    if not item: return jsonify({'message': 'Cart item not found'}), 404
    if quantity < 1:
        db.session.delete(item)
    elif quantity > item.product.stock:
        return jsonify({'message': f'Only {item.product.stock} in stock'}), 400
    else:
        item.quantity = quantity
    db.session.commit()
    return jsonify({'message': 'Cart updated'}), 200

@app.route('/api/cart/<int:cid>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(cid):
    uid  = get_jwt_identity()
    item = Cart.query.filter_by(id=cid, user_id=uid).first()
    if not item: return jsonify({'message': 'Cart item not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Removed from cart'}), 200

@app.route('/api/orders', methods=['POST'])
@jwt_required()
def place_order():
    uid   = get_jwt_identity()
    items = Cart.query.filter_by(user_id=uid).all()
    if not items: return jsonify({'message': 'Your cart is empty'}), 400
    for ci in items:
        if ci.product.stock < ci.quantity:
            return jsonify({'message': f'Insufficient stock for {ci.product.name}'}), 400
    total = sum(ci.quantity * ci.product.price for ci in items)
    order = Order(user_id=uid, total_amount=round(total, 2))
    db.session.add(order)
    db.session.flush()
    for ci in items:
        oi = OrderItem(order_id=order.id, product_id=ci.product_id, quantity=ci.quantity, price=ci.product.price)
        db.session.add(oi)
        ci.product.stock -= ci.quantity
        db.session.delete(ci)
    db.session.commit()
    return jsonify({'message': 'Order placed successfully!', 'order_id': order.id, 'total': total}), 201

@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    uid    = get_jwt_identity()
    orders = Order.query.filter_by(user_id=uid).order_by(Order.created_at.desc()).all()
    return jsonify([{'id': o.id, 'total_amount': o.total_amount, 'status': o.status, 'created_at': o.created_at.isoformat(), 'items': [{'product_name': i.product.name, 'quantity': i.quantity, 'price': i.price} for i in o.items]} for o in orders])

@app.route('/api/admin/products', methods=['POST'])
@jwt_required()
def admin_add_product():
    err = require_admin(get_jwt_identity())
    if err: return err
    data = request.get_json() or {}
    required = ['name', 'description', 'price', 'category', 'stock']
    missing  = [f for f in required if not str(data.get(f,'')).strip()]
    if missing: return jsonify({'message': f'Missing fields: {", ".join(missing)}'}), 400
    p = Product(name=data['name'], description=data['description'], price=float(data['price']), category=data['category'], image_url=data.get('image_url', ''), stock=int(data['stock']))
    db.session.add(p)
    db.session.commit()
    return jsonify({'message': 'Product added successfully!', 'product': product_to_dict(p)}), 201

@app.route('/api/admin/products/<int:pid>', methods=['PUT'])
@jwt_required()
def admin_update_product(pid):
    err = require_admin(get_jwt_identity())
    if err: return err
    p = db.session.get(Product, pid)
    if not p: return jsonify({'message': 'Product not found'}), 404
    data = request.get_json() or {}
    p.name = data.get('name', p.name); p.description = data.get('description', p.description)
    p.price = float(data.get('price', p.price)); p.category = data.get('category', p.category)
    p.image_url = data.get('image_url', p.image_url); p.stock = int(data.get('stock', p.stock))
    db.session.commit()
    return jsonify({'message': 'Product updated!', 'product': product_to_dict(p)}), 200

@app.route('/api/admin/products/<int:pid>', methods=['DELETE'])
@jwt_required()
def admin_delete_product(pid):
    err = require_admin(get_jwt_identity())
    if err: return err
    p = db.session.get(Product, pid)
    if not p: return jsonify({'message': 'Product not found'}), 404
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Product deleted!'}), 200

@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def admin_get_users():
    err = require_admin(get_jwt_identity())
    if err: return err
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([{'id': u.id, 'username': u.username, 'email': u.email, 'is_admin': u.is_admin, 'created_at': u.created_at.isoformat()} for u in users])

@app.route('/api/admin/orders', methods=['GET'])
@jwt_required()
def admin_get_orders():
    err = require_admin(get_jwt_identity())
    if err: return err
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([{'id': o.id, 'user': o.user.username, 'total_amount': o.total_amount, 'status': o.status, 'created_at': o.created_at.isoformat(), 'item_count': len(o.items)} for o in orders])

if __name__ == '__main__':
    os.makedirs(os.path.join(BASE_DIR, 'instance'), exist_ok=True)
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000, use_reloader=False)
