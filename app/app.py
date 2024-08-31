from flask import Flask, g
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
from routes import register_routes

class APIHandler:
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
        self.db_config = config['DATABASE']
        self.conn = None
        self.db_connect()
        # SSL configuration
        self.ssl_cert_path = config['SERVER']['SSL_CERT_PATH']
        self.ssl_key_path = config['SERVER']['SSL_KEY_PATH']
        self.host = config['SERVER']['HOST']
        self.port = config['SERVER']['PORT']

        # Token configuration
        self.token_secret = self.app.config['SECRET_KEY']
        self.token_expiration = timedelta(days=3)  # Token expiration time

        # Register routes
        register_routes(self.app, self.conn, self.token_secret, self.token_expiration, self.auth)
    
    def generate_signature(self, email, password, group):
        data = f"{email}:{password}:{group}"
        hash_object = hashlib.sha256(data.encode())
        return hash_object.hexdigest()

    def close_connection(self):
        if self.conn and self.conn.is_connected():
            self.conn.close()
            print("MySQL connection is closed")

    def db_connect(self):
        try:
            self.conn = mysql.connector.connect(
                host=self.db_config['HOST'], 
                database=self.db_config['NAME'], 
                user=self.db_config['USER'], 
                password=self.db_config['PASSWORD']
            )
            if self.conn.is_connected():
                self.db_info = self.conn.get_server_info()
                print(f"Connected to MySQL database... MySQL Server version on {self.db_info}")
        except Error as e:
            print(f"Error while connecting to MySQL: {e}")

    def run(self):
        @self.app.before_request
        def before_request():
            self.db_connect();
            g.db = self.conn
            g.token_secret = self.token_secret
            g.token_expiration = self.token_expiration


        @self.app.teardown_appcontext
        def teardown_appcontext(exception):
            print("Closed connection")
            self.close_connection()

        logging.basicConfig(filename='app.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        CORS(self.app)
        # self.app.run(host=self.host, port=self.port, debug=True, ssl_context=(self.ssl_cert_path, self.ssl_key_path))
        self.app.run(host=self.host, port=self.port, debug=True)

if __name__ == '__main__':
    app_instance = APIHandler()
    app_instance.run()
