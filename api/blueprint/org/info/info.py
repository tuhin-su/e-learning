
import datetime
from socket import TCP_NODELAY
from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
from modules.DataBase import DBA
from modules.utilty import getLabel
import calendar

app_info = Blueprint("InformationForAdmins", __name__)


# retun oldest attendance year
@app_info.route("/info/atttendance/<rtype>", methods=["GET"])
def app(rtype):
    main_app = current_app.config["app"]
    @main_app.auth.login_required
    def exec():
        db = DBA()
        if rtype  == None or rtype == "":
            return jsonify({"message": "which is required"}), 400
        
        db.connect()
        user_id = main_app.auth.current_user()['user_id']
        if getLabel(user_id) != 1 and getLabel(user_id) != 0:
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403

        # after pass all the checks
        if rtype == "from_year":
            return jsonify({"message": "2004"}), 200
        
        if rtype == "to_year":
            return jsonify({"message": "2023"}), 200
        
        if rtype =="today_total":
            sql = "SELECT COUNT(id) as total FROM attends WHERE attendance_date_only=CURRENT_DATE();";
            try:
                db.cursor.execute(sql)
                data = db.cursor.fetchone()["total"]
                sql = "SELECT COUNT(student.id) as total FROM student INNER JOIN user on student.id=user.id WHERE student.status=0;"
                try:
                    db.cursor.execute(sql)
                    total=db.cursor.fetchone()["total"]
                    try:
                        total = (data/total)*100
                    except:
                        total = 0
                        
                    db.disconnect()
                    return jsonify ({
                            "total":data, 
                            "percentage":total
                        })
                except Error as e:
                    db.disconnect()
                    return jsonify ({"message": str(e)}),400
            except Error as e:
                db.disconnect()
                return jsonify ({"message": str(e)}),400
        if rtype == "from_month":
            return jsonify({"message": {
                "year": "2004",
                "month": "1"
            }}), 200
        return jsonify({"message": "Invalid request"}), 400
    return exec()

@app_info.route("/info/classes/<rtype>", methods=["GET"])
def app_class(rtype):
    main_app = current_app.config["app"]
    @main_app.auth.login_required
    def exec():
        db = DBA()
        if rtype  == None or rtype == "":
            return jsonify({"message": "which is required"}), 400
        
        db.connect()
        user_id = main_app.auth.current_user()['user_id']
        if getLabel(user_id) != 1 and getLabel(user_id) != 0:
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403
        
        if rtype =="today_total":
                sql = "SELECT COUNT(id) as total FROM classes WHERE createDate=CURRENT_DATE();"
                try:
                    db.cursor.execute(sql)
                    data = db.cursor.fetchone()['total']

                    sql="SELECT COUNT(host) as month FROM classes where YEAR(createDate)= YEAR(CURRENT_DATE) AND MONTH(createDate)=MONTH(CURRENT_DATE);"
                    try:
                        db.cursor.execute(sql)
                        month = db.cursor.fetchone()['month']

                        db.disconnect()
                        return jsonify({
                            "total": data,
                            "month": month
                        }),200
                    except Error as e:
                        db.disconnect()
                        return jsonify ({"message": str(e)}),400
                    
                except Error as e:
                    db.disconnect()
                    return jsonify ({"message": str(e)}),400
        return jsonify({"message": "Invalid request"}), 400
    return exec()



@app_info.route("/info/notices/<rtype>", methods=["GET"])
def app_notices(rtype):
    main_app=current_app.config["app"]
    @main_app.auth.login_required
    def exec():
        db = DBA()
        if rtype ==None or rtype=="":
            return jsonify ({"message": "Which is required"}), 400
        db.connect()
        user_id = main_app.auth.current_user()["user_id"]
        if getLabel(user_id) != 1 and getLabel(user_id) !=0: 
            db.disconnect()
            return jsonify ({"message" : "You are not authorized to perform this action "}),403
        
        if rtype == "month_total":
            
            sql  = "SELECT COUNT(id) as total FROM posts_data WHERE YEAR(createDate)=YEAR(CURRENT_DATE()) AND MONTH(createDate)=MONTH(CURRENT_DATE());"
            try:
                db.cursor.execute(sql)
                data = db.cursor.fetchone()["total"]
                sql = "SELECT COUNT(id) as total FROM posts_data WHERE YEAR(createDate)=YEAR(CURRENT_DATE());"
                try:
                    db.cursor.execute(sql)
                    year = db.cursor.fetchone()["total"]
                    db.disconnect()
                    return jsonify ({
                        "month": data,
                        "year" : year
                        }),200
                except Error as e:
                    db.disconnect()
                    return jsonify ({"message": str(e)}),400

            except Error as e:
                db.disconnect()
                return jsonify ({"message": str(e)}),400
            
        return jsonify({"message": "Invalid request"}), 400
    return exec()




