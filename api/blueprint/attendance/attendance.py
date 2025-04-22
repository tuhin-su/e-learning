from flask import Blueprint, jsonify, request, current_app
import mysql.connector # type: ignore
from flask import request, jsonify
import base64
import face_recognition # type: ignore
import io
import base64
from modules.DataBase import DBA
from modules.utilty import getLabel
try:
    from rich import print
except:
    pass

attendance_bp = Blueprint("Attendance", __name__)


@attendance_bp.route('/attendance', methods=['POST', 'PUT', 'GET'])
def attendance():
    app = current_app.config["app"]
    
    @app.auth.login_required
    def hendel_att():
        db = DBA()
        db.connect()

        user_id = app.auth.current_user()
        current_app.logger.info(f'User {user_id["user_id"]} accessed attendance')


        try:
            if request.method == 'POST':
                # Check if user has the necessary access
                if getLabel(user_id['user_id']) <= 2: # for admin and staff
                    data = request.json

                    requerments = ["stream", "sem", "date"]
                    for i in requerments:
                        if i not in data:
                            db.disconnect()
                            return jsonify({"message": f"{i} is required"}), 400

                    stream = data.get("stream")
                    sem = data.get("sem")
                    date = data.get("date")

                    query = """SELECT a.id AS attend_id, a.user_id, u.name AS name, a.attendance_date, u.img, s.roll FROM attends a JOIN user_info u ON a.user_id = u.user_id LEFT JOIN student s ON u.user_id = s.id WHERE s.course = %s AND s.semester = %s AND DATE(a.attendance_date) = STR_TO_DATE(%s, '%m/%d/%Y');"""

                    db.cursor.execute(query, (stream, sem, date))
                    attendance = db.cursor.fetchall()
                    db.disconnect()
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
                    db.cursor.execute(query, (user_id['user_id'],))
                    record = db.cursor.fetchall()
                    db.disconnect()
                    return jsonify({"record": record}), 200

            elif request.method == 'PUT':
                # Insert a new attendance record
                query = """
                    INSERT INTO attends (user_id, attendance_date, attendance_date_only)
                    VALUES (%s, NOW(), CURDATE());
                """
                try:
                    db.cursor.execute(query, (user_id['user_id'],))
                    db.conn.commit()
                    db.disconnect()
                    return jsonify({}), 200
                except mysql.connector.Error as e:
                    # Handle duplicate entry error
                    if e.errno == 1062:
                        error_message = "Attendance already recorded for this user on the same day"
                        db.disconnect()
                        return jsonify({"message": error_message}), 200
                    else:
                        error_message = str(e)
                    db.conn.rollback()
                    current_app.logger.error(f"Error recording attendance: {e}")
                    db.disconnect()
                    return jsonify({"message": error_message}), 400
                finally:
                    db.disconnect()
            
            elif request.method == 'GET':
                sql = "SELECT `id`, `attendance_date` FROM `attends` WHERE `user_id` = '511aee95c3a6bbc303e9bda596b9b4cfe9bc02c529c9311ee04d930cc7ddfe1c' AND `attendance_date_only` = CURRENT_DATE();"
                try:
                    db.cursor.execute(sql)
                    result = db.cursor.fetchone()
                    db.disconnect()
                    if result:
                        return jsonify({"record": result}), 200
                except:
                    db.disconnect()
                return jsonify({"message": "Record not found"}), 400
            else:
                return jsonify({"message": "Invalid request"}), 400
        except mysql.connector.Error as e:
            # Log any other MySQL errors
            current_app.logger.error(f"Database error: {e}")
            db.disconnect()
            return jsonify({"message": "An error occurred while processing your request"}), 500
        finally:
            db.disconnect()
    
    return hendel_att()

@attendance_bp.route('/attendance/comeHaven', methods=['POST'])
def attGive():
    app = current_app.config["app"]
    @app.auth.login_required
    def heandel():
        db = DBA()
        db.connect()
        data = request.json
        if not data["id"]:
            db.disconnect()
            return jsonify({"message": "No data provided"}), 400
        
        sql = "INSERT INTO attends (user_id, attendance_date, attendance_date_only)VALUES (%s, NOW(), CURDATE())"
        try:
            db.cursor.execute(sql, (data["id"],))
            db.conn.commit()
            db.disconnect()
            return jsonify({"message": "Attendance recorded"}), 200
        except mysql.connector.errors.IntegrityError as e:
            if e.errno == 1062:
                db.disconnect()
                return jsonify({"message": "Attendance already recorded"}), 200
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()
    return heandel()

