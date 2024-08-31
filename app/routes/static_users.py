from flask import Blueprint, request, jsonify, g
from werkzeug.security import generate_password_hash
import hashlib
from mysql.connector import Error

static_users_bp = Blueprint('static_users', __name__)

@static_users_bp.route('/static_users', methods=['POST'])
def create_user_x():
    data = request.json
    username = data.get('username')
    password = generate_password_hash(data.get('password'))
    groups = data.get('groups')
    ids = generate_signature(username, password, groups)
    try:
        cursor = g.db.cursor()
        query = "INSERT INTO user (id, email, passwd, groups) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (ids, username, password, groups))
        g.db.commit()
        return jsonify({"message": "User created"}), 201
    except Error as e:
        g.db.rollback()
        return jsonify({"message": str(e)}), 400

def generate_signature(email, password, group):
    data = f"{email}:{password}:{group}"
    hash_object = hashlib.sha256(data.encode())
    return hash_object.hexdigest()
