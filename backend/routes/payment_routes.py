import random
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.payment import Payment
from models.user import User

payment_bp = Blueprint('payments', __name__)

@payment_bp.route('/payments', methods=['POST'])
@jwt_required()
def create_payment():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user and user.is_admin:
        return jsonify({'message': 'Admin accounts cannot use checkout'}), 403
    data = request.get_json() or {}

    method = (data.get('method') or 'cod').strip().lower()
    if method not in ['cod', 'upi', 'card']:
        return jsonify({'message': 'Unsupported payment method'}), 400

    details = ''
    status = 'pending'

    if method == 'cod':
        status = 'success'
        details = 'Cash on Delivery'
    elif method == 'upi':
        upi_id = (data.get('upiId') or '').strip()
        if not upi_id:
            return jsonify({'message': 'UPI ID is required for UPI payments'}), 400
        details = f'UPI:{upi_id}'
        status = 'succeeded' if random.random() > 0.1 else 'failed'
    else:
        card_details = data.get('cardData') or {}
        name = (card_details.get('name') or '').strip()
        number = (card_details.get('number') or '').strip()
        expiry = (card_details.get('expiry') or '').strip()
        cvv = (card_details.get('cvv') or '').strip()

        if not all([name, number, expiry, cvv]):
            return jsonify({'message': 'All card details are required'}), 400

        details = f'Card:{name}|{number[-4:]}'
        status = 'succeeded' if random.random() > 0.15 else 'failed'

    payment = Payment(
        user_id=user_id,
        method=method,
        details=details,
        status=status,
    )

    db.session.add(payment)
    db.session.commit()

    if status == 'failed':
        return jsonify({'message': 'Payment authorization failed. Please try again.'}), 402

    return jsonify({'payment_id': payment.id, 'status': status})
