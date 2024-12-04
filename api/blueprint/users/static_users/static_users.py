from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
from werkzeug.security import generate_password_hash
from modules.DataBase import DBA

static_user = Blueprint("Static Login", __name__)

@static_user.route('/static_users', methods=['POST'])
def app():
    db = DBA()
    db.connect()

    app = current_app.config["app"]
    data = request.json
    username = data.get('username')
    password = generate_password_hash(data.get('password'))
    groups = data.get('groups')
    ref = data.get('ref')
    user_id = app.generate_unique_id(username, password, groups)

    try:
        sql = "SELECT id FROM user WHERE email = %s"
        app.cursor.execute(sql, (username,))
        user = app.cursor.fetchone()
        if user:
            db.disconnect()
            return jsonify({"message": "User already exists"}), 400
        
    except Error as e:
        app.app.logger.error(f"Error checking user: {e}")
        db.disconnect()
        return jsonify({"message": str(e)}), 500

    try:
        query = """INSERT INTO user (id, email, passwd, groups, createBy)
VALUES (%s, %s, %s, %s, %s);"""
        app.cursor.execute(query, (user_id, username, password, groups, ref))
        app.conn.commit()
        app.app.logger.info(f'Created new user: {username}')
        db.disconnect()
        return jsonify({"message": "User created"}), 201
    
    except Error as e:
        app.conn.rollback()
        app.app.logger.error(f"Error creating user: {e}")
        db.disconnect()
        return jsonify({"message": str(e)}), 400
