from flask import Flask, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
import urllib
import pyodbc
from flask_cors import CORS

app = Flask(__name__,static_folder='src',template_folder='src')
app.secret_key = 'your_secret_key'  # Needed for flash messages

# Replace with your actual database credentials
server = 'cyclesserver.database.windows.net'
database = 'cycles-database'
username = 'cyclesSQL'
password = 'Password123'

# Create the connection string
params = urllib.parse.quote_plus(
    f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}'
)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mssql+pyodbc:///?odbc_connect={params}'

db = SQLAlchemy(app)


class WHCUserReg(db.Model):
    __tablename__ = 'whc_user_reg'
    user_ID = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    email_address = db.Column(db.String(40), nullable=False, unique=True)
    passwordHash = db.Column(db.LargeBinary, nullable=False)
    salt = db.Column(db.LargeBinary, nullable=False)


@app.route('/')
def index():
    return send_from_directory('src', 'index.html')


@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')

    if not first_name or not last_name or not email or not password or not confirm_password:
        return jsonify({"message": "Please fill out the form!"}), 400
    if password != confirm_password:
        return jsonify({"message": "Passwords do not match!"}), 400

    existing_user = WHCUserReg.query.filter_by(email_address=email).first()
    if existing_user:
        return jsonify({"message": "Account already exists!"}), 400

    salt = generate_password_hash(password)[:32]  # Create a salt
    password_hash = generate_password_hash(password + salt)

    new_user = WHCUserReg(
        first_name=first_name,
        last_name=last_name,
        email_address=email,
        passwordHash=password_hash.encode('utf-8'),
        salt=salt.encode('utf-8')
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "You have successfully registered!"}), 200




@app.route('/check_connection')
def check_connection():
    try:
        # Try to establish a connection
        connection = pyodbc.connect(
            f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}'
        )
        connection.close()
        return jsonify({"status": "success", "message": "Connection to the database was successful."})
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to connect to the database: {str(e)}"})


if __name__ == '__main__':
    app.run(debug=True)

CORS(app)
