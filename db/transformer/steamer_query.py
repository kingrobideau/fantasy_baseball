from connect import Connection

conn = Connection()
conn.connect_to_fantasy_commander()

query = """
                SELECT 
                        name,
                        year,
                        team,
                        hr,
                        war
                FROM fangraphs_batter_standard 
                WHERE team = 'steamer'
                """

conn.cursor.execute(query)

for row in conn.cursor:
  print row
