from flask import Flask, request, jsonify, session
from flask_httpauth import HTTPTokenAuth
import logging
import json
import os
import jwt
from datetime import datetime, timedelta
import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import hashlib
import time
import uuid

class apiHandler:
    def __init__(self):
        self.app = Flask(__name__)
        self.auth = HTTPTokenAuth(scheme='Bearer')
        
        # Load configuration from JSON file
        config_path = 'config.json'
        if not os.path.isfile(config_path):
            raise FileNotFoundError(f"Configuration file '{config_path}' not found.")

        with open(config_path) as config_file:
            config = json.load(config_file)

        if 'SERVER' not in config:
            raise KeyError("Missing 'SERVER' key in configuration file.")
        
        self.app.config['SECRET_KEY'] = config['SESSION']['SECRET_KEY']

        # Initialize MySQL connection
        db_config = config['DATABASE']
        self.conn = None
        self.cursor = None
        try:
            self.conn = mysql.connector.connect(
                host=db_config['HOST'], 
                database=db_config['NAME'], 
                user=db_config['USER'], 
                password=db_config['PASSWORD']
            )
            if self.conn.is_connected():
                db_info = self.conn.get_server_info()
                self.cursor = self.conn.cursor(dictionary=True)  # Use dictionary cursor to get column names
                print(f"Connected to MySQL database... MySQL Server version on {db_info}")
        except Error as e:
            print(f"Error while connecting to MySQL: {e}")

        # SSL configuration
        self.ssl_cert_path = config['SERVER']['SSL_CERT_PATH']
        self.ssl_key_path = config['SERVER']['SSL_KEY_PATH']
        self.host = config['SERVER']['HOST']
        self.port = config['SERVER']['PORT']

        # Token configuration
        self.token_secret = self.app.config['SECRET_KEY']
        self.token_expiration = timedelta(days=3)  # Token expiration time

        self.create_app()
    
    def close_connection(self):
        if self.conn and self.conn.is_connected():
            self.cursor.close()
            self.conn.close()
            print("MySQL connection is closed")
    
    def generate_unique_id(self, username, password, groups):
        unique_value = str(uuid.uuid4())
        timestamp = str(int(time.time()))
        data_to_hash = unique_value + timestamp + username + groups + password
        unique_id = hashlib.sha256(data_to_hash.encode()).hexdigest()
        return unique_id
    
    def create_app(self):
        @self.app.route('/ver', methods=['GET'])
        def version():
            # query="SELECT MAX(version) AS ver FROM resource;";
            # self.cursor.execute(query)
            # ver = self.cursor.fetchone()
            # if ver:
                return jsonify({"version": 0.1})
            # return jsonify({"message": "Server Broke"}), 521

        @self.app.route('/login', methods=['POST'])
        def login():
            data = request.json
            username = data.get('username')
            password = data.get('password')

            # Use parameterized query to prevent SQL injection
            query = "SELECT id, passwd, groups FROM user WHERE email = %s AND status = 0"
            self.cursor.execute(query, (username,))
            user = self.cursor.fetchone()
            if user and check_password_hash(user['passwd'], password):
                user_id = user['id']
                response = {}
                response['group']= user['groups']
                query = "SELECT name, phone, address, gender, birth, img FROM user_info WHERE  user_id = %s;"
                self.cursor.execute(query, (user_id,))
                user_info=self.cursor.fetchone()
                if user_info:
                    response['info']=user_info;
                    
                expiration = datetime.now() + self.token_expiration
                token = jwt.encode({'user_id': user_id, 'groups':user['groups'] ,'exp': expiration}, self.token_secret, algorithm='HS256')
                response['token']=token

                self.app.logger.info(f'User {user_id} logged in.')
                return jsonify(response)
            return jsonify({"message": "Invalid credentials"}), 401
        
        @self.app.route('/static_users', methods=['POST'])
        def create_user_x():
            data = request.json
            username = data.get('username')
            password = generate_password_hash(data.get('password'))
            groups = data.get('groups')
            user_id = self.generate_unique_id(username, password, groups);

            try:
                # Use parameterized query to prevent SQL injection
                query = "INSERT INTO user (id, email, passwd, groups) VALUES (%s, %s, %s, %s)"
                self.cursor.execute(query, (user_id, username, password, groups))
                self.conn.commit()
                self.app.logger.info(f'Created new user: {username}')
                return jsonify({"message": "User created"}), 201
            except Error as e:
                self.conn.rollback()
                return jsonify({"message": str(e)}), 400

        @self.app.route('/user_info', methods=['POST','PUT'])
        @self.auth.login_required
        def user_info():
            user_id = self.auth.current_user()
            user_id = user_id['user_id']
            data = request.json

            # Extract values from data
            name = data.get('name')
            phone = data.get('phone')
            address = data.get('address')
            gender = data.get('gender')
            birth = data.get('dob')
            img = data.get('img')

            if request.method == 'POST':
                # Handle POST request (Insert new record)
                query = """
                    INSERT INTO user_info (user_id, name, phone, address, gender, birth, img)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                """
                values = (user_id, name, phone, address, gender, birth, img)
            elif request.method == 'PUT':
                # Handle PUT request (Update existing record)
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
                return jsonify({"message": str(e)}), 400
            
        @self.app.route('/create_account', methods=['POST'])
        @self.auth.login_required
        def create_user():
            data = request.json
            self.app.logger.info(f'User {self.auth.current_user()} logged out.')
            return jsonify({"message": self.auth.current_user(), "data": data.get('data')})
        
        @self.app.route('/attendance', methods=['GET', 'POST', 'PUT'])
        @self.auth.login_required
        def attendance():
            user_id = self.auth.current_user()
            self.app.logger.info(f'User {user_id['user_id']} accessed attendance')
            if request.method == 'GET':
                if user_id['groups'] == 'ST':
                    return jsonify({
                                "lat": 26.7271012,
                                "lng": 88.3952861
                            })
                
                elif user_id['groups'] == 'FA' or user_id['groups'] == 'AD':
                    # Return attendance records for a specific user
                    stream = data.get("stream")
                    sem = data.get("sem")
                    query = """SELECT s.id
                            FROM student s
                            JOIN attends a ON s.id = %s
                            WHERE s.course = %s 
                            AND s.semester = %s;"""
                    self.cursor.execute(query, (user_id['user_id'],stream,sem))
                    attendance = self.cursor.fetchall()
                    return jsonify({"attendance": attendance})
            elif request.method == 'POST':
                data = request.json
                query = """INSERT INTO `attends` (`user_id`, `attendance_date`, `attendance_date_only`)
                        VALUES (%s, NOW(), CURDATE());"""
                try:
                    self.cursor.execute(query, (user_id['user_id'],))
                    self.conn.commit()
                    return jsonify({}), 200
                
                except mysql.connector.Error as e:
                    # Check for duplicate entry error
                    if e.errno == 1062:
                        error_message = "Attendance already recorded for this user on the same day"
                        return jsonify({"message": error_message}), 200

                    else:
                        error_message = str(e)
                    
                    # Rollback in case of error
                    self.conn.rollback()
                    
                    return jsonify({"message": error_message}), 400


            return jsonify({"data": "This is secured data"})

        @self.auth.verify_token
        def verify_token(token):
            try:
                payload = jwt.decode(token, self.token_secret, algorithms=['HS256'])
                return { "user_id":payload['user_id'], "groups":payload['groups']}
            except jwt.ExpiredSignatureError:
                return None
            except jwt.InvalidTokenError:
                return None

    def run(self):
        logging.basicConfig(filename='app.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        CORS(self.app)
        # self.app.run(host=self.host, port=self.port, debug=True, ssl_context=(self.ssl_cert_path, self.ssl_key_path))
        self.app.run(host=self.host, port=self.port, debug=True)

if __name__ == '__main__':
    app_instance = apiHandler()
    app_instance.run()