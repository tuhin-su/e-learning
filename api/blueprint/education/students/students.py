from flask import Blueprint, jsonify, request, current_app,send_file
from mysql.connector import Error
from modules.DataBase import DBA
from modules.utilty import getLabel
import io
import csv

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


#* fetch student 

@students.route('/student/fetch', methods=['POST'])
def app_student_fetch():
    app = current_app.config["app"]
    
    @app.auth.login_required
    def hendel():
        db = DBA()
        db.connect()
        user_id = app.auth.current_user()['user_id']
        lable = getLabel(user_id)
        current = 0
        max = 15

        # if not authorized then send this
        if lable != 1 :
            db.disconnect()
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        

        if request.json.get("current") is not None:
            current = request.json["current"]

        if request.json.get("max") is not None:
            max = request.json["max"]


        sql = '''SELECT 
                    student.id, 
                    student.roll, 
                    student.reg, 
                    student.course AS course_id,
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
                    LEFT JOIN user_info ON student.id = user_info.user_id
                    LEFT JOIN user_info AS admin_info ON student.reg_by = admin_info.user_id
                    LEFT JOIN course ON student.course = course.id  
                    LIMIT %s OFFSET %s'''
        

        try:
            db.cursor.execute(sql,(max,current))
            data = db.cursor.fetchall()
            db.disconnect()

            return jsonify(data),200
        
        except Error as e:
            db.disconnect()
            
            return jsonify({"message": str(e)}), 400
        
        finally:
            db.disconnect()
            
    return hendel()



#* edit student
@students.route("/student/edit", methods=["POST"])
def app_student():
    mainApp=current_app.config["app"]
    @mainApp.auth.login_required
    def info():
        db = DBA()
        db.connect
        user_id = mainApp.auth.current_user()['user_id']
        if getLabel(user_id) != 1 :
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403
        

        try:
            db.connect()
            edited_data = request.get_json()
            sql_update = "UPDATE `student` SET `roll`=%s,`reg`=%s,`course`=%s,`semester`=%s,`status`=%s WHERE `id` = %s"
            try:
                db.cursor.execute(sql_update,(edited_data['roll'], edited_data['reg'], edited_data['course_id'], edited_data['semester'], edited_data['status'], edited_data['id']))
                db.conn.commit()
                db.disconnect()
                return jsonify({"message": "Successfully updated"}), 200
            except Error as e:
                db.conn.rollback()
                db.disconnect()
                return jsonify({"message": str(e)}), 400
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
    return info()


#* delete student

@students.route("/student/delete", methods=["POST"])
def app_student_delete():
    mainApp=current_app.config["app"]
    @mainApp.auth.login_required
    def info():
        db = DBA()
        db.connect
        user_id = mainApp.auth.current_user()['user_id']
        if getLabel(user_id) != 1 :
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403
        

        try:
            db.connect()
            edited_data = request.get_json()
            sql_update = "UPDATE `student` SET `status`=%s WHERE `id` = %s"
            try:
                db.cursor.execute(sql_update,(1,edited_data['id']))
                db.conn.commit()
                db.disconnect()
                return jsonify({"message": "Successfully deleted"}), 200
            except Error as e:
                db.conn.rollback()
                db.disconnect()
                return jsonify({"message": str(e)}), 400
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
    return info()





#* student migration *#


@students.route("/student/migration", methods=["POST"])
def app_student_migration():
    mainApp=current_app.config["app"]

    @mainApp.auth.login_required
    def info():
        db = DBA()
        db.connect
        user_id = mainApp.auth.current_user()['user_id']
        if getLabel(user_id) != 1 :
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403
        

        try:
            db.connect()
            edited_data = request.get_json()
            sql_update = "UPDATE `student` SET `semester`=%s WHERE `semester`= %s"
            try:
                db.cursor.execute(sql_update,(edited_data['semester'], edited_data['from_semester']))
                db.conn.commit()
                db.disconnect()
                return jsonify({"message": "Successfully updated"}), 200
            except Error as e:
                db.conn.rollback()
                db.disconnect()
                return jsonify({"message": str(e)}), 400
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
    return info()



