"""Populate the database with sample products using local dummy images."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.product import Product
from extensions import db
from app import app
from models.user import User
Product
import bcrypt

PRODUCTS = [
{"name": "Urban Crew Tee", "description": "Soft cotton t-shirt with a modern crew neck fit.", "price": 799, "category": "Fashion / Men / T-Shirts", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 45},
{"name": "Performance Graphic Tee", "description": "Breathable performance tee for workouts and everyday wear.", "price": 899, "category": "Fashion / Men / T-Shirts", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 28},
{"name": "Organic Cotton Polo", "description": "Premium organic polo with stretch comfort.", "price": 1099, "category": "Fashion / Men / T-Shirts", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 36},
{"name": "Oxford Button-Up Shirt", "description": "Smart Oxford shirt for office or weekend styling.", "price": 1399, "category": "Fashion / Men / Shirts", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 30},
{"name": "Chambray Work Shirt", "description": "Casual chambray shirt with easy layering.", "price": 1299, "category": "Fashion / Men / Shirts", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 22},
{"name": "Slim Fit Dress Shirt", "description": "Tailored dress shirt for sharp event looks.", "price": 1499, "category": "Fashion / Men / Shirts", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 18},
{"name": "Linen Travel Chino", "description": "Lightweight chinos built for travel comfort.", "price": 1599, "category": "Fashion / Men / Pants", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 40},
{"name": "Stretch Jogger Pants", "description": "Athleisure joggers with stretch waistband.", "price": 1199, "category": "Fashion / Men / Pants", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 34},
{"name": "Classic Denim Jeans", "description": "Durable denim jeans with relaxed fit.", "price": 1699, "category": "Fashion / Men / Pants", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 26},
{"name": "Floral Midi Dress", "description": "Romantic midi dress with floral print.", "price": 1899, "category": "Fashion / Women / Dresses", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 20},
{"name": "Satin Slip Dress", "description": "Smooth satin slip dress for evening wear.", "price": 1999, "category": "Fashion / Women / Dresses", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 14},
{"name": "Wrap Shirt Dress", "description": "Comfortable wrap dress with waist tie.", "price": 1599, "category": "Fashion / Women / Dresses", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 22},
{"name": "Rib Knit Tank", "description": "Soft ribbed tank for layering or summer styling.", "price": 899, "category": "Fashion / Women / Tops", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 33},
{"name": "Pleated Blouse", "description": "Chic blouse with pleated detail.", "price": 1199, "category": "Fashion / Women / Tops", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 27},
{"name": "Silk Camisole", "description": "Light camisole with silky finish.", "price": 1299, "category": "Fashion / Women / Tops", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 24},
{"name": "High Rise Skinny Jeans", "description": "Figure-flattering skinny jeans with stretch.", "price": 1699, "category": "Fashion / Women / Jeans", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 18},
{"name": "Wide Leg Denim", "description": "Comfortable wide leg jeans for everyday wear.", "price": 1799, "category": "Fashion / Women / Jeans", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 20},
{"name": "Cropped Straight Jeans", "description": "Classic straight-leg jeans with cropped hem.", "price": 1599, "category": "Fashion / Women / Jeans", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 25},
{"name": "Kids Graphic Hoodie", "description": "Colourful hoodie for children with soft fleece lining.", "price": 899, "category": "Fashion / Kids / Clothing", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 28},
{"name": "Toddler Denim Jacket", "description": "Light denim jacket perfect for active kids.", "price": 1099, "category": "Fashion / Kids / Clothing", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 22},
{"name": "Active Shorts", "description": "Durable shorts for playtime and sports.", "price": 799, "category": "Fashion / Kids / Clothing", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 35},
{"name": "Neo Android Phone", "description": "Android phone with vibrant display and fast performance.", "price": 24999, "category": "Technology / Mobile / Android", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 12},
{"name": "Pro Android Camera", "description": "High-resolution pocket camera built for Android users.", "price": 5499, "category": "Technology / Mobile / Android", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 18},
{"name": "Android Fitness Watch", "description": "Fitness watch with Android companion app.", "price": 3999, "category": "Technology / Mobile / Android", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 26},
{"name": "Lumen iPhone Case", "description": "Premium case for iOS devices with shock protection.", "price": 899, "category": "Technology / Mobile / iOS", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 48},
{"name": "AirPod Style Earbuds", "description": "Wireless earbuds optimized for iOS audio.", "price": 2899, "category": "Technology / Mobile / iOS", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 32},
{"name": "Fast Charge Powerbank", "description": "Compact powerbank with fast iOS charging.", "price": 1499, "category": "Technology / Mobile / iOS", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 29},
{"name": "Pixel Blade Laptop", "description": "Gaming laptop with RGB keyboard and powerful graphics.", "price": 64999, "category": "Technology / Laptop / Gaming", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 10},
{"name": "Ultra Gaming Laptop", "description": "High-performance laptop built for gamers.", "price": 75999, "category": "Technology / Laptop / Gaming", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 8},
{"name": "Creator Studio Laptop", "description": "Laptop for creators with color-accurate display.", "price": 69999, "category": "Technology / Laptop / Gaming", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 12},
{"name": "MagSafe Wireless Charger", "description": "Fast wireless charger for compatible accessories.", "price": 1999, "category": "Technology / Accessories / Chargers", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 36},
{"name": "Compact USB-C Hub", "description": "Multi-port USB-C hub for laptop accessories.", "price": 1599, "category": "Technology / Accessories / Chargers", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 28},
{"name": "Fast Charging Cable", "description": "Durable braided cable for fast charging.", "price": 799, "category": "Technology / Accessories / Chargers", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 42},
{"name": "Organic Espresso Beans", "description": "Rich espresso beans with aromatic crema.", "price": 899, "category": "Grocery / Beverages / Coffee", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 34},
{"name": "Cold Brew Coffee Pack", "description": "Ready-to-brew coffee pack for cold brew lovers.", "price": 999, "category": "Grocery / Beverages / Coffee", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 26},
{"name": "Instant Coffee Tin", "description": "Easy instant coffee for busy mornings.", "price": 749, "category": "Grocery / Beverages / Coffee", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 30},
{"name": "Chamomile Tea Bags", "description": "Relaxing tea bags made from natural chamomile.", "price": 599, "category": "Grocery / Beverages / Tea", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 40},
{"name": "Masala Chai Blend", "description": "Spiced chai tea blend for classic flavor.", "price": 649, "category": "Grocery / Beverages / Tea", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 38},
{"name": "Green Tea Gift Set", "description": "Premium green tea set with assorted flavors.", "price": 899, "category": "Grocery / Beverages / Tea", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 22},
{"name": "Chocolate Chip Cookies", "description": "Crispy cookies with rich chocolate chips.", "price": 499, "category": "Grocery / Snacks / Cookies", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 46},
{"name": "Oatmeal Raisin Cookies", "description": "Wholesome oatmeal cookies with raisins.", "price": 549, "category": "Grocery / Snacks / Cookies", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 32},
{"name": "Butter Shortbread", "description": "Rich shortbread biscuits for tea time.", "price": 599, "category": "Grocery / Snacks / Cookies", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 28},
{"name": "Ambient LED Lamp", "description": "Soft ambient lamp perfect for home décor.", "price": 2499, "category": "Decoration / Home / Lighting", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 19},
{"name": "Candle Lantern Set", "description": "Decorative lanterns for cozy lighting.", "price": 1799, "category": "Decoration / Home / Lighting", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 21},
{"name": "Wall Sconce Light", "description": "Wall-mounted sconce for modern spaces.", "price": 2199, "category": "Decoration / Home / Lighting", "image_url": "http://127.0.0.1:5000/static/images/bottle.jpg", "stock": 15},
{"name": "Minimal Desk Organizer", "description": "A tidy desk organizer for office essentials.", "price": 999, "category": "Decoration / Office / Desk", "image_url": "http://127.0.0.1:5000/static/images/bottle2.jpg", "stock": 29},
{"name": "Compact Monitor Stand", "description": "Raise your monitor and free desk space.", "price": 1299, "category": "Decoration / Office / Desk", "image_url": "http://127.0.0.1:5000/static/images/bottle3.jpg", "stock": 24},
{"name": "Leather Mouse Pad", "description": "Premium mouse pad for comfort and style.", "price": 799, "category": "Decoration / Office / Desk", "image_url": "http://127.0.0.1:5000/static/images/bottle4.jpg", "stock": 34},
]

with app.app_context():
    db.create_all()

    # Admin user
    if not User.query.filter_by(email='admin@shop.com').first():
        hashed = bcrypt.hashpw(b'admin123', bcrypt.gensalt())
        admin  = User(username='admin', email='admin@shop.com', password=hashed.decode(), is_admin=True)
        db.session.add(admin)
        print("Admin created  →  email: admin@shop.com  |  password: admin123")

    # Demo user
    if not User.query.filter_by(email='user@shop.com').first():
        hashed = bcrypt.hashpw(b'user123', bcrypt.gensalt())
        demo   = User(username='demouser', email='user@shop.com', password=hashed.decode(), is_admin=False)
        db.session.add(demo)
        print("Demo user created  →  email: user@shop.com  |  password: user123")

    # Products
    if Product.query.count() == 0:
        for p in PRODUCTS:
            if isinstance(p.get('category'), str) and '/' in p['category']:
                parts = [part.strip() for part in p['category'].split('/') if part.strip()]
                p['category'] = parts[0] if len(parts) > 0 else ''
                p['subcategory'] = parts[1] if len(parts) > 1 else ''
                p['product_type'] = parts[2] if len(parts) > 2 else ''
            db.session.add(Product(**p))
        print(f"{len(PRODUCTS)} products added.")

    db.session.commit()
    print("Database seeded successfully!")
