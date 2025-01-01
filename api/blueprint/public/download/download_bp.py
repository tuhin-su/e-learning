import io
from flask import Blueprint, jsonify, request, send_file, abort
from modules.DataBase import DBA
from mysql.connector import Error
from base64 import b64decode
import json

download_bp = Blueprint("Download", __name__)

@download_bp.route('/public/download/<string:id>', methods=['GET'])
def app(id):
    # Initialize database connection
    dba = DBA()
    dba.connect()

    # Decode base64 ID to get the original JSON string
    try:
        decoded_data = b64decode(id).decode('utf-8')  # Decoding bytes to string
        info = json.loads(decoded_data)  # Convert string to JSON (dictionary)
    except Exception as e:
        dba.disconnect()
        return jsonify({"message": "Invalid base64 data", "error": str(e)}), 400

    # Check if the required fields exist in the decoded data
    if "id" in info and "createBy" in info:
        sql = "SELECT `content`, `content_name`, `content_type`, `content_size` FROM `posts_data` WHERE `id` = %s AND `createBy` = %s;"
        try:
            # Execute the SQL query with the correct parameters
            dba.cursor.execute(sql, (info["id"], info["createBy"]))
            data = dba.cursor.fetchone()

            # Check if data was found
            if data:
                # Convert the content to a file stream
                file_stream = io.BytesIO(data["content"])
                file_stream.seek(0)
                return send_file(file_stream, as_attachment=True, download_name=data["content_name"], mimetype=data["content_type"])
            else:
                dba.disconnect()
                return jsonify({"message": "File not found"}), 404
        except Error as e:
            dba.disconnect()
            return jsonify({"message": str(e)}), 400
    else:
        dba.disconnect()
        return jsonify({"message": "Invalid data"}), 400
