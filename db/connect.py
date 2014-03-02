import mysql.connector

class Connection():

        def __init__(self):
                self.connect_to_fantasy_commander()

        def connect_to_fantasy_commander(self):
                self.db = mysql.connector.Connect(
                user="root",
                password ="",
                host = "localhost",
                db ="fantasy_commander"
        )
                self.cursor = self.db.cursor()
