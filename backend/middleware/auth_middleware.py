from flask_jwt_extended import get_jwt_identity
from flask import jsonify

from models.user import User

def require_admin():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({
            "message": "Admin access required"
        }), 403

    return None