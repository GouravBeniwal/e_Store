from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.cart import Cart
from models.order import Order, OrderItem

order_bp = Blueprint('orders', __name__)

@order_bp.route('/orders', methods=['POST'])
@jwt_required()
def place_order():

    user_id = get_jwt_identity()

    cart_items = Cart.query.filter_by(
        user_id=user_id
    ).all()

    if not cart_items:
        return jsonify({
            "message": "Cart is empty"
        }), 400

    total = 0

    for item in cart_items:
        if item.product.stock < item.quantity:
            return jsonify({'message': f'Insufficient stock for {item.product.name}'}), 400
        total += item.product.price * item.quantity

    order = Order(
        user_id=user_id,
        total_amount=round(total,2)
    )

    db.session.add(order)

    db.session.flush()

    for item in cart_items:

        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )

        item.product.stock -= item.quantity

        db.session.add(order_item)

        db.session.delete(item)

    db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": order.id,
        'total':total
    }), 201


@order_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():

    user_id = get_jwt_identity()

    orders = Order.query.filter_by(
        user_id=user_id
    ).order_by(Order.created_at.desc()).all()

    result = []

    for order in orders:

        result.append({
            "id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at.isoformat(),
            'items': [{'product_name': i.product.name, 'quantity': i.quantity, 'price': i.price} for i in order.items]
        })

    return jsonify(result)