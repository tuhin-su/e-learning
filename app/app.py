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
    
    def generate_signature(self, email, password, group):
    # Concatenate the parameters with a delimiter
        data = f"{email}:{password}:{group}"
        
        # Create a SHA-256 hash object
        hash_object = hashlib.sha256(data.encode())
        
        # Get the hexadecimal representation of the hash
        signature = hash_object.hexdigest()
        
        return signature

    def close_connection(self):
        if self.conn and self.conn.is_connected():
            self.cursor.close()
            self.conn.close()
            print("MySQL connection is closed")
            
    def create_app(self):
        @self.app.route('/ver', methods=['GET'])
        def version():
            query="SELECT MAX(version) AS ver FROM resource;";
            self.cursor.execute(query)
            ver = self.cursor.fetchone()
            if ver:
                return jsonify({"version": ver['ver']})
            return jsonify({"message": "Server Broke"}), 521

        @self.app.route('/login', methods=['POST'])
        def login():
            data = request.json
            username = data.get('username')
            password = data.get('password')

            # Use parameterized query to prevent SQL injection
            query = "SELECT id, passwd FROM user WHERE email = %s AND status = 0"
            self.cursor.execute(query, (username,))
            user = self.cursor.fetchone()
           
            if user and check_password_hash(user['passwd'], password):
                user_id = user['id']
                response = {}
                query = "SELECT name,email,phone,address,gender,birth FROM user_info WHERE  user_id = %s;"
                self.cursor.execute(query, (user_id,))
                user_info=self.cursor.fetchone()
                if user_info:
                    response['info']=user_info;
                    
                expiration = datetime.utcnow() + self.token_expiration
                token = jwt.encode({'user_id': user_id, 'exp': expiration}, self.token_secret, algorithm='HS256')
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
            ids  = self.generate_signature(username, password, groups);
            try:
                # Use parameterized query to prevent SQL injection
                query = "INSERT INTO user (id, email, passwd, groups) VALUES (%s, %s, %s, %s)"
                self.cursor.execute(query, (ids,username, password, groups))
                self.conn.commit()
                self.app.logger.info(f'Created new user: {username}')
                return jsonify({"message": "User created"}), 201
            except Error as e:
                self.conn.rollback()
                return jsonify({"message": str(e)}), 400

        @self.app.route('/logout', methods=['POST'])
        @self.auth.login_required
        def logout():
            self.app.logger.info(f'User {self.auth.current_user()} logged out.')
            return jsonify({"message": "Logged out successfully"})

        @self.app.route('/create_account', methods=['POST'])
        @self.auth.login_required
        def create_user():
            data = request.json
            self.app.logger.info(f'User {self.auth.current_user()} logged out.')
            return jsonify({"message": self.auth.current_user(), "data": data.get('data')})
        
        @self.app.route('/secure-data', methods=['GET'])
        @self.auth.login_required
        def secure_data():
            user_id = self.auth.current_user()
            self.app.logger.info(f'User {user_id} accessed secure data.')
            return jsonify({"data": "This is secured data"})

        @self.auth.verify_token
        def verify_token(token):
            try:
                payload = jwt.decode(token, self.token_secret, algorithms=['HS256'])
                return payload['user_id']
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
