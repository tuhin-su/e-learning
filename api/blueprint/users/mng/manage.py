from werkzeug.security import generate_password_hash
from flask import Flask,Blueprint ,request, jsonify,current_app
from datetime import datetime, timedelta
from mysql.connector import Error
from modules.DataBase import DBA
from modules.utilty import getLabel
from modules.otp import generate_otp
from base64 import b64encode, b64decode
from json import dumps, loads
from modules.emial_addpet import sendOTP


mng = Blueprint("User Management", __name__)

@mng.route('/users/mng', methods=['POST'])
def app():
        app = current_app.config["app"]
        
        @app.auth.login_required
        def heandel():
            db = DBA()
            db.connect()

            user_id_ad = app.auth.current_user()['user_id']
            data = request.json
            
            if getLabel(user_id_ad) != 1 and getLabel(user_id_ad) != 2:
                db.disconnect()
                return jsonify({"message": "You are not authorized to perform this action"}), 403
            
            if "FROM" not in data:
                db.disconnect()
                return jsonify({"message": "FROM is required"}), 400
            
            if data['FROM'] == 'student_ac':
                if  "data" not in data:
                    db.disconnect()
                    return jsonify(["email","dob","roll","reg","course","semester"])
                
                else:
                    data = data["data"]
                    for i in ["email","dob","roll","reg","course","semester"]:
                        if i not in data:
                            db.disconnect()
                            return jsonify({"message": f"{i} is required"}), 400
                    
                    
                    # detect email exists or not 
                    sql = "SELECT id FROM `user` WHERE `email` = %s;"
                    try:
                        db.cursor.execute(sql, (data['email'],))
                        user = db.cursor.fetchone()
                        if user:
                            db.disconnect()
                            return jsonify({"message": "User already exists"}), 400
                        
                    except Error as e:
                        app.app.logger.error(f"Error checking user: {e}")
                        db.disconnect()
                        return jsonify({"message": str(e)}), 500
                    
                    user_id = app.generate_unique_id(data['email'], data['dob'], "ST")
                    sql = """INSERT INTO `user`(`id`, `email`, `passwd`, `groups`, `createBy`) VALUES (%s, %s, %s, %s, %s)"""

                    try:
                        db.cursor.execute(sql, (user_id, data['email'], generate_password_hash(data['dob']), "ST", user_id_ad))
                        db.conn.commit()
                        app.app.logger.info(f'Created new user: {data["email"]}')

                        try:
                            sql = "SELECT `id` FROM `course` WHERE `name` = %s;"
                            db.cursor.execute(sql, (data['course'],))
                            course = db.cursor.fetchone()['id']

                            # user_id
                            sql = """INSERT INTO `student`(`id`, `roll`, `reg`, `course`, `semester`, `reg_by`) VALUES (%s, %s, %s, %s, %s, %s);"""

                            try:
                                db.cursor.execute(sql, (user_id, data['roll'], data['reg'], course, data['semester'], user_id_ad))
                                db.conn.commit()
                                app.app.logger.info(f'Created new user: {data["email"]}')
                                db.disconnect()
                                return jsonify({"message": "User created"}), 201
                            
                            except Error as e:
                                app.app.logger.error(f"Error creating user: {e}")
                                db.disconnect()
                                return jsonify({"message": str(e)}), 500
                        
                        except Error as e:
                            db.disconnect()
                            return jsonify({"message": str(e)}), 500
                        
                    except Error as e:
                        app.app.logger.error(f"Error creating user: {e}")
                        db.disconnect()
                        return jsonify({"message": str(e)}), 500
                    
        return heandel();

