from flask import Blueprint, jsonify

version_bp = Blueprint("Version", __name__)

@version_bp.route('/ver', methods=['GET'])
def get_version():
    return jsonify({"version": 0.1})
