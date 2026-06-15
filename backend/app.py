from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, jwt

def create_app():

    app = Flask(__name__, static_folder='static')

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    # Import routes here
    from routes.auth_routes import auth_bp
    from routes.user_routes import user_bp
    from routes.product_routes import product_bp
    from routes.cart_routes import cart_bp
    from routes.order_routes import order_bp
    from routes.shipping_routes import shipping_bp
    from routes.payment_routes import payment_bp
    from routes.admin_routes import admin_bp
    from routes.category_routes import category_bp

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(product_bp, url_prefix='/api')
    app.register_blueprint(cart_bp, url_prefix='/api')
    app.register_blueprint(order_bp, url_prefix='/api')
    app.register_blueprint(shipping_bp, url_prefix='/api')
    app.register_blueprint(payment_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(category_bp, url_prefix='/api')
    # app.register_blueprint(wishlist_bp, url_prefix='/api')

    return app


app = create_app()

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(
        debug=True,
        port=5000
    )