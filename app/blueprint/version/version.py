from flask import Blueprint, jsonify

version = Blueprint("Version",__name__)
@version.route('/ver', methods=['GET'])
def version():
    return jsonify({"version": 0.1})