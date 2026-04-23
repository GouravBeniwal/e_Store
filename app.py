from flask import Flask, redirect, render_template, request, jsonify
import sqlite3, re, jwt, datetime
from flask_bcrypt import Bcrypt
from functools import wraps
app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = 'beniwal'
bcrypt = Bcrypt(app)
dbname = 'database.db'
def init_db():
    conn = sqlite3.connect(dbname)
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()

# ---------------- Validation ----------------
def valid_email(e):
    return re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', e)

def valid_password(p):
    return len(p) >= 8

# ---------------- Token Helpers ----------------
def create_access_token(user_id):
    return jwt.encode({
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    }, app.secret_key, algorithm="HS256")

def create_refresh_token(user_id):
    return jwt.encode({
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, app.secret_key, algorithm="HS256")

# ----------------- API Security Decorator -----------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error":"token missing"}), 401

        try:
            token = token.split(" ")[1]  # Remove "Bearer " prefix
            data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
            request.user_id = data['user_id']
        except jwt.InvalidTokenError:
            return jsonify({"error":"Invalid token"})
        except Exception as e:
            return jsonify({"error": str(e)})
        return f(*args, **kwargs)
    return decorated

# Sample product data
PRODUCTS = [
    {"id": 1, "name": "DermaVerde Serum", "price": 329, "category": "Skincare", "tag": "New", "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80"},
    {"id": 2, "name": "PureGlow Lotion", "price": 499, "category": "Skincare", "tag": "Bestseller", "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80"},
    {"id": 3, "name": "ElevateDesk Pro", "price": 1490, "category": "Furniture", "tag": "Featured", "image": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80"},
    {"id": 4, "name": "Velvet Throw", "price": 189, "category": "Home", "tag": "New", "image": "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=500&q=80"},
    {"id": 5, "name": "Linen Blazer", "price": 295, "category": "Apparel", "tag": "", "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80"},
    {"id": 6, "name": "Ceramic Vase Set", "price": 149, "category": "Home", "tag": "New", "image": "https://images.unsplash.com/photo-1612196808214-b7e239e5f2b4?w=500&q=80"},
]

COLLECTIONS = [
    {"name": "Skincare", "desc": "Glow daily with essentials for healthy, radiant skin.", "image": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80"},
    {"name": "Furniture", "desc": "Modern, timeless pieces to style every space.", "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"},
    {"name": "Technology", "desc": "Smart, innovative gadgets for everyday life.", "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80"},
    {"name": "Apparel", "desc": "Effortless, stylish staples for any wardrobe.", "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80"},
]

TESTIMONIALS = [
    {"text": "Ben's Store made setting up my online store so easy! The design is sleek and my customers love the new look.", "name": "Emily Carter", "role": "Boutique Owner"},
    {"text": "I've tried several eCommerce templates before, but Ben's Store stands out. Stylish, user-friendly, and perfectly suited for my shop.", "name": "Daniel Reed", "role": "Home & Living Store Founder"},
    {"text": "As a small business owner, I needed something simple yet professional. Ben's Store delivered beyond expectations.", "name": "Sophia Nguyen", "role": "Handmade Goods Seller"},
]

@app.route('/')
@token_required
def index():
    return render_template('index.html', products=PRODUCTS[:3], collections=COLLECTIONS, testimonials=TESTIMONIALS)

@app.route('/shop')
@token_required
def shop():
    return render_template('shop.html', products=PRODUCTS)

@app.route('/product/<int:product_id>')
@token_required
def product(product_id):
    prod = next((p for p in PRODUCTS if p['id'] == product_id), None)
    return render_template('product.html', product=prod, related=PRODUCTS[:3])

@app.route('/about')
@token_required
def about():
    return render_template('about.html')

@app.route('/subscribe', methods=['POST'])
@token_required
def subscribe():
    email = request.form.get('email', '')
    return jsonify({"success": True, "message": f"Thanks! {email} subscribed."})

# ---------------- Authentication ----------------
@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method == 'GET':
        return render_template("signup.html")

    email = request.form.get("email")
    password = request.form.get("password")

    if not valid_email(email):
        return "Invalid email"

    if not valid_password(password):
        return "Weak password"

    hashed = bcrypt.generate_password_hash(password).decode()

    try:
        conn = sqlite3.connect(dbname)
        cur = conn.cursor()
        cur.execute("INSERT INTO users(email,password) VALUES(?,?)",(email,hashed))
        conn.commit()
        conn.close()
    except:
        return "User exists"

    return redirect("/")

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template("login.html")

    email = request.form.get("email")
    password = request.form.get("password")

    conn = sqlite3.connect(dbname)
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email=?",(email,))
    user = cur.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user[2], password):
        access = create_access_token(user[0])
        refresh = create_refresh_token(user[0])

        return jsonify({"access_token": access,
                        "refresh_token": refresh})
    

    return "Invalid credentials"
@app.route('/show')
@token_required
def show():
    conn = sqlite3.connect(dbname)
    cur = conn.cursor()
    cur.execute("SELECT * FROM users")
    users = cur.fetchall()
    conn.close()

    return jsonify(users)
@app.route('/profile_page')
@token_required
def profile_page():
    return render_template("profile.html")

@app.route('/profile')
@token_required
def profile():
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"error":"No token provided"}), 401

    try:
        token = token.split(" ")[1]  # Remove "Bearer " prefix        
        data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        user_id = data['user_id']

        conn = sqlite3.connect(dbname)
        cur = conn.cursor()
        cur.execute("SELECT email FROM users WHERE id=?",(user_id,))
        user = cur.fetchone()
        conn.close()

        return jsonify({"email": user[0]})
    except jwt.ExpiredSignatureError:
        return jsonify({"error":"Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error":"Invalid token"}), 401
    except IndexError:
        return jsonify({"error":"User not found"}), 404
    except:
        return jsonify({"error":"Invalid token"})

@app.route('/refresh', methods=['POST'])
def refresh():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error":"No token provided"}), 401
    try:
        token = token.split(" ")[1]  # Remove "Bearer " prefix
        data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        print('Decoded data:', data)  # Debugging line
        new_access = create_access_token(data['user_id'])

        return jsonify({"access_token": new_access})

    except:
        return jsonify({"error":"Invalid refresh token"}), 401

if __name__ == '__main__':
    app.run(debug=True)
