from app import app, db

with app.app_context():
    products = db.session.execute(db.select(db.text('1'))).fetchall()
    print("Database connection works")
    print("Products in DB:", len(products))