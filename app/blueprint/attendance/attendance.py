from flask import Blueprint, jsonify, request, current_app
import mysql.connector

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
                if app.getLabel(user_id['user_id']) <= 2:
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
                        WHERE ui.user_id = %s 
                        LIMIT 10;
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