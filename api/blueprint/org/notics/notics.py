from flask import Blueprint, jsonify, request, current_app
from mysql.connector import Error
import requests as web_rq
from modules.DataBase import DBA

notice = Blueprint("NoticeBord", __name__)


@notice.route('/notice', methods=['POST', 'GET'])
def app():
    app = current_app.config["app"]
    
    @app.auth.login_required
    def heandel():
            db = DBA()
            user_id = app.auth.current_user()['user_id']
            if request.method == 'GET':
                rq = web_rq.get('https://www.timt.org.in/api/protected/notice')
                return rq.json
    return heandel();