import mysql.connector

class NumpyMySQLConverter(mysql.connector.conversion.MySQLConverter):
    """ A mysql.connector Converter that handles Numpy types """

    def _float32_to_mysql(self, value):
        return float(value)

    def _float64_to_mysql(self, value):
        return float(value)

    def _int32_to_mysql(self, value):
        return int(value)

    def _int64_to_mysql(self, value):
        return int(value)

def connect_to_fantasy_commander():
        db = mysql.connector.Connect(
                user="root",
                password ="",
                host = "localhost",
                db ="fantasy_commander"
        )
        db.set_converter_class(NumpyMySQLConverter)
        return db
                
