import time
from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
from modules.DataBase import DBA
from modules.utilty import getLabel
classes = Blueprint("Clasess", __name__)


@classes.route('/classes', methods=['POST'])
def app_post():
    app = current_app.config["app"]
    
    @app.auth.login_required
    def classes():
        db = DBA()
        db.connect()

        user_id = app.auth.current_user()['user_id']
        lable = getLabel(user_id)
        student = None
        # if not authorized then send this
        if lable != 1 and lable != 2 and lable != 3:
            db.disconnect()
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        
        if (lable == 2 or lable == 1) and  request.method == 'POST' : # for teacher
            data = request.json
            req = ['stream', 'semester', 'title', 'stream', 'semester', 'description']
            for i in req:
                if i not in data:
                    db.disconnect()
                    return jsonify({"message": f"{i} is required"}), 400
            content_id=None
            if 'content_id' in data and data['content_id'] != 0:
                content_id = data['content_id']

            sql = "INSERT INTO `classes`(`host`, `title`, `stream`, `semester`, `description`,`content_id`) VALUES (%s, %s, %s, %s, %s, %s);"
            
            try:
                db.cursor.execute(sql, (user_id, data['title'], data['stream'], data['semester'], data['description'], content_id))
                db.conn.commit()
                db.disconnect()
                return jsonify({"message": "Class added successfully"}), 200
            except Error as e:
                db.disconnect()
                return jsonify({"message": str(e)}), 400
            finally:
                db.disconnect()
        else:
            db.disconnect()
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403

    return classes()

@classes.route('/classes/<date>', methods=['GET'])
def app_get(date):
    app = current_app.config["app"]
    
    @app.auth.login_required
    def classes(date):
        db = DBA()
        db.connect()

        if date == None:
            date = time.strftime("%m/%d/%Y")

        user_id = app.auth.current_user()['user_id']
        lable = getLabel(user_id)
        student = None
        # if not authorized then send this
        if lable != 1 and lable != 2 and lable != 3:
            db.disconnect()
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        
        if lable == 2: # for teacher
            sql = "SELECT * FROM `classes` WHERE `host` = %s and DATE(`createDate`) = STR_TO_DATE(%s,'%Y-%m-%d');"
            db.cursor.execute(sql, (user_id, date))
            res = db.cursor.fetchall()
            db.disconnect()
            return jsonify(res),200
        
        if lable == 1:  # for admin
            sql = "SELECT * FROM `classes` WHERE DATE(`createDate`) = STR_TO_DATE(%s,'%Y-%m-%d');"
            db.cursor.execute(sql, (date,))
            res = db.cursor.fetchall()
            db.disconnect()
            return jsonify(res), 200
        
        if lable == 3: # for student
                sql = "SELECT `semester`,`course` FROM student where id = %s;"
                db.cursor.execute(sql, (user_id, ))
                student = db.cursor.fetchone()
                if student == None:
                    db.disconnect()
                    return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        
                sql = "SELECT * FROM `classes` WHERE DATE(`createDate`) = DATE(%s) AND `stream` = %s AND `semester` = %s"
                db.cursor.execute(sql, (date, student['course'], student['semester'],))
                res = db.cursor.fetchall()
                db.disconnect()
                return jsonify(res),200
    return classes(date)