# api of attendence chart

@app_info.route("/info/attendance/stream", methods=["POST"])
def app_attendance():
    main_app = current_app.config["app"]

    # Authentication
    @main_app.auth.login_required
    def exec():
        db = DBA()
        db.connect()
        user_id = main_app.auth.current_user()["user_id"]
        if getLabel(user_id) not in [0, 1]: 
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403

        # Default: Get current month and year
        today = datetime.datetime.now()
        current_month = today.month
        current_year = today.year

        # Parse request JSON safely
        data = request.get_json() or {}

        # Override month and year if provided
        if "month" in data:
            try:
                current_month = int(data["month"])
                if not (1 <= current_month <= 12):
                    raise ValueError
            except ValueError:
                return jsonify({"message": "Invalid month provided"}), 400

        if "year" in data:
            try:
                current_year = int(data["year"])
            except ValueError:
                return jsonify({"message": "Invalid year provided"}), 400

        # Calculate last day of the selected month
        last_day = calendar.monthrange(current_year, current_month)[1]

        returnData = {}  # Response object

        # Fetch all courses
        sql = "SELECT name, id FROM `course`"
        try:
            db.cursor.execute(sql)
            courses = db.cursor.fetchall()
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 400

        for course in courses:
            days = []
            for day in range(1, last_day + 1):  # Iterate over full month
                sql = """
                    SELECT COUNT(attends.id) AS count
                    FROM student
                    INNER JOIN attends ON student.id = attends.user_id
                    WHERE attends.attendance_date_only = %s
                    AND student.course = %s
                """
                try:
                    db.cursor.execute(sql, (f'{current_year}-{current_month:02d}-{day:02d}', course['id']))
                    result = db.cursor.fetchone()
                except Error as e:
                    db.disconnect()
                    return jsonify({"message": str(e)}), 400

                # Ensure 'count' key exists
                days.append(result["count"] if result and "count" in result else 0)

            returnData[course['name']] = days

        return jsonify(returnData), 200
    return exec()





# * Edit api

@app_info.route("/info/course/edit", methods=["POST"])
def app_courses():
    mainApp=current_app.config["app"]
    @mainApp.auth.login_required
    def info():
        db = DBA()
        db.connect
        user_id_ad = mainApp.auth.current_user()['user_id']
        if getLabel(user_id_ad) != 1 :
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403
        

        try:
            edited_data = request.get_json()
            sql_update = "UPDATE `course` SET `name`=%s,`description`=%s,`course_fees`=%s,`course_duration`=%s WHERE `id`= %s "
            try:
                db.cursor.execute(sql_update,(edited_data['name'], edited_data['description'], edited_data['course_fees'], edited_data['course_duration'], edited_data['id']))
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


# * delete api

@app_info.route("/info/course/delete", methods=["POST"])
def app_courses_delete():
    mainApp=current_app.config["app"]
    @mainApp.auth.login_required
    def info():
        db = DBA()
        db.connect
        user_id_ad = mainApp.auth.current_user()['user_id']
        if getLabel(user_id_ad) != 1:
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403
        
       
        try:
            edited_data = request.get_json()
            sql_update = "UPDATE `course` SET `status`=%s WHERE `id`= %s "
            try:
                db.cursor.execute(sql_update,(1, edited_data['id']))
                db.conn.commit()
                db.disconnect()
                return jsonify({"message": "Successfully Deleted"}), 200
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


#* create course api #*

@app_info.route("/info/course/create", methods=["POST"])
def app_course_create():
    mainApp=current_app.config["app"]
    @mainApp.auth.login_required
    def info():
        db = DBA()
        db.connect()
        user_id_ad = mainApp.auth.current_user()['user_id']
        if getLabel(user_id_ad) != 1:
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403
        
        data = request.json
        requre_fild = [ 'name', 'description', 'course_fees', 'course_duration']
        for i in requre_fild:
            if i not in data:
                db.disconnect()
                return jsonify({"message": f"{i} is required"}), 400
            
        sql = ''' INSERT INTO `course`(`name`, `description`, `course_fees`, `course_duration`, `status`)
            VALUES ( %s, %s, %s, %s, %s) '''
        try:
            db.cursor.execute(sql, (data['name'], data['description'], data['course_fees'], data['course_duration'],0))
            db.conn.commit()
            db.disconnect()
            return jsonify({"message": "course added successfully"}), 200
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
        
    return info()
        