from flask import Blueprint,request, jsonify

from models.product import Product
from utilis.helpers import product_to_dict
from extensions import db
product_bp = Blueprint('products', __name__)

@product_bp.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category','').strip()
    search   = request.args.get('search',   '').strip()

    products = Product.query
    if category and category != 'all':
        parts = [part.strip() for part in category.split("/") if part.strip()]
        if len(parts) == 1:
            products = products.filter_by(category=parts[0])
        elif len(parts) == 2:
            products = products.filter_by(category=parts[0], subcategory=parts[1])
        else:
            products = products.filter_by(
                category=parts[0],
                subcategory=parts[1],
                product_type=parts[2],
            )
    if search:
        products = products.filter(Product.name.ilike(f'%{search}%') | Product.description.ilike(f'%{search}%'))
    return jsonify([product_to_dict(p) for p in products.order_by(Product.created_at.desc()).all()])

@product_bp.route('/products/suggestions', methods=['GET'])
def get_product_suggestions():
    query = request.args.get('q', '').strip()

    if not query:
        return jsonify([])

    suggestions = (
        Product.query
        .filter(Product.name.ilike(f'%{query}%'))
        .order_by(Product.name)
        .limit(10)
        .all()
    )

    return jsonify([p.name for p in suggestions])

@product_bp.route('/products/<int:pid>', methods=['GET'])
def get_product(pid):
    p = db.session.get(Product, pid)
    if not p: return jsonify({'message': 'Product not found'}), 404
    return jsonify(product_to_dict(p))