@mng.route('/users/mng/chpw', methods=['POST'])
def chpw():
    app = current_app.config["app"]
    db = DBA()
    db.connect()
    data = request.json

    if "email" in data and not "otp" in data:

        # check email are exsit or not 
        sql = "SELECT `id` FROM `user` WHERE `email` = %s"

        try:
            db.cursor.execute(sql,(data["email"],))
            id = db.cursor.fetchone()
            if not id:
                return jsonify({"message": "Email not valid."})

        except Error as e:
            return jsonify({"message": "Internal server error code: DEC"}), 500
        
        otp = generate_otp()
        sql =  "INSERT INTO `otp`(`otp`, `for`) VALUES (%s,%s);"

        rfor = b64encode(dumps({
            "email": data['email'],
            "for": "chpw"
        }).encode()).decode()
        # send email 
        mail_title = "Your OTP for Password Reset"
        mail_content = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                background-color: #0073e6;
                color: #ffffff;
                padding: 10px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }}
            .footer {{
                font-size: 12px;
                color: #888888;
                text-align: center;
                margin-top: 20px;
            }}
            .otp {{
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                text-align: center;
                padding: 10px;
                background-color: #f4f4f4;
                border-radius: 4px;
            }}
            .instructions {{
                font-size: 16px;
                color: #555555;
                margin: 20px 0;
            }}
            .important {{
                color: #e74c3c;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Password Reset Request - TIMT App</h2>
            </div>
            <p>Dear User,</p>
            <p>We received a request to reset your password for your <strong>TIMT App</strong> account. To proceed, please use the One-Time Password (OTP) provided below:</p>
            
            <div class="otp">{otp}</div>
            
            <p class="instructions">This OTP is valid for the next <span class="important">10 minute</span>. Please ensure you enter it quickly to complete the password reset process.</p>
            
            <p class="instructions">If you did not request a password change, please disregard this email. If you continue to experience issues, feel free to contact our support team.</p>
            
            <div class="footer">
                <p>Thank you for using <strong>TIMT</strong>!</p>
                <p>The TIMT App Team</p>
            </div>
        </div>
    </body>
    </html>
    """
        if sendOTP(content=mail_content, receiver_email=data["email"], title=mail_title) == False:
            db.disconnect()
            return jsonify({"message": "Server error Email not send tray again later"}), 500
        
        try:
            db.cursor.execute(sql, (otp, rfor))
            id = db.cursor.lastrowid
            db.conn.commit()
            db.disconnect()
            return jsonify({"message": "success", "otp_token": id}), 200
        except Error as e:
            db.disconnect()
            return jsonify({"message": "Internal server error code: DEC"}), 500
        
    # update passowrd
    elif "password" in data and "otp_token" in data and "otp" in data and "email" in data:
        passwd = generate_password_hash(data['password'])
        otp_token = data['otp_token']
        sql = "SELECT * FROM `otp` WHERE `id` = %s;"
        try:
            db.cursor.execute(sql, (otp_token,))
            otp = db.cursor.fetchone()
            if otp:
                email = loads(b64decode(otp["for"]).decode())['email']
                curent_time = datetime.now()
                defftime = curent_time - otp['createDate']
                # check otp time starap 30 second old or not 

                if defftime > timedelta(seconds=600):
                    db.disconnect()
                    return jsonify({"message": "OTP token expired"}), 400
                
                if str(otp['otp']) == str(data['otp']):
                    pass
                else:
                    db.disconnect()
                    return jsonify({"message": "Invalid OTP"}), 400
            else:
                db.disconnect()
                return jsonify({"message": "Invalid OTP token"}), 400
        except Error as e:
            db.disconnect()
            return jsonify({"message": "Internal server error code: DEC"}), 500
    else:
        db.disconnect()
        return jsonify({"message": "No data provided"}), 400
    
    sql = "UPDATE `user` SET `passwd`=%s WHERE  `email` = %s;"
    try:
        db.cursor.execute(sql, (passwd, email,))
        db.conn.commit()
        db.disconnect()
        return jsonify({"message": "Password changed"}), 200
    
    except Error as e:
        db.disconnect()
        return jsonify({"message": str(e)}), 500