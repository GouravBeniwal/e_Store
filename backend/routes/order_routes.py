from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.cart import Cart
from models.order import Order, OrderItem

order_bp = Blueprint('orders', __name__)

@order_bp.route('/orders', methods=['POST'])
@jwt_required()
def place_order():

    user_id = get_jwt_identity()

    data = request.get_json() or {}

    shipping = data.get('shippingAddress') or {}
    payment_method = data.get('paymentMethod') or 'cod'

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

    # PAYMENT STATUS LOGIC (FRONTEND SIMULATED)
    payment_status = 'pending'
    if payment_method != 'cod':
        payment_status = 'initiated'

    order = Order(
        user_id=user_id,
        total_amount=grand_total,
        payment_method=payment_method,
        payment_status=payment_status,

        full_name=shipping.get('fullName', ''),
        phone=shipping.get('phone', ''),
        address=shipping.get('address', ''),
        city=shipping.get('city', ''),
        state=shipping.get('state', ''),
        pincode=shipping.get('pincode', '')
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
                "full_name": order.full_name,
                "phone": order.phone,
                "address": order.address,
                "city": order.city,
                "state": order.state,
                "pincode": order.pincode
            },
            'items': [{'product_name': i.product.name, 'quantity': i.quantity, 'price': i.price} for i in order.items]
        })

    return jsonify(result)