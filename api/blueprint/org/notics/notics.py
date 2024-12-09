from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
import requests as web_rq
from modules.DataBase import DBA
from modules.utilty import getLabel

notice = Blueprint("NoticeBord", __name__)


@notice.route('/notice', methods=['GET'])
def heandel():
    app = current_app.config["app"]
    @app.auth.login_required
    def info():
        db = DBA()
        db.connect()
        sql = "SELECT * FROM `notification` WHERE 1 LIMIT 10;";
        try:
            db.cursor.execute(sql)
            data = db.cursor.fetchall()
            db.disconnect()
            return jsonify(data),200
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
    return info()


@notice.route('/notice', methods=['POST'])
def heandel_post():
    app = current_app.config["app"]
    @app.auth.login_required
    def info():
        curent_user = app.auth.current_user()['user_id']
        data = request.json

        if getLabel(curent_user) != 1 and getLabel(curent_user) != 2:
            return jsonify({"message": "Unauthorized End point"}), 400
        
        requre_fild = ['title']
        for i in requre_fild:
            if i not in data:
                return jsonify({"message": f"{i} is required"}), 400
        
        db = DBA()
        db.connect()
        data = request.json
        sql = "SELECT * FROM `notification` WHERE 1 LIMIT 10;";
        try:
            db.cursor.execute(sql)
            data = db.cursor.fetchall()
            db.disconnect()
            return jsonify(data),200
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
    return info()