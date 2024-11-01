from flask import Blueprint, jsonify, request, current_app
import mysql.connector
from flask import request, jsonify
import base64
import face_recognition
import io
import base64


try:
    from rich import print
except:
    pass

attendance_bp = Blueprint("Attendance", __name__)


@attendance_bp.route('/attendance', methods=['GET', 'PUT'])
def attendance():
    app = current_app.config["app"]
    
    @app.auth.login_required
    def hendel_att():
        user_id = app.auth.current_user()
        current_app.logger.info(f'User {user_id["user_id"]} accessed attendance')


        try:
            if request.method == 'GET':
                # Check if user has the necessary access
                if app.getLabel(user_id['user_id']) <= 2: # for admin and staff
                    data = request.json
                    if not data:
                        return jsonify({"message": "No data provided"}), 400

                    stream = data.get("stream")
                    sem = data.get("sem")

                    # Validate the stream and semester inputs
                    if not stream or not sem:
                        return jsonify({"message": "Stream and semester are required"}), 400

                    query = """
                        SELECT a.id AS attend_id, a.user_id, u.name AS user_name, a.attendance_date 
                        FROM attends a 
                        JOIN user_info u ON a.user_id = u.user_id 
                        JOIN student s ON u.user_id = s.id 
                        WHERE s.course = %s AND s.semester = %s AND DATE(a.attendance_date) = CURDATE();
                    """
                    app.cursor.execute(query, (stream, sem))
                    attendance = app.cursor.fetchall()

                    return jsonify({"attendance": attendance}), 200
                else:
                    # User with limited access, fetching own attendance
                    query = """
                        SELECT ui.name, a.attendance_date 
                        FROM user_info ui 
                        JOIN attends a ON ui.user_id = a.user_id 
                        WHERE ui.user_id = %s AND a.attendance_date_only =  CURDATE()
                        LIMIT 1;
                    """
                    app.cursor.execute(query, (user_id['user_id'],))
                    record = app.cursor.fetchall()
                    return jsonify({"record": record}), 200

            elif request.method == 'PUT':
                # Insert a new attendance record
                query = """
                    INSERT INTO attends (user_id, attendance_date, attendance_date_only)
                    VALUES (%s, NOW(), CURDATE());
                """
                try:
                    app.cursor.execute(query, (user_id['user_id'],))
                    app.conn.commit()
                    return jsonify({}), 200
                except mysql.connector.Error as e:
                    # Handle duplicate entry error
                    if e.errno == 1062:
                        error_message = "Attendance already recorded for this user on the same day"
                        return jsonify({"message": error_message}), 200
                    else:
                        error_message = str(e)
                    app.conn.rollback()
                    current_app.logger.error(f"Error recording attendance: {e}")
                    return jsonify({"message": error_message}), 400
            else:
                return jsonify({"message": "Invalid request"}), 400
        except mysql.connector.Error as e:
            # Log any other MySQL errors
            current_app.logger.error(f"Database error: {e}")
            return jsonify({"message": "An error occurred while processing your request"}), 500
    return hendel_att()

@attendance_bp.route('/attendance/comeHaven', methods=['POST'])
def attGive():
    app = current_app.config["app"]
    @app.auth.login_required
    def heandel():
        data = request.json
        if not data["id"]:
            return jsonify({"message": "No data provided"}), 400
        
        sql = "INSERT INTO attends (user_id, attendance_date, attendance_date_only)VALUES (%s, NOW(), CURDATE())"
        try:
            app.cursor.execute(sql, (data["id"],))
            app.conn.commit()
            return jsonify({"message": "Attendance recorded"}), 200
        except mysql.connector.errors.IntegrityError as e:
            if e.errno == 1062:
                return jsonify({"message": "Attendance already recorded"}), 200
            return jsonify({"message": str(e)}), 400


    
    return heandel()

@attendance_bp.route('/attendance/face', methods=['POST'])
def attFace():
    app = current_app.config["app"]
    @app.auth.login_required
    def heandel():
        user_id = app.auth.current_user()['user_id']
        data = request.json

        image_b64 = data.get('image')
        if not image_b64:
            return jsonify({'error': 'No image provided'}), 400

        
        #  get curent user info
        sql = "SELECT `course`,`semester` FROM `student` WHERE `id` = %s;"
        app.cursor.execute(sql, (user_id, ))
        result = app.cursor.fetchone()

        if not result:
            return jsonify({'error': 'Invalid Login'}), 404
        

        # select all user img from user_info
        sql = """SELECT u.user_id, u.img,u.name,s.roll FROM user_info u JOIN student s ON u.user_id = s.id WHERE s.id != %s AND course = %s AND semester = %s AND u.img IS NOT NULL;"""    
        app.cursor.execute(sql, (user_id, result['course'], result['semester']))
        result = app.cursor.fetchall()


        if not result:
            return jsonify({'error': f'Invalid sql query {result}'}), 404
    
        for i in result:
            img_data = i['img']
            
            if img_data is None:
                continue
            
            if img_data.startswith("data:image"):
                img_data = img_data.split(",")[1]

            if image_b64.startswith("data:image"):
                image_b64 = img_data.split(",")[1]

            img1_array = face_recognition.load_image_file(io.BytesIO(base64.b64decode(image_b64)))
            img2_array = face_recognition.load_image_file(io.BytesIO(base64.b64decode(img_data)))

            img1_encoding = face_recognition.face_encodings(img1_array)
            img2_encoding = face_recognition.face_encodings(img2_array)

            if not img1_encoding or not img2_encoding:
                return jsonify({"res":"Could not detect a face in one of the images."})

            result = face_recognition.compare_faces([img1_encoding[0]], img2_encoding[0])

            if result:
                return jsonify(i),200
            else:
                return jsonify({"res":"No face matched plese update face data or tray agen"}),400
            
        return jsonify({'error': 'Invalid data'}), 400

    return heandel()