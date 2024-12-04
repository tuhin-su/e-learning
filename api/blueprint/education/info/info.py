from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
from modules.DataBase import DBA

info = Blueprint("Info", __name__)

@info.route('/info/stream', methods=['POST'])
def app():
    mainApp=current_app.config["app"]
    @mainApp.auth.login_required
    def info():
        db = DBA()
        db.connect()
        sql = "SELECT * FROM `course` WHERE 1";
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


@info.route('/info/sem', methods=['POST'])
def info_sem():
    mainApp=current_app.config["app"]
    @mainApp.auth.login_required
    def info():
        db = DBA()
        db.connect()

        data = request.json
        if 'stream' not in data:
            db.disconnect()
            return jsonify({"message": "stream is required"}), 400
        
        sql = "SELECT `course_duration` FROM `course` WHERE `id` = %s;";
        
        try:
            db.cursor.execute(sql,(data['stream'],))
            res = db.cursor.fetchone()
            if res == None:
                db.disconnect()
                return jsonify({"message": "Invalid stream id"}), 400
        except:
            db.disconnect()
            return jsonify({"message": "Invalid stream id"}), 400
        finally:
            db.disconnect()
        db.disconnect()
        return jsonify(res),200
    return info()