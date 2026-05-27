from flask import Blueprint, jsonify

from extensions import db
from models.product import Product

category_bp = Blueprint('categories', __name__)

@category_bp.route('/categories', methods=['GET'])
def get_categories():

    categories = db.session.query(
        Product.category,
        Product.subcategory,
        Product.product_type,
    ).distinct().all()

    result = set()
    for category, subcategory, product_type in categories:
        if not category:
            continue
        result.add(category)
        if subcategory:
            result.add(f"{category} / {subcategory}")
        if subcategory and product_type:
            result.add(f"{category} / {subcategory} / {product_type}")

    return jsonify(sorted(result))

