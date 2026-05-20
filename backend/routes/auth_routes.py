from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token,jwt_required, get_jwt_identity
import bcrypt

from extensions import db
from models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():

    data = request.get_json() or {}

    username = (data.get('username') or '').strip()
    email = (data.get('email') or "").strip().lower()
    password = (data.get('password') or '').strip()

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"message": "Email already exists"}), 409

    hashed = bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    )

    user = User(
        username=username,
        email=email,
        password=hashed.decode('utf-8')
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():

    data = request.get_json() or {}

    email = (data.get('email') or '').strip().lower()
    password = (data.get('password') or '').strip()
    
    if not email or not password:
        return jsonify({'message' : 'Email and password are required'}),400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    valid = bcrypt.checkpw(
        password.encode('utf-8'),
        user.password.encode('utf-8')
    )

    if not valid:
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id,additional_claims={'is_admin': user.is_admin, 'username': user.username})

    return jsonify({
        "access_token": token,
        "is_admin":user.is_admin,
        'username':user.username,
        "user_id": user.id
    })

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():

    data = request.get_json() or {}

    current_password = (data.get('current_password') or '').strip()
    new_password = (data.get('new_password') or '').strip()

    # Validation
    if not current_password or not new_password:
        return jsonify({
            "message": "Current and new password are required"
        }), 400

    if len(new_password) < 6:
        return jsonify({
            "message": "Password must be at least 6 characters"
        }), 400

    # Get current logged-in user ID from JWT
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    # Verify current password
    valid = bcrypt.checkpw(
        current_password.encode('utf-8'),
        user.password.encode('utf-8')
    )

    if not valid:
        return jsonify({
            "message": "Current password is incorrect"
        }), 401

    # Prevent same password reuse
    same_password = bcrypt.checkpw(
        new_password.encode('utf-8'),
        user.password.encode('utf-8')
    )

    if same_password:
        return jsonify({
            "message": "New password cannot be same as current password"
        }), 400

    # Hash new password
    hashed_password = bcrypt.hashpw(
        new_password.encode('utf-8'),
        bcrypt.gensalt()
    )

    # Update password
    user.password = hashed_password.decode('utf-8')

    db.session.commit()

    return jsonify({
        "message": "Password updated successfully 🎉"
    }), 200

@auth_bp.route('/logout',methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully!'}), 200