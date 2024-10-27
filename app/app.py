import json
import os
import logging
import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify
from flask_httpauth import HTTPTokenAuth
from flask_cors import CORS
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
import hashlib
import time
import uuid
from datetime import datetime, timedelta
import os
from modules.bot import Bot
import signal

## IMPORT Blueprint
from blueprint.version.version import version_bp
from blueprint.attendance.attendance import attendance_bp
from blueprint.login.login import login_bp

class apiHandler:
    def __init__(self):
        self.app = Flask(__name__)
        self.app.config["app"]=self
        self.auth = HTTPTokenAuth(scheme='Bearer')
        self.host="0.0.0.0"
        self.port=5000
        self.app.logger.disabled=True
        self.app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
        self.bot =  Bot(os.getenv('BOT_KEY'), os.getenv('CHANNEL_ID'), os.getenv("SERVER_NAME"), os.getenv('BOT_ENABLE'))
        self.bot.send_message("Server Strated.")
        if os.getenv('LOG') == "true":
            self.app.logger.disabled=False

        # Initialize MySQL connection
        self.conn = None
        self.cursor = None
        try:
            self.conn = mysql.connector.connect(
                host=os.getenv('DB_HOST'), 
                database=os.getenv('DB_DATABASE'),
                user=os.getenv('DB_USER'), 
                password=os.getenv('DB_PASSWORD')
            )
            if self.conn.is_connected():
                db_info = self.conn.get_server_info()
                self.cursor = self.conn.cursor(dictionary=True)  # Use dictionary cursor to get column names
                self.app.logger.info(f"Connected to MySQL database... MySQL Server version on {db_info}")
        except Error as e:
            self.bot.send_message("Error while connecting to MySQL check logs for more information.")
            self.app.logger.error(f"Error while connecting to MySQL: {e}")
            raise e

        if  os.getenv("ADDRESS"):
            self.host = os.getenv("ADDRESS")
            
        if os.getenv("PORT"):
            self.port = os.getenv("PORT")

        # Token configuration
        self.token_secret = self.app.config['SECRET_KEY']
        self.token_expiration = timedelta(days=3)  # Token expiration time

        self.create_app()
    
    def close_connection(self):
        if self.conn and self.conn.is_connected():
            self.cursor.close()
            self.conn.close()
            self.app.logger.info("MySQL connection is closed")
    
    def generate_unique_id(self, username, password, groups):
        unique_value = str(uuid.uuid4())
        timestamp = str(int(time.time()))
        data_to_hash = unique_value + timestamp + username + groups + password
        unique_id = hashlib.sha256(data_to_hash.encode()).hexdigest()
        return unique_id
    
    def create_app(self):
        self.app.register_blueprint(version_bp) # version
        self.app.register_blueprint(login_bp) # login
        self.app.register_blueprint(attendance_bp) # attendance
        
       

       
        @self.app.route('/static_users', methods=['POST'])
        def create_user_x():
            data = request.json
            username = data.get('username')
            password = generate_password_hash(data.get('password'))
            groups = data.get('groups')
            ref = data.get('ref')
            user_id = self.generate_unique_id(username, password, groups)

            try:
                query = "INSERT INTO user (id, email, passwd, groups, createBy) VALUES (%s, %s, %s, %s,%s)"
                self.cursor.execute(query, (user_id, username, password, groups, ref))
                self.conn.commit()
                self.app.logger.info(f'Created new user: {username}')
                return jsonify({"message": "User created"}), 201
            except Error as e:
                self.conn.rollback()
                self.app.logger.error(f"Error creating user: {e}")
                return jsonify({"message": str(e)}), 400

        @self.app.route('/user_info', methods=['POST', 'PUT'])
        @self.auth.login_required
        def user_info():
            user_id = self.auth.current_user()['user_id']
            data = request.json

            name = data.get('name')
            phone = data.get('phone')
            address = data.get('address')
            gender = data.get('gender')
            birth = data.get('dob')
            img = data.get('img')

            if request.method == 'POST':
                query = """
                    INSERT INTO user_info (user_id, name, phone, address, gender, birth, img)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                """
                values = (user_id, name, phone, address, gender, birth, img)
            elif request.method == 'PUT':
                query = """
                    UPDATE user_info
                    SET name = %s, phone = %s, address = %s, gender = %s, birth = %s, img = %s
                    WHERE user_id = %s;
                """
                values = (name, phone, address, gender, birth, img, user_id)
            else:
                return jsonify({"message": "Method not allowed"}), 405

            try:
                self.cursor.execute(query, values)
                self.conn.commit()
                return jsonify({"message": "User info updated"})
            except Error as e:
                self.conn.rollback()
                self.app.logger.error(f"Error updating user info: {e}")
                return jsonify({"message": str(e)}), 400
        
        @self.app.route('/create_account', methods=['POST'])
        @self.auth.login_required
        def create_user():
            data = request.json
            return jsonify({"message": self.auth.current_user(), "data": data.get('data')})
        
        @self.app.route("/location", methods=['POST','GET'])
        @self.auth.login_required
        def locationManagement():
            user_id = self.auth.current_user()
            self.app.logger.info(f'User {user_id["user_id"]} accessed location')
            if request.method == 'POST':
                data = request.json
                if not data:
                    return jsonify({"message": "No data provided"}), 400
                
                if self.getLabel(user_id['user_id']) >= 3:
                    latitude = data.get("lat")
                    longitude = data.get("lon")
                    dist = data.get("dic")
                    query = """INSERT INTO `collage_location` (`id`, `lat`, `lon`, `distend`, `createBy`, `createDate`) VALUES (NULL, %s, %s, %s, %s, current_timestamp());"""
                    try:
                        self.cursor.execute(query, (latitude, longitude, dist, user_id['user_id']))
                        self.conn.commit()
                        return jsonify({}), 200
                    except mysql.connector.Error as e:
                        error_message = str(e)
                        self.conn.rollback()
                        self.app.logger.error(e)
                    return jsonify({"message": error_message}), 400
                else:
                    return jsonify({"message": "You are not authorized to access this endpoint"}), 403
            elif request.method == 'GET':
                query = """SELECT `lat`, `lon`, `distend`
                            FROM `collage_location`
                            ORDER BY `createDate` DESC
                            LIMIT 1;
                        """
                self.cursor.execute(query)
                locations = self.cursor.fetchone()
                return jsonify({"locations": locations}), 200
            
        @self.auth.verify_token
        def verify_token(token):
            try:
                payload = jwt.decode(token, self.token_secret, algorithms=['HS256'])
                return {"user_id": payload['user_id'], "groups": payload['groups']}
            except jwt.ExpiredSignatureError:
                return None
            except jwt.InvalidTokenError:
                return None

    def getLabel(self,id):
        if id:
            query = """SELECT g.label FROM `user` u JOIN `group` g ON u.`groups` = g.`code` WHERE u.`id` = %s;"""
            try:
                self.cursor.execute(query, (id,))
                rst = self.cursor.fetchone()
                if rst != None:
                    return rst['label']
                print(rst)
            except mysql.connector.Error as e:
                self.app.logger.error(e)
                return None
            
    def run(self):
        logging.disable(logging.CRITICAL)
        if os.getenv('LOG') == 'true':
            logging.basicConfig(filename='/app/app.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        CORS(self.app)
        self.app.run(host=self.host, port=self.port, debug=True)

    def stop(self):
        self.bot.send_message("Server Stoped!")

if __name__ == '__main__':
    app_instance = apiHandler()
    signal.signal(signal.SIGTERM, app_instance.stop)
    signal.signal(signal.SIGINT, app_instance.stop)
    signal.signal(signal.SIGHUP, app_instance.stop)
    try:
        app_instance.run()
    except:
        app_instance.stop()
