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
        products = products.filter_by(category=category)
    if search:
        products = products.filter(Product.name.ilike(f'%{search}%') | Product.description.ilike(f'%{search}%'))
    return jsonify([product_to_dict(p) for p in products.order_by(Product.created_at.desc()).all()])

@product_bp.route('/products/<int:pid>', methods=['GET'])
def get_product(pid):
    p = db.session.get(Product, pid)
    if not p: return jsonify({'message': 'Product not found'}), 404
    return jsonify(product_to_dict(p))
