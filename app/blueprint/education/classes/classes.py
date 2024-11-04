from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error


classes = Blueprint("Clasess", __name__)


@classes.route('/classes', methods=['POST', 'PUT'])
def app():
    app = current_app.config["app"]
    
    @app.auth.login_required
    def classes():
        user_id = app.auth.current_user()['user_id']
        lable = app.getLabel(user_id)
        if lable != 1 and lable != 2 and lable != 3:
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        
        data = request.json
        return jsonify({"res":data}),200

    return classes()