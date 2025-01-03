from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
from modules.DataBase import DBA

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