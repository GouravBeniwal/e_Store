from flask import Flask, render_template, request



dbname = 'ecommerce_db'
app = Flask(__name__,template_folder='templates',static_folder='static')


@app.route('/')
def base():
    return render_template('base.html')

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    # if request.method == 'POST':
    #     uname = request.form['name']
    #     uemail = request.form['email']
    #     uphone = request.form['phone']
    #     ugender = request.form['gender']

    #     # ADD Validaters here
    #     if not uname or not uemail or not uphone or not ugender:
    #         return "All fields are required!", 400
    #     else:
    #         # Database connection and insertion logic here
    #         print(f"Received data: Name={uname}, Email={uemail}, Phone={uphone}, Gender={ugender}")
    #         return "Registration successful!", 200
    return render_template('register.html')

if __name__ == '__main__':
    app.run(debug=True)