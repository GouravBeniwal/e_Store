from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
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
        'username':user.username
    })

@auth_bp.route('/logout',methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully!'}), 200