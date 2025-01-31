from werkzeug.security import check_password_hash
from flask import Flask,Blueprint ,request, jsonify,current_app
from datetime import datetime, timedelta
import jwt
from modules.DataBase import DBA
from modules.utilty import getLabel
from mysql.connector import Error

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
        try:
            db.cursor.execute(query, (username,))
            user = db.cursor.fetchone()
        except:
            db.disconnect()
            return jsonify({"message": "Internal server error code: DEC"}), 500

        if user and check_password_hash(user['passwd'], password):
            user_id = user['id']
            response = {}
            response['lable'] = str(getLabel(user_id))
            query = "SELECT name, phone, address, gender, birth, img FROM user_info WHERE user_id = %s;"
            try:
                db.cursor.execute(query, (user_id,))
                user_info = db.cursor.fetchone()
            except:
                db.disconnect()
                return jsonify({"message": "Internal server error code: DEC"}), 500
            
            if user_info:
                response['info'] = user_info
                    
            expiration = datetime.now() + app.token_expiration
            token = jwt.encode({'user_id': user_id, 'groups': user['groups'], 'exp': expiration}, app.token_secret, algorithm='HS256')
            response['token'] = token

            app.app.logger.info(f'User {user_id} logged in.')
            return jsonify(response)
        return jsonify({"message": "Invalid credentials"}), 401
def genrateSessinKey(agent, app):
    length = len(agent)
    third = length // 3

    part1 = agent[:third]
    part2 = agent[third:2*third]
    part3 = agent[2*third:]
    return app.generate_unique_id(part1, part2, part3)
    
@login_bp.route('/user/login/weblogin/<key>', methods=['GET', 'POST'])
def weblogin(key):
    if key == None or key == "":
        return jsonify({"key": "Invalid Request Key not found"}), 400
        
    app = current_app.config["app"]
    db = DBA()
    
    try:
        db.connect()
    except:
        return jsonify({"message": "Internal server error code: DEC"}), 500

    if request.method == 'POST':
        if key == "auth":
            data = request.json
            return jsonify({"key": data}), 400
        
        return jsonify({"key": "Invalid Request Type"}), 400
    
    agent = request.headers.get('User-Agent')
    if key == "new":
        randome = genrateSessinKey(agent, app)

        try:
            sql = """INSERT INTO `web_login`(`key`, `last_login`) VALUES (%s, CURRENT_TIMESTAMP);"""
            db.cursor.execute(sql, (randome,))
            db.conn.commit()
        except Error as e:
            db.disconnect()
            db.conn.rollback()
            return jsonify({"message": str(e)}), 500
        
        return jsonify({"key": randome}), 200
    else:
        try:
            sql = """SELECT `createDate` FROM `web_login` WHERE `key` = %s;"""
            db.cursor.execute(sql, (key,))
            data = db.cursor.fetchone()
            if data == None:
                db.disconnect()
                return jsonify({"message": "Invalid Request Key Invalid"}), 400
            
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 500
        
        
        if datetime.now() - data['createDate'] >= timedelta(seconds=15):
            randome = genrateSessinKey(agent, app)
            try:
                sql = """UPDATE `web_login` SET `key` = %s, `last_login` = CURRENT_TIMESTAMP, `createDate` = CURRENT_TIMESTAMP, `active` = 0 WHERE `key` = %s;"""
                db.cursor.execute(sql, (randome, key))
                db.conn.commit()
                key=randome
            except Error as e:
                db.disconnect()
                db.conn.rollback()
                return jsonify({"message": str(e)}), 500
        return jsonify({"key": key}), 200