from mysql.connector import Error
from modules.DataBase import DBA
def getLabel(id):
        dba = DBA()
        if id:
            dba.connect()
            query = """SELECT g.label FROM `user` u JOIN `group` g ON u.`groups` = g.`code` WHERE u.`id` = %s;"""
            try:
                dba.cursor.execute(query, (id,))
                return dba.cursor.fetchone()['label']
            except Error as e:
                # self.app.logger.error(e)
                return -1
            finally:
                dba.disconnect()