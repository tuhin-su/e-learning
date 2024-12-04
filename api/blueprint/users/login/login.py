from werkzeug.security import check_password_hash
from flask import Flask,Blueprint ,request, jsonify,current_app
from datetime import datetime, timedelta
import jwt
from modules.DataBase import DBA
login_bp = Blueprint("login", __name__)


@login_bp.route('/login', methods=['POST'])
def login():
        db = DBA()
        db.connect()

        app = current_app.config["app"]
        data = request.json
        username = data.get('username')
        password = data.get('password')

        query = "SELECT id, passwd, groups FROM user WHERE email = %s AND status = 0"
        db.cursor.execute(query, (username,))
        user = db.cursor.fetchone()

        if user and check_password_hash(user['passwd'], password):
            user_id = user['id']
            response = {}
            response['lable'] = str(app.getLabel(user_id))
            query = "SELECT name, phone, address, gender, birth, img FROM user_info WHERE user_id = %s;"
            db.cursor.execute(query, (user_id,))
            user_info = db.cursor.fetchone()
            if user_info:
                response['info'] = user_info
                    
            expiration = datetime.now() + app.token_expiration
            token = jwt.encode({'user_id': user_id, 'groups': user['groups'], 'exp': expiration}, app.token_secret, algorithm='HS256')
            response['token'] = token

            app.app.logger.info(f'User {user_id} logged in.')
            return jsonify(response)
        return jsonify({"message": "Invalid credentials"}), 401
        