from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
from base64 import b64encode, b64decode

posts = Blueprint("Posts", __name__)

@posts.route('/posts', methods=['POST', 'GET'])
def app():
    app = current_app.config["app"]

    @app.auth.login_required
    def handle():
        user_id = app.auth.current_user()['user_id']
        
        if request.method == 'POST':
            # Check if a file was provided
            if not request.files:
                return jsonify({"message": "No file provided"}), 400

            file = request.files['file']
            content = file.read()  # Read file as binary data
            content_name = file.filename
            content_type = file.mimetype
            content_size = len(content)

            sql = '''INSERT INTO `posts_data` (`content`, `content_name`, `content_type`, `content_size`, `createBy`) 
                     VALUES (%s, %s, %s, %s, %s);'''
            
            try:
                app.cursor.execute(sql, (content, content_name, content_type, content_size, user_id))
                app.conn.commit()
                
                return jsonify({
                    "message": "Post added successfully",
                    "post_id": app.cursor.lastrowid
                }), 200
            except Error as e:
                print(e)
                return jsonify({"message": str(e)}), 400

        elif request.method == 'GET':
            post_id = request.json.get('post_id')
            if not post_id:
                return jsonify({"message": "No data id provided"}), 400

            # Fetch metadata and content from the database
            sql = '''SELECT `content`, `content_name`, `content_type`, `content_size`, `createBy`, `createDate` 
                     FROM `posts_data` WHERE `id` = %s;'''
            
            try:
                app.cursor.execute(sql, (post_id,))
                data = app.cursor.fetchone()

                if data:
                    # Encode binary data to base64 for easier handling
                    data["content"] = b64encode(data["content"]).decode('utf-8')

                return jsonify(data), 200
            except Error as e:
                return jsonify({"message": str(e)}), 400

    return handle()
