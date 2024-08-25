from flask import Flask, request, jsonify, session
from flask_httpauth import HTTPTokenAuth
import logging
import json
import os
import jwt
from datetime import datetime, timedelta
from module.DBHandler import DBHandler  # Ensure this path is correct

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

        # Initialize DBHandler
        db_config = config['DATABASE']
        self.db_handler = DBHandler(
            host=db_config['HOST'], 
            database=db_config['NAME'], 
            user=db_config['USER'], 
            password=db_config['PASSWORD']
        )

        # SSL configuration
        self.ssl_cert_path = config['SERVER']['SSL_CERT_PATH']
        self.ssl_key_path = config['SERVER']['SSL_KEY_PATH']
        self.host = config['SERVER']['HOST']
        self.port = config['SERVER']['PORT']

        # Token configuration
        self.token_secret = self.app.config['SECRET_KEY']
        self.token_expiration = timedelta(days=3)  # Token expiration time

        self.create_app()

    def create_app(self):
        @self.app.route('/login', methods=['POST'])
        def login():
            data = request.json
            username = data.get('username')
            password = data.get('password')
            data = self.db_handler.authenticate_user(username, password)
            if data['code'] == 200:
                user_id = data['id'];
                if user_id:
                    expiration = datetime.utcnow() + self.token_expiration
                    token = jwt.encode({'user_id': user_id, 'exp': expiration}, self.token_secret, algorithm='HS256')
                    self.app.logger.info(f'User {user_id} logged in.')
                    return jsonify({"token": token})
            return jsonify({"message": "Invalid credentials"}), 401
        
        @self.app.route('/users', methods=['POST'])
        def create_user_x():
            data = request.json
            username = data.get('username')
            password = data.get('password')
            try:
                self.db_handler.insert_user(username, password)
                self.app.logger.info(f'Created new user: {username}')
                return jsonify({"message": "User created"}), 201
            except ValueError as e:
                return jsonify({"message": str(e)}), 400
            

        @self.app.route('/logout', methods=['POST'])
        @self.auth.login_required
        def logout():
            self.app.logger.info(f'User {self.auth.current_user()} logged out.')
            return jsonify({"message": "Logged out successfully"})

        @self.app.route('/create_account', methods=['POST'])
        @self.auth.login_required
        def create_user():
            self.app.logger.info(f'User {self.auth.current_user()} logged out.')
            return jsonify({"message": self.auth.current_user()})
        
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
        self.app.run(host=self.host, port=self.port, 
                     debug=True, ssl_context=(self.ssl_cert_path, self.ssl_key_path))

if __name__ == '__main__':
    app_instance = apiHandler()
    app_instance.run()
