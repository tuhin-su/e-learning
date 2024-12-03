from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error


classes = Blueprint("Clasess", __name__)


@classes.route('/classes', methods=['POST', 'GET'])
def app():
    app = current_app.config["app"]
    
    @app.auth.login_required
    def classes():
        user_id = app.auth.current_user()['user_id']
        lable = app.getLabel(user_id)
        student = None
        # if not authorized then send this
        if lable != 1 and lable != 2 and lable != 3:
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        
        if lable == 3: # for student
            sql = "SELECT `semester`,`course` FROM student where id = %s;"
            app.cursor.execute(sql, (user_id, ))
            student = app.cursor.fetchone()
            if sql == None:
                return jsonify({"message": "You are not authorized to access this endpoint"}), 403
            
            sql = "SELECT * FROM `classes` WHERE `createDate` = CURRENT_DATE() AND `stream` = %s AND `semester` = %s;"
            app.cursor.execute(sql, (student['course'], student['semester']))
            res = app.cursor.fetchall()
            
            return jsonify(res),200
        
        if (lable == 2 or lable == 1) and  request.method == 'POST' : # for teacher
            data = request.json
            req = ['stream', 'semester', 'title', 'stream', 'semester', 'description']
            for i in req:
                if i not in data:
                    return jsonify({"message": f"{i} is required"}), 400
            content_id=None
            if 'content_id' in data and data['content_id'] != 0:
                content_id = data['content_id']

            sql = "INSERT INTO `classes`(`host`, `title`, `stream`, `semester`, `description`,`content_id`) VALUES (%s, %s, %s, %s, %s, %s);"
            
            try:
                app.cursor.execute(sql, (user_id, data['title'], data['stream'], data['semester'], data['description'], content_id))
                app.conn.commit()
                return jsonify({"message": "Class added successfully"}), 200
            except Error as e:
                return jsonify({"message": str(e)}), 400
            
        elif lable == 2 and  request.method == 'GET' : # for teacher
            sql = "SELECT * FROM `classes` WHERE `host` = %s and DATE(`createDate`) = CURRENT_DATE()"
            app.cursor.execute(sql, (user_id, ))
            res = app.cursor.fetchall()
            return jsonify(res),200
        
        elif lable == 1 and  request.method == 'GET' : # for admin
            sql = "SELECT * FROM `classes`;"
            app.cursor.execute(sql)
            res = app.cursor.fetchall()
            return jsonify(res),200
        
        else:
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403

    return classes()