from mysql.connector import Error
import os
import mysql
class DBA:
    def __init__(self):
        # Initialize MySQL connection
        self.conn = None
        self.cursor = None
        
    def connect(self):
        try:
            self.conn = mysql.connector.connect(
                host=os.getenv('DB_HOST'), 
                database=os.getenv('DB_DATABASE'),
                user=os.getenv('DB_USER'), 
                password=os.getenv('DB_PASSWORD')
            )
            if self.conn.is_connected():
                db_info = self.conn.get_server_info()
                self.cursor = self.conn.cursor(dictionary=True) 
        except Error as e:
            raise e
    def disconnect(self):
        if self.conn and self.conn.is_connected():
            self.cursor.close()
            self.conn.close()