from werkzeug.security import generate_password_hash
from flask import Flask,Blueprint ,request, jsonify,current_app
from datetime import datetime, timedelta
from mysql.connector import Error

mng = Blueprint("User Management", __name__)

@mng.route('/users/mng', methods=['POST'])
def app():
        app = current_app.config["app"]
        
        @app.auth.login_required
        def heandel():
            user_id_ad = app.auth.current_user()['user_id']
            data = request.json
            
            if app.getLable(user_id_ad) != 1 and app.getLable(user_id_ad) != 2:
                return jsonify({"message": "You are not authorized to perform this action"}), 403
            
            if "FROM" not in data:
                return jsonify({"message": "FROM is required"}), 400
            
            if data['FROM'] == 'student_ac':
                if  "data" not in data:
                    return jsonify(["email","dob","roll","reg","course","semester"])
                
                else:
                    data = data["data"]
                    for i in ["email","dob","roll","reg","course","semester"]:
                        if i not in data:
                            return jsonify({"message": f"{i} is required"}), 400
                    
                    
                    # detect email exists or not 
                    sql = "SELECT id FROM `user` WHERE `email` = %s;"
                    try:
                        app.cursor.execute(sql, (data['email'],))
                        user = app.cursor.fetchone()
                        if user:
                            return jsonify({"message": "User already exists"}), 400
                        
                    except Error as e:
                        app.app.logger.error(f"Error checking user: {e}")
                        return jsonify({"message": str(e)}), 500
                    
                    user_id = app.generate_unique_id(data['email'], data['dob'], "ST")
                    sql = """INSERT INTO `user`(`id`, `email`, `passwd`, `groups`, `createBy`) VALUES (%s, %s, %s, %s, %s)"""

                    try:
                        app.cursor.execute(sql, (user_id, data['email'], generate_password_hash(data['dob']), "ST", user_id_ad))
                        app.conn.commit()
                        app.app.logger.info(f'Created new user: {data["email"]}')

                        try:
                            sql = "SELECT `id` FROM `course` WHERE `name` = %s;"
                            app.cursor.execute(sql, (data['course'],))
                            course = app.cursor.fetchone()['id']

                            # user_id
                            sql = """INSERT INTO `student`(`id`, `roll`, `reg`, `course`, `semester`, `reg_by`) VALUES (%s, %s, %s, %s, %s, %s);"""

                            try:
                                app.cursor.execute(sql, (user_id, data['roll'], data['reg'], course, data['semester'], user_id_ad))
                                app.conn.commit()
                                app.app.logger.info(f'Created new user: {data["email"]}')
                                return jsonify({"message": "User created"}), 201
                            
                            except Error as e:
                                app.app.logger.error(f"Error creating user: {e}")
                                return jsonify({"message": str(e)}), 500
                        
                        except Error as e:
                            return jsonify({"message": str(e)}), 500
                        
                    except Error as e:
                        app.app.logger.error(f"Error creating user: {e}")
                        return jsonify({"message": str(e)}), 500
                    
        return heandel();
            