# ##* Create student 
# import csv
# import json
# import os
# import pandas as pd
# from uuid import uuid4
# from datetime import datetime
# from werkzeug.utils import secure_filename


# ALLOWED_EXTENSIONS = {'json', 'csv', 'xlsx', 'pdf'}

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @students.route('/student/upload', methods=['POST'])
# def app_student_upload():
#     app = current_app.config["app"]

#     @app.auth.login_required
#     def handle_upload():
#         db = DBA()
#         db.connect()
#         user_id = app.auth.current_user()['user_id']
#         label = getLabel(user_id)

#         if label != 1:
#             db.disconnect()
#             return jsonify({"message": "You are not authorized to access this endpoint"}), 403

#         if 'file' not in request.files:
#             return jsonify({"message": "No file part in the request"}), 400

#         file = request.files['file']

#         if file.filename == '':
#             return jsonify({"message": "No selected file"}), 400

#         if file and allowed_file(file.filename):
#             filename = secure_filename(file.filename)
#             ext = filename.rsplit('.', 1)[1].lower()

#             try:
#                 data_list = []

#                 if ext == 'json':
#                     data_list = json.load(file)
#                 elif ext == 'csv':
#                     reader = csv.DictReader(file.stream.read().decode("utf-8").splitlines())
#                     data_list = [row for row in reader]
#                 elif ext == 'xlsx':
#                     df = pd.read_excel(file)
#                     data_list = df.to_dict(orient='records')
#                 elif ext == 'pdf':
#                     db.disconnect()
#                     return jsonify({"message": "PDF received. No data was inserted from it."}), 202

#                 for entry in data_list:
#                     new_user_id = str(uuid4())
#                     now = datetime.now()

#                     # Insert into user table
#                     db.cursor.execute('''
#                         INSERT INTO `user`(`id`, `email`, `passwd`, `createDate`, `groups`, `status`, `createBy`)
#                         VALUES (%s, %s, %s, %s, %s, %s, %s)
#                     ''', (
#                         new_user_id,
#                         entry.get("email"),
#                         entry.get("passwd", "default123"),  # You might hash this
#                         now,
#                         entry.get("group", "student"),
#                         entry.get("status", "active"),
#                         user_id
#                     ))

#                     # Insert into user_info table
#                     db.cursor.execute('''
#                         INSERT INTO `user_info`(`user_id`, `name`, `phone`, `address`, `gender`, `birth`, `img`)
#                         VALUES (%s, %s, %s, %s, %s, %s, %s)
#                     ''', (
#                         new_user_id,
#                         entry.get("name"),
#                         entry.get("phone"),
#                         entry.get("address"),
#                         entry.get("gender"),
#                         entry.get("birth"),
#                         entry.get("img")
#                     ))

#                     # Insert into student table
#                     db.cursor.execute('''
#                         INSERT INTO `student`(`id`, `roll`, `reg`, `course`, `semester`, `status`, `reg_by`, `createDate`)
#                         VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
#                     ''', (
#                         new_user_id,
#                         entry.get("roll"),
#                         entry.get("reg"),
#                         entry.get("course_id"),
#                         entry.get("semester"),
#                         entry.get("status", "active"),
#                         user_id,
#                         now
#                     ))

#                 db.connection.commit()
#                 db.disconnect()
#                 return jsonify({"message": f"{len(data_list)} records inserted successfully."}), 201

#             except Exception as e:
#                 db.connection.rollback()
#                 db.disconnect()
#                 return jsonify({"message": f"Error processing file: {str(e)}"}), 500

#         return jsonify({"message": "Invalid file type"}), 400

#     return handle_upload()
