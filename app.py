from flask import Flask, jsonify, redirect, render_template, request, url_for
import sqlite3
import random
import validate_phone as vp
from email_validator import validate_email, EmailNotValidError
dbname = 'ecommerce.db'
app = Flask(__name__,template_folder='templates',static_folder='static')
app.secret_key = 'beniwal'
def get_db():
    conn = sqlite3.connect(dbname)
    return conn
def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                phone TEXT NOT NULL,
                gender TEXT NOT NULL
            )
        ''')
        conn.commit()
@app.route('/')
def base():
    return render_template('base.html')

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/show',methods=['GET'])
def show():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users')
        users = cursor.fetchall()
    return jsonify(users)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        uname = request.form['name']
        uemail = request.form['email']
        uphone = request.form['phone']
        ugender = request.form['gender']

        # ADD Validaters here
        try:
            valid = validate_email(uemail)
            uemail = valid.email
        except EmailNotValidError:
            return "Invalid Email"
        if not vp.validate_phone().is_valid(uphone):
            return "Invalid Phone Number"
        if not uname or not uemail or not uphone or not ugender:
            return "All fields are required!", 400
        else:
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO users (name, email, phone, gender)
                    VALUES (?, ?, ?, ?)
                ''', (uname, uemail, uphone, ugender))
                conn.commit() 
            print(f"Received data: Name={uname}, Email={uemail}, Phone={uphone}, Gender={ugender}")
            return redirect(url_for('home', message="Registration successful!"))
    return render_template('register.html')

if __name__ == '__main__':
        init_db()
        app.run(debug=True)