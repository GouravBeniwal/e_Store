from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.cart import Cart
from models.product import Product
from models.user import User

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():

    user_id = get_jwt_identity()

    items = Cart.query.filter_by(user_id=user_id).all()

    result = []

    for item in items:
        result.append({
            "id": item.id,
            "quantity": item.quantity,
            "product": {
                "id": item.product.id,
                "name": item.product.name,
                "price": item.product.price,
                "image_url": item.product.image_url,
                "stock": item.product.stock
            }
        })

    return jsonify(result)


@cart_bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user and user.is_admin:
        return jsonify({'message': 'Admin accounts cannot add items to cart'}), 403

    data = request.get_json() or {}

    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "message": "Product not found"
        }), 404
    if product.stock < quantity :
        return jsonify({
            'message' : f'Only {product.stock} item(s) in stock'
            }), 400
    existing = Cart.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()

    if existing:
        existing.quantity += quantity
        if existing.quantity > product.stock: return jsonify({'message': f'Cannot add more. Only {product.stock} in stock'}), 400
    else:
        item = Cart(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity
        )

        db.session.add(item)

    db.session.commit()

    return jsonify({
        "message": f'"{product.name} added to cart!"'
    }), 201


@cart_bp.route('/cart/<int:cart_id>', methods=['PUT'])
@jwt_required()
def update_cart(cart_id):

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user and user.is_admin:
        return jsonify({'message': 'Admin accounts cannot modify the cart'}), 403

    item = Cart.query.filter_by(
        id=cart_id,
        user_id=user_id
    ).first()

    if not item:
        return jsonify({
            "message": "Cart item not found"
        }), 404

    data = request.get_json() or {}

    quantity = int(data.get('quantity', 1))

    if quantity < 1:
        db.session.delete(item)
    elif quantity > item.product.stock:
        return jsonify({'message': f'Only {item.product.stock} in stock'}), 400
    else:
        item.quantity = quantity

    db.session.commit()

    return jsonify({
        "message": "Cart updated"
    }), 200


@cart_bp.route('/cart/<int:cart_id>', methods=['DELETE'])
@jwt_required()
def remove_cart_item(cart_id):

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user and user.is_admin:
        return jsonify({'message': 'Admin accounts cannot modify the cart'}), 403

    item = Cart.query.filter_by(
        id=cart_id,
        user_id=user_id
    ).first()

    if not item:
        return jsonify({
            "message": "Cart item not found"
        }), 404

    db.session.delete(item)

    db.session.commit()

    return jsonify({
        "message": "Item removed from cart"
    }),200