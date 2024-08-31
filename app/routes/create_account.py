from flask import Blueprint, request, jsonify
from flask_httpauth import HTTPTokenAuth

create_account_bp = Blueprint('create_account', __name__)
auth = HTTPTokenAuth(scheme='Bearer')

@create_account_bp.route('/create_account', methods=['POST'])
@auth.login_required
def create_account():
    data = request.json
    return jsonify({"message": auth.current_user(), "data": data.get('data')})
