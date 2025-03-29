from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
from modules.DataBase import DBA
from modules.utilty import getLabel
from werkzeug.security import generate_password_hash

user_info = Blueprint("User info", __name__)
db = DBA()

@user_info.route('/user_info', methods=['POST', 'PUT'])
def app():
        app = current_app.config["app"]
        
        @app.auth.login_required
        def user_info():
            db.connect()
            user_id = app.auth.current_user()['user_id']
            data = request.json

            if request.method == 'POST':
                name = data.get('name')
                phone = data.get('phone')
                address = data.get('address')
                gender = data.get('gender')
                birth = data.get('dob')
                img = data.get('img')
                
                query = """
                    INSERT INTO user_info (user_id, name, phone, address, gender, birth, img)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                """
                values = (user_id, name, phone, address, gender, birth, img)

            elif request.method == 'PUT':
                query = "UPDATE user_info SET "
                values = list()
                if "name" in data:
                    query += "name = %s, "
                    values.append(data['name'])
                if "phone" in data:
                    query += "phone = %s, "
                    values.append(data['phone'])
                if "address" in data:
                    query += "address = %s, "
                    values.append(data['address'])
                if "gender" in data:
                    query += "gender = %s, "
                    values.append(data['gender'])
                if "dob" in data:
                    query += "birth = %s, "
                    values.append(data['dob'])
                if "img" in data:
                    query += "img = %s, "
                    values.append(data['img'])
                
                query = query[:-2]
                query += " WHERE user_id = %s;"

                values = tuple(values) + (user_id,)
            else:
                db.disconnect()
                return jsonify({"message": "Method not allowed"}), 405

            try:
                db.cursor.execute(query, values)
                db.conn.commit()
                db.disconnect()
                return jsonify({"message": "User info updated"})
                
            except Error as e:
                app.conn.rollback()
                app.app.logger.error(f"Error updating user info: {e}")
                db.disconnect()
                return jsonify({"message": str(e)}), 400
        return user_info();




@user_info.route('/user/info/<id>', methods=['GET'])
def get_user_info(id):
    app = current_app.config["app"]

    # Ensure authentication is required
    @app.auth.login_required
    def fetch_user_info():
        db = DBA()
        db.connect()
        try:
            sql = "SELECT name,img FROM user_info WHERE user_id = %s"
            db.cursor.execute(sql, (id,))
            user_info = db.cursor.fetchone()
            if user_info:
                db.disconnect()
                return jsonify(user_info)
            db.disconnect()
            return jsonify({"message": "User info not found"}), 404
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 500

    return fetch_user_info()



#* fetch all user..

@user_info.route('/user/fetch', methods=['POST'])
def app_user_fetch():
    app = current_app.config['app']
    @app.auth.login_required

    def handel():
        db = DBA()
        db.connect()
        user_id = app.auth.current_user()['user_id']
        lable = getLabel(user_id)
        current = 0
        max = 15

        if lable!=1:
            db.disconnect()
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        
        if request.json.get("current") is not None:
            current = request.json["current"]

        if request.json.get("max") is not None:
            max = request.json["max"]

        
        sql = f"""
            SELECT user_info.img, user_info.user_id, user_info.name, user_info.phone, user_info.address, 
                   user_info.gender, user_info.birth, user.email, user.passwd, user.groups, 
                   user.status, user.createDate 
                   FROM user_info 
                   INNER JOIN user ON user_info.user_id = user.id 
                   LIMIT %s OFFSET %s
        """
        try:
            db.cursor.execute(sql,(max, current))
            data = db.cursor.fetchall()
            db.disconnect()
            return jsonify(data), 200
        
        except Error as e:
            db.disconnect()
            return jsonify ({"massage": str(e)}),400
        
        finally:
            db.disconnect()

    return handel()    




#* edit user  

@user_info.route("/user/edit", methods=["POST"])
def app_update_user():
    mainApp=current_app.config["app"]
    @mainApp.auth.login_required
    def info():
        db = DBA()
        db.connect()
        user_id = mainApp.auth.current_user()['user_id']
        if getLabel(user_id) != 1 :
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403
        

        try:
            db.connect()
            edited_data = request.get_json()
            sql_update = """UPDATE `user_info` JOIN `user`  ON user_info.user_id = user.id  SET
                            user_info.name = %s,
                            user_info.phone = %s,
                            user_info.address = %s,
                            user_info.gender = %s,
                            user_info.birth = %s,
                            user.email = %s,
                            user.groups = %s,
                            user.status = %s
                            WHERE user_info.user_id = %s"""
            try:
                db.cursor.execute(sql_update,(edited_data["name"], 
                                              edited_data["phone"], 
                                              edited_data["address"], 
                                              edited_data["gender"], 
                                              edited_data["birth"], 
                                              edited_data["email"],
                                              edited_data["groups"],
                                              edited_data["status"], 
                                              edited_data["id"]))
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




#* user deleted..

@user_info.route("/user/delete", methods=["POST"])
def app_courses_delete():
    mainApp=current_app.config["app"]
    @mainApp.auth.login_required
    def info():
        db = DBA()
        db.connect()
        user_id_ad = mainApp.auth.current_user()['user_id']
        if getLabel(user_id_ad) != 1:
            db.disconnect()
            return jsonify({"message": "You are not authorized to perform this action"}), 403
        
       
        try:
            edited_data = request.get_json()
            sql_update = "UPDATE `user` SET `status`=%s WHERE `id`= %s "
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



#* user create 

@user_info.route("/user/create", methods=["POST"])
def app_user_create():
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
        email = data.get("email")
        password = generate_password_hash(data.get("passwd"))
        groups = data.get("groups")
        user_id = mainApp.generate_unique_id(email,password,groups)

        try:
            sql = "SELECT id FROM `user` WHERE email = %s"
            db.cursor.execute(sql,(email,))
            user = db.cursor.fetchone()
            if user:
                db.disconnect()
                return jsonify ({"message":"User already exit"}),400

        except Error as e:
            mainApp.app.logger.error(f"Error checking user: {e}")
            db.disconnect()
            return jsonify({"message": str(e)}), 500

        requre_fild = ["email","groups", "name"]
        for i in requre_fild:
            if i not in data:
                db.disconnect()
                return jsonify({"message": f"{i} is required"}), 400
                
        sql = "INSERT INTO user(id, email, passwd, createDate, groups, status, createBy) VALUES (%s,%s,%s, current_timestamp(),%s,%s,%s)"
        sql1 = "INSERT INTO user_info(user_id, name, phone, address, gender, birth, img) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        # db.conn.start_transaction()
            
        try:
            db.cursor.execute(sql,(user_id, email, password, data["groups"],data["status"], user_id_ad ))
            try:
                db.cursor.execute(sql1,(user_id,data["name"], data["phone"], data["address"], data["gender"],data["birth"], data["img"]))
                db.conn.commit()  
            except Error as e:
                db.conn.rollback()
                db.disconnect()
                return jsonify({"message": str(e)}), 400
            db.conn.commit()
            db.disconnect()
            return jsonify({"message": "User added successfully"}), 200
        except Error as e:
            db.conn.rollback()
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
        
    return info()
        