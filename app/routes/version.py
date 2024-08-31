from flask import Blueprint, jsonify, g

version_bp = Blueprint('version', __name__)

@version_bp.route('/ver', methods=['GET'])
def version():
    cursor = g.db.cursor(dictionary=True)
    query = "SELECT MAX(version) AS ver FROM resource;"
    cursor.execute(query)
    ver = cursor.fetchone()
    if ver:
        return jsonify({"version": ver['ver']})
    return jsonify({"message": "Server Broke"}), 521