@attendance_bp.route('/attendance/face', methods=['POST'])
def attFace():
    app = current_app.config["app"]
    @app.auth.login_required
    def heandel():
        db = DBA()
        db.connect()
        user_id = app.auth.current_user()['user_id']
        data = request.json

        image_b64 = data.get('image')
        if not image_b64:
            db.disconnect()
            return jsonify({'massage': 'No image provided'}), 400

        
        #  get curent user info
        sql = "SELECT `course`,`semester` FROM `student` WHERE `id` = %s;"
        try:
            db.cursor.execute(sql, (user_id, ))
            result = db.cursor.fetchone()
        except:
            db.disconnect()
            return jsonify({'massage': 'Internal server error code: DCE'}), 500

        if not result:
            db.disconnect()
            return jsonify({'massage': 'Only Student allow to give attendance'}), 404
        

        # select all user img from user_info
        sql = """SELECT u.user_id, u.img,u.name,s.roll FROM user_info u JOIN student s ON u.user_id = s.id WHERE s.id != %s AND course = %s AND semester = %s AND u.img IS NOT NULL;"""    
        try:
            db.cursor.execute(sql, (user_id, result['course'], result['semester']))
            result = db.cursor.fetchall()
        except:
            db.disconnect()
            return jsonify({'massage': 'Internal server error code: DCE'}), 500


        if not result:
            db.disconnect()
            return jsonify({'massage': f'Invalid sql query {result}'}), 404
    
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
                db.disconnect()
                return jsonify({"res":"Could not detect a face in one of the images."})

            result = face_recognition.compare_faces([img1_encoding[0]], img2_encoding[0])

            if result:
                db.disconnect()
                return jsonify(i),200
            else:
                db.disconnect()
                return jsonify({"res":"No face matched plese update face data or tray agen"}),400
            
        db.disconnect()
        return jsonify({'massage': 'Invalid data'}), 400

    return heandel()







@attendance_bp.route('/attendance/record', methods=['POST', 'PUT', 'GET'])
def attendance_record():
    app = current_app.config["app"]

    @app.auth.login_required
    def handle_attendance():
        db = DBA()
        db.connect()

        user_id = app.auth.current_user()
        current_app.logger.info(f'User {user_id["user_id"]} accessed attendance')

        if request.method == 'POST':
            # Check user access level
            if getLabel(user_id['user_id']) > 2:
                db.disconnect()
                return jsonify({"message": "Access denied"}), 403

            data = request.json or {}

            # Required fields
            required_fields = ["stream", "sem"]
            for field in required_fields:
                if field not in data:
                    db.disconnect()
                    return jsonify({"message": f"{field} is required"}), 400

            stream = data.get("stream")
            sem = data.get("sem")
            date = data.get("date")
            month = data.get("month")
            year = data.get("year")

            # Base query
            query = """
                SELECT 
                    a.id AS attend_id,
                    a.user_id,
                    u.name AS name,
                    a.attendance_date,
                    u.img,
                    s.roll
                FROM attends a
                JOIN user_info u ON a.user_id = u.user_id
                LEFT JOIN student s ON u.user_id = s.id
                WHERE s.course = %s AND s.semester = %s
            """
            params = [stream, sem]

            # Add date filters based on input
            if date and month and year:
                date = f"{month/date/year}"
                query += " AND DATE(a.attendance_date) = STR_TO_DATE(%s, '%%m/%%d/%%Y')"
                params.append(date)
            elif month and year:
                query += " AND MONTH(a.attendance_date) = %s AND YEAR(a.attendance_date) = %s"
                params.extend([month, year])
            elif year:
                query += " AND YEAR(a.attendance_date) = %s"
                params.append(year)

            # return  jsonify({"msg": query %  tuple(params) })
            try:
                db.cursor.execute(query, tuple(params))
                attendance = db.cursor.fetchall()
            except Exception as e:
                current_app.logger.error(f"Error fetching attendance: {e}")
                db.disconnect()
                return jsonify({"message": "Database error", "error": str(e)}), 500

            db.disconnect()
            return jsonify({"attendance": attendance}), 200

        db.disconnect()
        return jsonify({"message": "Invalid request method"}), 405

    return handle_attendance()



