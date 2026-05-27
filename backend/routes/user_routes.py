from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.user import User

user_bp = Blueprint('users', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'username': user.username,
        'email': user.email,
        'phone': user.phone or '',
        'address': user.address or '',
        'city': user.city or '',
        'state': user.state or '',
        'pincode': user.pincode or '',
    })


@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json() or {}
    username = (data.get('username') or '').strip()
    phone = (data.get('phone') or '').strip()
    address = (data.get('address') or '').strip()
    city = (data.get('city') or '').strip()
    state = (data.get('state') or '').strip()
    pincode = (data.get('pincode') or '').strip()

    if not username:
        return jsonify({'message': 'Username cannot be empty'}), 400

    user.username = username
    user.phone = phone
    user.address = address
    user.city = city
    user.state = state
    user.pincode = pincode

    db.session.commit()

    return jsonify({'message': 'Profile updated successfully'})
