from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error


user_info = Blueprint("User info", __name__)

@user_info.route('/user_info', methods=['POST', 'PUT'])
def app():
        app = current_app.config["app"]
        
        @app.auth.login_required
        def user_info():
            user_id = app.auth.current_user()['user_id']
            data = request.json

            name = data.get('name')
            phone = data.get('phone')
            address = data.get('address')
            gender = data.get('gender')
            birth = data.get('dob')
            img = data.get('img')

            if request.method == 'POST':
                query = """
                    INSERT INTO user_info (user_id, name, phone, address, gender, birth, img)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                """
                values = (user_id, name, phone, address, gender, birth, img)

            elif request.method == 'PUT':
                query = """
                    UPDATE user_info
                    SET name = %s, phone = %s, address = %s, gender = %s, birth = %s, img = %s
                    WHERE user_id = %s;
                """
                values = (name, phone, address, gender, birth, img, user_id)

            else:
                return jsonify({"message": "Method not allowed"}), 405

            try:
                app.cursor.execute(query, values)
                app.conn.commit()
                return jsonify({"message": "User info updated"})
            
            except Error as e:
                app.conn.rollback()
                app.app.logger.error(f"Error updating user info: {e}")
                return jsonify({"message": str(e)}), 400
            
        return user_info();