import json
import os
import logging
from flask import Flask, request, jsonify
from flask_httpauth import HTTPTokenAuth
from flask_cors import CORS
import jwt
import hashlib
import time
import uuid
from datetime import datetime, timedelta
import os

## IMPORT Blueprint
from blueprint.version.version import version_bp
from blueprint.attendance.attendance import attendance_bp
from blueprint.users.login.login import login_bp
from blueprint.users.static_users.static_users import static_user
from blueprint.users.user_info.user_info import user_info
from blueprint.geo_location.geo_location import geo_lan
from blueprint.education.classes.classes import classes
from blueprint.education.students.students import students
from blueprint.org.posts.post import posts
from blueprint.org.notics.notics import notice
from blueprint.users.mng.manage import mng
from blueprint.education.info.info import info
from blueprint.public.download.download_bp import download_bp
class apiHandler:
    def __init__(self):
        self.app = Flask(__name__)
        self.app.config["app"]=self
        self.auth = HTTPTokenAuth(scheme='Bearer')
        self.host="0.0.0.0"
        self.port=5000
        self.app.logger.disabled=True
        self.app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    
        if os.getenv('LOG') == "true":
            self.app.logger.disabled=False

        if  os.getenv("ADDRESS"):
            self.host = os.getenv("ADDRESS")
            
        if os.getenv("PORT"):
            self.port = os.getenv("PORT")

        # Token configuration
        self.token_secret = self.app.config['SECRET_KEY']
        self.token_expiration = timedelta(days=3)  # Token expiration time

        self.create_app()
    
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
        self.app.register_blueprint(static_user) # static user create
        self.app.register_blueprint(user_info) # user info
        self.app.register_blueprint(geo_lan) # Collage location
        self.app.register_blueprint(classes) # Collage location
        self.app.register_blueprint(students) # Collage location
        self.app.register_blueprint(posts) # All post
        self.app.register_blueprint(notice) # All notic
        self.app.register_blueprint(mng) # All user manage
        self.app.register_blueprint(info) # give info
        self.app.register_blueprint(download_bp) # download public files
        
        @self.auth.verify_token
        def verify_token(token):
            try:
                payload = jwt.decode(token, self.token_secret, algorithms=['HS256'])
                return {"user_id": payload['user_id'], "groups": payload['groups']}
            except jwt.ExpiredSignatureError:
                return None
            except jwt.InvalidTokenError:
                return None

        @self.app.after_request
        def add_cors_headers(response):
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response
        
    def run(self):
        logging.disable(logging.CRITICAL)
        if os.getenv('LOG') == 'true':
            logging.basicConfig(filename='/app/app.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        CORS(self.app)
        self.app.run(host=self.host, port=self.port, debug=True)

if __name__ == '__main__':
    app_instance = apiHandler()
    try:
        app_instance.run()
    except Exception as e:
        print(e)
        pass

