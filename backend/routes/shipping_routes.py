from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.shipping import Shipping
from models.user import User

shipping_bp = Blueprint('shipping', __name__)

@shipping_bp.route('/shipping', methods=['POST'])
@jwt_required()
def create_shipping():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user and user.is_admin:
        return jsonify({'message': 'Admin accounts cannot use checkout'}), 403
    data = request.get_json() or {}

    full_name = (data.get('fullName') or '').strip()
    phone = (data.get('phone') or '').strip()
    address = (data.get('address') or '').strip()
    city = (data.get('city') or '').strip()
    state = (data.get('state') or '').strip()
    pincode = (data.get('pincode') or '').strip()

    if not all([full_name, phone, address, city, state, pincode]):
        return jsonify({'message': 'All shipping fields are required'}), 400

    shipping = Shipping(
        user_id=user_id,
        full_name=full_name,
        phone=phone,
        address=address,
        city=city,
        state=state,
        pincode=pincode,
    )

    user = User.query.get(user_id)
    if user:
        user.phone = phone
        user.address = address
        user.city = city
        user.state = state
        user.pincode = pincode

    db.session.add(shipping)
    db.session.commit()

    return jsonify({'shipping_id': shipping.id})
