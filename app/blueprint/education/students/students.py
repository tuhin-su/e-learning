from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error


students = Blueprint("Students", __name__)


@students.route('/student', methods=['POST'])
def app():
    app = current_app.config["app"]
    
    @app.auth.login_required
    def hendel():
        user_id = app.auth.current_user()['user_id']
        lable = app.getLabel(user_id)

        # if not authorized then send this
        if lable != 1 and lable != 2:
            return jsonify({"message": "You are not authorized to access this endpoint"}), 403
        

        data = request.json
        requre_fild = ['id', 'roll', 'reg', 'course', 'semester']
        for i in requre_fild:
            if i not in data:
                return jsonify({"message": f"{i} is required"}), 400
                break

        sql = '''INSERT INTO `student` (`id`, `roll`, `reg`, `course`, `semester`, `reg_by`, `createDate`) VALUES (%s, %s, %s, %s, %s, %s, current_timestamp());'''
        try:
            app.cursor.execute(sql, (data['id'], data['roll'], data['reg'], data['course'], data['semester'], user_id))
            app.conn.commit()
            return jsonify({"message": "Student added successfully"}), 200
        except Error as e:
            return jsonify({"message": str(e)}), 400

    return hendel()