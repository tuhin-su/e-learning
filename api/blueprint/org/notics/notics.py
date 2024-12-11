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
        sql = "SELECT * FROM `notification` ORDER BY `createDate` DESC;";
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
        post_id = data["uploadId"]
        title = data["title"]
        content = data["content"]

        # insert in db
        sql = "INSERT INTO `notification`(`title`, `post_id`, `content`, `createBy`) VALUES (%s, %s, %s, %s);"
        val = (title, post_id, content, curent_user);
        try:
            db.cursor.execute(sql, val)
            if db.cursor.lastrowid:
                db.conn.commit()
                db.disconnect()
                #  return id
                return jsonify({"message": "success", "id": db.cursor.lastrowid}), 200
                
            else:
                db.disconnect()
                return jsonify({"message": "faild"}), 400
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
    return info()