from flask import Blueprint, jsonify, request, current_app
import mysql.connector

geo_lan = Blueprint("GEO Location",__name__)
@geo_lan.route("/location", methods=['POST','GET'])
def app():
    app = current_app.config["app"]
    @app.auth.login_required
    def locationManagement():
            user_id = app.auth.current_user()
            app.app.logger.info(f'User {user_id["user_id"]} accessed location')
            if request.method == 'POST':
                data = request.json
                if not data:
                    return jsonify({"message": "No data provided"}), 400
                
                if app.getLabel(user_id['user_id']) == 1:
                    latitude = data.get("lat")
                    longitude = data.get("lon")
                    dist = data.get("dic")
                    query = """INSERT INTO `collage_location` (`id`, `lat`, `lon`, `distend`, `createBy`, `createDate`) VALUES (NULL, %s, %s, %s, %s, current_timestamp());"""
                    try:
                        app.cursor.execute(query, (latitude, longitude, dist, user_id['user_id']))
                        app.conn.commit()
                        return jsonify({}), 200
                    except mysql.connector.Error as e:
                        error_message = str(e)
                        app.conn.rollback()
                        app.app.logger.error(e)
                    return jsonify({"message": error_message}), 400
                else:
                    return jsonify({"message": "You are not authorized to access this endpoint"}), 403
            elif request.method == 'GET':
                query = """SELECT `lat`, `lon`, `distend`
                            FROM `collage_location`
                            ORDER BY `createDate` DESC
                            LIMIT 1;
                        """
                app.cursor.execute(query)
                locations = app.cursor.fetchone()
                return jsonify({"locations": locations}), 200
    return locationManagement()
            