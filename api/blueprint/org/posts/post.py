from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
from base64 import b64encode, b64decode
from modules.DataBase import DBA

posts = Blueprint("Posts", __name__)
db = DBA()

@posts.route('/posts', methods=['POST'])
def app():
    app = current_app.config["app"]

    @app.auth.login_required
    def handle():
        db.connect()
        user_id = app.auth.current_user()['user_id']
        
        if request.method == 'POST':
            # Check if a file was provided
            if not request.files:
                db.disconnect()
                return jsonify({"message": "No file provided"}), 400

            file = request.files['file']
            content = file.read()  # Read file as binary data
            content_name = file.filename
            content_type = file.mimetype
            content_size = len(content)

            sql = '''INSERT INTO `posts_data` (`content`, `content_name`, `content_type`, `content_size`, `createBy`) 
                     VALUES (%s, %s, %s, %s, %s);'''
            
            try:
                db.cursor.execute(sql, (content, content_name, content_type, content_size, user_id))
                db.conn.commit()
                
                db.disconnect()
                return jsonify({
                    "message": "Post added successfully",
                    "post_id": db.cursor.lastrowid
                }), 200
            except Error as e:
                db.disconnect()
                return jsonify({"message": str(e)}), 400
            finally:
                db.disconnect()

    return handle()

@posts.route('/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    app = current_app.config["app"]

    @app.auth.login_required
    def handle():
        db.connect()
        sql = '''SELECT `id`, `content`, `content_name`, `content_type`, `content_size`, `createBy`, `createDate` FROM `posts_data` WHERE `id` = %s;'''
            
        try:
            db.cursor.execute(sql, (post_id,))
            data = db.cursor.fetchone()
            if data:
                data["content"] = b64encode(data["content"]).decode('utf-8')
            db.disconnect()
            return jsonify(data), 200
        except Error as e:
            db.disconnect()
            return jsonify({"message": str(e)}), 400
        finally:
            db.disconnect()

    return handle()