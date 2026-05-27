from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.cart import Cart
from models.order import Order, OrderItem
from models.shipping import Shipping
from models.payment import Payment
from models.user import User

order_bp = Blueprint('orders', __name__)

@order_bp.route('/orders', methods=['POST'])
@jwt_required()
def place_order():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user and user.is_admin:
        return jsonify({'message': 'Admin accounts cannot place orders'}), 403

    data = request.get_json() or {}

    shipping_id = data.get('shipping_id')
    payment_id = data.get('payment_id')

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

      # SHIPPING CHARGE LOGIC
    shipping_charge = 0 if total >= 2000 else 99
    grand_total = round(total + shipping_charge, 2)

    # PAYMENT CHARGE LOGIC
    payment = Payment.query.get(payment_id)
    shipping = Shipping.query.get(shipping_id)

    if not shipping or shipping.user_id != user_id:
        return jsonify({'message': 'Invalid shipping record'}), 400

    if not payment or payment.user_id != user_id:
        return jsonify({'message': 'Invalid payment record'}), 400

    if payment.status != 'success' and payment.method != 'cod':
        return jsonify({'message': 'Payment not completed'}), 400

    order = Order(
        user_id=user_id,
        total_amount=grand_total,
        payment_method=payment.method,
        payment_status=payment.status,
        shipping_id=shipping.id,
        payment_id=payment.id
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
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "created_at": order.created_at.isoformat(),
            "shipping": {
                "full_name": order.shipping.full_name,
                "phone": order.shipping.phone,
                "address": order.shipping.address,
                "city": order.shipping.city,
                "state": order.shipping.state,
                "pincode": order.shipping.pincode
            },
            "payment": {
                "method": order.payment.method,
                "status": order.payment.status,
                "details": order.payment.details
            },
            'items': [{'product_name': i.product.name, 'quantity': i.quantity, 'price': i.price} for i in order.items]
        })

    return jsonify(result)