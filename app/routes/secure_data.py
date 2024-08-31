from flask import Blueprint, jsonify
from flask_httpauth import HTTPTokenAuth

secure_data_bp = Blueprint('secure_data', __name__)
auth = HTTPTokenAuth(scheme='Bearer')

@secure_data_bp.route('/secure-data', methods=['GET'])
@auth.login_required
def secure_data():
    user_id = auth.current_user()
    return jsonify({"data": "This is secured data"})
