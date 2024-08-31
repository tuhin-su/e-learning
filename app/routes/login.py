from flask import Blueprint, request, jsonify, g
from werkzeug.security import check_password_hash
import jwt
from datetime import datetime

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    cursor = g.db.cursor(dictionary=True)
    query = "SELECT id, passwd, groups FROM user WHERE email = %s AND status = 0"
    cursor.execute(query, (username,))
    user = cursor.fetchone()
    if user and check_password_hash(user['passwd'], password):
        user_id = user['id']
        response = {}
        response['group'] = user['groups'];
        query = "SELECT name, phone, address, gender, birth FROM user_info WHERE user_id = %s;"
        cursor.execute(query, (user_id,))
        user_info = cursor.fetchone()
        if user_info:
            response['info'] = user_info

        expiration = datetime.utcnow() + g.token_expiration
        token = jwt.encode({'user_id': user_id, 'exp': expiration}, g.token_secret, algorithm='HS256')
        response['token'] = token

        return jsonify(response)
    return jsonify({"message": "Invalid credentials"}), 401
