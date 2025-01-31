from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
from modules.DataBase import DBA
from modules.utilty import getLabel

app_info = Blueprint("InformationForAdmins", __name__)
db = DBA()

# retun oldest attendance year
@app_info.route("/info/atttendance/<rtype>", methods=["GET"])
def app(rtype):
    main_app = current_app.config["app"]
    @main_app.auth.login_required
    def exec():
        if rtype  == None or rtype == "":
            return jsonify({"message": "which is required"}), 400
        
        user_id = main_app.auth.current_user()['user_id']
        if getLabel(user_id) != 1 and getLabel(user_id) != 0:
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403

        # after pass all the checks
        db.connect()
        if rtype == "from_year":
            return jsonify({"message": "2004"}), 200
        
        if rtype == "to_year":
            return jsonify({"message": "2023"}), 200
        
        if rtype == "from_month":
            return jsonify({"message": {
                "year": "2004",
                "month": "1"
            }}), 200

        return jsonify({"message": "Invalid request"}), 400
    return exec()