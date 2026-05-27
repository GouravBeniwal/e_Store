from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from middleware.auth_middleware import require_admin

from models.product import Product
from models.user import User
from models.order import Order

from utilis.helpers import product_to_dict

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/products', methods=['POST'])
@jwt_required()
def add_product():

    admin_error = require_admin()

    if admin_error:
        return admin_error

    data = request.get_json() or {}

    required = ['name', 'description', 'price', 'category', 'subcategory', 'product_type', 'stock']
    missing = [f for f in required if not str(data.get(f, '')).strip()]
    if missing:
        return jsonify({'message': f'Missing fields: {", ".join(missing)}'}), 400

    product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        category=data['category'],
        subcategory=data.get('subcategory',''),
        product_type=data.get('product_type',''),
        image_url=data.get('image_url',''),
        stock=data['stock']
    )

    db.session.add(product)

    db.session.commit()

    return jsonify({
        "message": "Product added successfully!",
        'product' : product_to_dict(product)
    }), 201


@admin_bp.route('/products/<int:pid>', methods=['PUT'])
@jwt_required()
def admin_update_product(pid):
    err = require_admin()
    if err: return err
    p = db.session.get(Product, pid)
    if not p: return jsonify({'message': 'Product not found'}), 404
    data = request.get_json() or {}
    p.name = data.get('name', p.name)
    p.description = data.get('description', p.description)
    p.price = float(data.get('price', p.price))
    p.category = data.get('category', p.category)
    p.subcategory = data.get('subcategory', p.subcategory)
    p.product_type = data.get('product_type', p.product_type)
    p.image_url = data.get('image_url', p.image_url)
    p.stock = int(data.get('stock', p.stock))
    db.session.commit()
    return jsonify({'message': 'Product updated!', 'product': product_to_dict(p)}), 200

@admin_bp.route('/products/<int:pid>', methods=['DELETE'])
@jwt_required()
def admin_delete_product(pid):
    err = require_admin()
    if err: return err
    p = db.session.get(Product, pid)
    if not p: return jsonify({'message': 'Product not found'}), 404
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Product deleted!'}), 200


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():

    admin_error = require_admin()

    if admin_error:
        return admin_error

    users = User.query.order_by(User.created_at.desc()).all()

    result = []

    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            'is_admin': user.is_admin,
            'created_at': user.created_at.isoformat()
        })

    return jsonify(result)


@admin_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():

    admin_error = require_admin()

    if admin_error:
        return admin_error

    orders = Order.query.order_by(Order.created_at.desc()).all()

    result = []

    for order in orders:
        result.append({
            "id": order.id,
            "user_id": order.user_id,
            "total_amount": order.total_amount,
            "status": order.status,
            'created_at': order.created_at.isoformat(),
            'item_count': len(order.items)
        })

    return jsonify(result)