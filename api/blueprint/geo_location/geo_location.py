from flask import Blueprint, jsonify, request, current_app
import mysql.connector
from modules.DataBase import DBA
from modules.utilty import getLabel

geo_lan = Blueprint("GEO Location",__name__)
@geo_lan.route("/location", methods=['POST','GET'])
def app():
    app = current_app.config["app"]
    @app.auth.login_required
    def locationManagement():
            db = DBA()
            db.connect()
            user_id = app.auth.current_user()
            app.app.logger.info(f'User {user_id["user_id"]} accessed location')
            if request.method == 'POST':
                data = request.json
                if not data:
                    db.disconnect()
                    return jsonify({"message": "No data provided"}), 400
                
                if getLabel(user_id['user_id']) == 1:
                    latitude = data.get("lat")
                    longitude = data.get("lon")
                    dist = data.get("dic")
                    query = """INSERT INTO `collage_location` (`id`, `lat`, `lon`, `distend`, `createBy`, `createDate`) VALUES (NULL, %s, %s, %s, %s, current_timestamp());"""
                    try:
                        db.cursor.execute(query, (latitude, longitude, dist, user_id['user_id']))
                        db.conn.commit()
                        db.disconnect()
                        return jsonify({}), 200
                    except mysql.connector.Error as e:
                        error_message = str(e)
                        db.conn.rollback()
                        app.app.logger.error(e)
                    db.disconnect()
                    return jsonify({"message": error_message}), 400
                else:
                    db.disconnect()
                    return jsonify({"message": "You are not authorized to access this endpoint"}), 403
            elif request.method == 'GET':
                query = """SELECT `lat`, `lon`, `distend`
                            FROM `collage_location`
                            ORDER BY `createDate` DESC
                            LIMIT 1;
                        """
                db.cursor.execute(query)
                locations = db.cursor.fetchone()
                db.disconnect()
                return jsonify({"locations": locations}), 200
    return locationManagement()
    