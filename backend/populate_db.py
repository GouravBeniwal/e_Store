"""Populate the database with sample products using local dummy images."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db, User, Product
import bcrypt

PRODUCTS = [
    {"name": "Classic Hydro Bottle",     "description": "Premium stainless-steel insulated water bottle. Keeps drinks cold 24h and hot 12h. 750ml capacity with leak-proof lid.", "price": 1299, "category": "Hydration", "image_url": "http://127.0.0.1:5000/images/bottle.jpg",  "stock": 50},
    {"name": "Sport Squeeze Bottle",     "description": "Lightweight BPA-free sport squeeze bottle with ergonomic grip. Perfect for workouts. 600ml.", "price": 699,  "category": "Hydration", "image_url": "http://127.0.0.1:5000/images/bottle2.jpg", "stock": 30},
    {"name": "Glass Infuser Bottle",     "description": "Borosilicate glass bottle with removable fruit infuser. Elegant design, eco-friendly. 500ml.", "price": 999,  "category": "Hydration", "image_url": "http://127.0.0.1:5000/images/bottle3.jpg", "stock": 25},
    {"name": "Wide Mouth Travel Bottle", "description": "Wide-mouth insulated travel bottle for outdoor adventures. Double-wall vacuum insulation. 1 litre.", "price": 1599, "category": "Hydration", "image_url": "http://127.0.0.1:5000/images/bottle4.jpg", "stock": 40},
    {"name": "Mini Pocket Bottle",       "description": "Compact 350ml bottle that fits any bag. Lightweight, BPA-free, perfect for daily carry.", "price": 499,  "category": "Hydration", "image_url": "http://127.0.0.1:5000/images/bottle.jpg",  "stock": 60},
    {"name": "Pro Athlete Jug",          "description": "1.5 litre premium jug for serious athletes. Integrated handle, measurement markers, carry loop.", "price": 1899, "category": "Sports",     "image_url": "http://127.0.0.1:5000/images/bottle2.jpg", "stock": 20},
    {"name": "Kids Fun Bottle",          "description": "Colourful, durable 400ml bottle for children. Easy-open flip top, dishwasher safe, no BPA.", "price": 449,  "category": "Kids",       "image_url": "http://127.0.0.1:5000/images/bottle3.jpg", "stock": 45},
    {"name": "Zen Ceramic Bottle",       "description": "Food-grade ceramic-coated interior for pure taste. 500ml, minimalist design, keeps flavour fresh.", "price": 2299, "category": "Premium",    "image_url": "http://127.0.0.1:5000/images/bottle4.jpg", "stock": 15},
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
            db.session.add(Product(**p))
        print(f"{len(PRODUCTS)} products added.")

    db.session.commit()
    print("Database seeded successfully!")
