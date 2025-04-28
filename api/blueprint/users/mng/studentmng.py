from flask import Blueprint, jsonify, request, current_app,send_file
from mysql.connector import Error
from modules.DataBase import DBA
from modules.utilty import getLabel
from werkzeug.security import generate_password_hash

studentmng = Blueprint("Student Management" , __name__)

@studentmng.route('/student/create', methods=['POST'])
def app():
    app = current_app.config["app"]

    @app.auth.login_required
    def handel():
        db= DBA()
        db.connect()
        user_id = app.auth.current_user()['user_id']
        lable = getLabel(user_id)

        if lable != 1:
            db.disconnect()
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        
        data = request.json
        email = data.get("email")
        password = generate_password_hash(data.get("passwd"))
        groups = data.get("groups")
        new_user_id = app.generate_unique_id(email,password,groups)

        try:
            sql = "SELECT id FROM `user` WHERE email = %s"
            db.cursor.execute(sql,(email,))
            user = db.cursor.fetchone()
            if user:
                db.disconnect()
                return jsonify ({"message":"User already exit"}),400

        except Error as e:
            app.app.logger.error(f"Error checking user: {e}")
            db.disconnect()
            return jsonify({"message": str(e)}), 500

        requre_fild = ["email","groups", "name"]
        for i in requre_fild:
            if i not in data:
                db.disconnect()
                return jsonify({"message": f"{i} is required"}), 400
                
        sqlu =  """INSERT INTO `user`(`id`, `email`, `passwd`, `createDate`, `groups`, `status`, `createBy`) VALUES (%s,%s,%s,current_timestamp(),%s,%s,%s)"""
        sqluinfo = "INSERT INTO user_info(user_id, name, phone, address, gender, birth, img) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        sqlStudent = """INSERT INTO `student`(`id`, `roll`, `reg`, `course`, `semester`, `status`, `reg_by`, `createDate`) VALUES (%s,%s,%s,%s,%s,%s,%s, current_timestamp)"""
            
        try:
            db.cursor.execute(sqlu,(new_user_id, email, password, data["groups"],0, user_id ))

            try:
                db.cursor.execute(sqluinfo,(new_user_id,data["name"], data["phone"], data["address"], data["gender"],data["birth"], data["img"]))
               
                try:
                    db.cursor.execute(sqlStudent,(new_user_id, data["roll"], data["reg"], data["course"], data["semester"], 0, user_id))
                    db.conn.commit() 

                except Error as e :
                    db.conn.rollback()
                    db.disconnect()
                    return jsonify({"message": str(e)}),400 
                db.conn.commit()
                db.disconnect()
                return jsonify({"message": "Student create successfully"}), 200
            except Error as e:
                db.conn.rollback()
                db.disconnect()
                return jsonify({"message": str(e)}), 400
            
        except Error as e:
            db.conn.rollback()
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
    return handel()