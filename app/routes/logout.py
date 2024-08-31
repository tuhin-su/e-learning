from flask import Blueprint, jsonify
from flask_httpauth import HTTPTokenAuth

logout_bp = Blueprint('logout', __name__)
auth = HTTPTokenAuth(scheme='Bearer')

@logout_bp.route('/logout', methods=['POST'])
@auth.login_required
def logout():
    return jsonify({"message": "Logged out successfully"})
