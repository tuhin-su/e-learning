import mysql.connector
from mysql.connector import Error
import random
import hashlib
from werkzeug.security import generate_password_hash, check_password_hash

class DBHandler:
    def __init__(self, host, database, user, password):
        try:
            self.connection = mysql.connector.connect(
                host=host,
                database=database,
                user=user,
                password=password
            )
            if self.connection.is_connected():
                db_info = self.connection.get_server_info()
                print(f"Connected to MySQL database... MySQL Server version on {db_info}")
        except Error as e:
            print(f"Error while connecting to MySQL: {e}")
            self.connection = None

    def close_connection(self):
        if self.connection.is_connected():
            self.connection.close()
            print("MySQL connection is closed")

    def generate_user_id(self, username):
        random_number = random.randint(1000, 9999)
        unique_string = f"{username}_{random_number}"
        unique_id = hashlib.sha256(unique_string.encode()).hexdigest()[:12]
        return unique_id

    def insert_user(self, username, password, groups):
        if not self.connection or not self.connection.is_connected():
            raise ConnectionError("No connection to the database.")

        try:
            cursor = self.connection.cursor()
            hashed_password = generate_password_hash(password)
            user_id = self.generate_user_id(username)
            groups = groups
            insert_query = """
            INSERT INTO `user` ( `id`, `email`, `passwd`, `groups`) 
            VALUES (%s, %s, %s, %s);
            """
            cursor.execute(insert_query, (user_id, username, hashed_password, groups))
            self.connection.commit()
            return { "code":200}
        except Error as e:
            self.connection.rollback()
            return {"code":400}

        finally:
            cursor.close()

    def authenticate_user(self, username, password):
        
        if not self.connection or not self.connection.is_connected():
            return {"code":521}

        try:
            cursor = self.connection.cursor(dictionary=True)
            query = "SELECT id, passwd FROM user WHERE email = %s AND status = 0"
            cursor.execute(query, (username,))
            user = cursor.fetchone()
            
            if user and check_password_hash(user['passwd'], password):
                return { "code":200, "id":user['id']}
            else:
                return {"code":561} # UN AUTH
        except Error as e:
            print(f"Error during user authentication: {e}")
            return {"code":522}
        
        finally:
            cursor.close()
