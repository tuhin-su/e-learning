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

        
      
        if rtype == "from_year":
            return jsonify({"message": "2004"}), 200
        
        if rtype == "to_year":
            return jsonify({"message": "2023"}), 200
        
        if rtype =="today_total":
            db.connect()
            sql = "SELECT COUNT(id) as total FROM attends WHERE attendance_date_only=CURRENT_DATE();";
            try:
                db.cursor.execute(sql)
                data = db.cursor.fetchone()["total"]
                sql = "SELECT COUNT(student.id) as total FROM student INNER JOIN user on student.id=user.id WHERE student.status=0;"
                try:
                    db.cursor.execute(sql)
                    total=db.cursor.fetchone()["total"]
                    total = (data/total)*100
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
            finally:
                db.disconnect()
                
        
        
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
        if rtype  == None or rtype == "":
            return jsonify({"message": "which is required"}), 400
        
        user_id = main_app.auth.current_user()['user_id']
        if getLabel(user_id) != 1 and getLabel(user_id) != 0:
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403
        return exec()
    if rtype =="today_total":
            db.connect()
            sql = "SELECT COUNT(id) as total FROM classes WHERE createDate=CURRENT_DATE();"
            try:
                db.cursor.execute(sql)
                data = db.cursor.fetchone()['total']
                sql="SELECT COUNT(host) as month FROM classes where YEAR(createDate)= YEAR(CURRENT_DATE) AND MONTH(createDate)=MONTH(CURRENT_DATE);"
                try:
                    db.cursor.execute(sql)
                    month = db.cursor.fetchone()['month']
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
            finally:
                db.disconnect()



@app_info.route("/info/notices/<rtype>", methods=["GET"])
def app_notices(rtype):
    main_app=current_app.config["app"]
    @main_app.auth.login_required
    def exec():
        if rtype ==None or rtype=="":
            return jsonify ({"message": "Which is required"}), 400
            user_id = main_app.auth.current_user()["user_id"]
        if getLabel(user_id) != 1 and getLabel(user_id) !=0:
            db.disconnect()
            return jsonify ({"message" : "You are not authorized to perform this action "}),403
        return exec()
    if rtype == "month_total":
        db.connect()
        sql  = "SELECT COUNT(id) as total FROM posts_data WHERE YEAR(createDate)=YEAR(CURRENT_DATE()) AND MONTH(createDate)=MONTH(CURRENT_DATE());"

    try:
        db.cursor.execute(sql)
        data = db.cursor.fetchone()["total"]
        sql = "SELECT COUNT(id) as total FROM posts_data WHERE YEAR(createDate)=YEAR(CURRENT_DATE());"
        try:
            db.cursor.execute(sql)
            year = db.cursor.fetchone()["total"]
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
    finally:
        db.disconnect()    





