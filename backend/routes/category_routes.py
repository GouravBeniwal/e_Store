from flask import Blueprint, jsonify

from extensions import db
from models.product import Product

category_bp = Blueprint('categories', __name__)

@category_bp.route('/categories', methods=['GET'])
def get_categories():

    categories = db.session.query(
        Product.category
    ).distinct().all()

    result = [c[0] for c in categories if c[0]]

    return jsonify(result)