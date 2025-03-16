from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
from modules.DataBase import DBA
from modules.utilty import getLabel

students = Blueprint("Students", __name__)


@students.route('/student', methods=['POST'])
def app():
    app = current_app.config["app"]
    
    @app.auth.login_required
    def hendel():
        db = DBA()
        db.connect()
        user_id = app.auth.current_user()['user_id']
        lable = getLabel(user_id)

        # if not authorized then send this
        if lable != 1 and lable != 2:
            db.disconnect()
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        

        data = request.json
        requre_fild = ['id', 'roll', 'reg', 'course', 'semester']
        for i in requre_fild:
            if i not in data:
                db.disconnect()
                return jsonify({"message": f"{i} is required"}), 400

        sql = '''INSERT INTO `student` (`id`, `roll`, `reg`, `course`, `semester`, `reg_by`, `createDate`) VALUES (%s, %s, %s, %s, %s, %s, current_timestamp());'''
        try:
            db.cursor.execute(sql, (data['id'], data['roll'], data['reg'], data['course'], data['semester'], user_id))
            db.conn.commit()
            db.disconnect()
            return jsonify({"message": "Student added successfully"}), 200
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
        
    return hendel()




@students.route('/student/fetch', methods=['POST'])
def app_student_fetch():
    app = current_app.config["app"]
    
    @app.auth.login_required
    def hendel():
        db = DBA()
        db.connect()
        user_id = app.auth.current_user()['user_id']
        lable = getLabel(user_id)

        # if not authorized then send this
        if lable != 1 :
            db.disconnect()
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        
        sql = '''SELECT 
    student.id, 
    student.roll, 
    student.reg, 
    course.name AS course_name, 
    student.semester, 
    student.status, 
    student.reg_by, 
    student.createDate, 
    user_info.name AS student_name, 
    user_info.phone AS student_phone,
    admin_info.name AS Admin_name,
    admin_info.phone AS Admin_ph
FROM student
INNER JOIN user_info ON student.id = user_info.user_id
LEFT JOIN user_info AS admin_info ON student.reg_by = admin_info.user_id
INNER JOIN course ON student.course = course.id  
LIMIT 300;'''
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
    return hendel()