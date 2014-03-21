import numpy
import math
from connect import *
import collections

#---CONNECT
db = connect_to_fantasy_commander()
cursor = db.cursor()

#---HELPER FUNCTIONS

#Converts SQL result to a dict.  Each col is an element in the dict
def dataframe(result, colnames):
  df = collections.OrderedDict() #Need to use ordered to preserve col order
  for c in colnames:
      df[c] = list()
  i = 0
  for d in df:
    for r in result:
      if r[i].__class__.__name__ == 'Decimal': #convert decimal to float
        value = float(r[i])
      else:
        value = r[i]
      df[d].append(value)
    i += 1
  return df

#Z-score calculation
def zs(x, sample):
    xbar = numpy.mean(sample, None)
    sd = numpy.std(sample)
    if math.isnan((x - xbar)/sd): #NaN when SD = 0, which implies that every observation is the same, so the Z-score should be 0
      return 0
    else:
      return (x - xbar)/sd

#Normalized player value for a category (e.g., r, hr, rbi)
def ctgry_value(metric, normalizer, normalizer_coeff):
  ctgry_values = list()
  normal = [a*b for a, b in zip(metric, normalizer)]
  for n in normal:
    ctgry_values.append (zs(n, normal) * normalizer_coeff)
  return ctgry_values

#---VALUE CALCULATION


def overall_value(bat, pitch, system, year):
  #Normalization
  bat_normalizer = bat['pa']
  pitch_normalizer = pitch['ip']
  base_normalizer = bat['pa']
  bat_normalizer_coeff = numpy.mean(base_normalizer) / numpy.mean(bat_normalizer)
  pitch_normalizer_coeff = numpy.mean(base_normalizer) / numpy.mean(pitch_normalizer)

  #Calculate batter value
  vrun = ctgry_value(bat['r'], bat_normalizer, bat_normalizer_coeff)
  vrbi = ctgry_value(bat['rbi'], bat_normalizer, bat_normalizer_coeff)
  vhr = ctgry_value(bat['hr'], bat_normalizer, bat_normalizer_coeff)
  vavg = ctgry_value(bat['avg'], bat_normalizer, bat_normalizer_coeff)
  vsb = ctgry_value(bat['sb'], bat_normalizer, bat_normalizer_coeff)
  bat_value = [a + b + c + d + e for a, b, c, d, e in zip(vrun, vrbi, vhr, vavg, vsb)]

  #Calculate pitcher value
  neg_era = [-1 * x for x in pitch['era']]
  neg_whip = [-1 * ((a + b) / c) for a, b, c in zip(pitch['bb'], pitch['h'], pitch['ip'])]

  vw = ctgry_value(pitch['w'], pitch_normalizer, pitch_normalizer_coeff)
  vsv = ctgry_value(pitch['sv'], pitch_normalizer, pitch_normalizer_coeff)
  vk = ctgry_value(pitch['so'], pitch_normalizer, pitch_normalizer_coeff)
  vera = ctgry_value(neg_era, pitch_normalizer, pitch_normalizer_coeff)
  vwhip = ctgry_value(neg_whip, pitch_normalizer, pitch_normalizer_coeff)
  pitch_value = [a + b + c + d + e for a, b, c, d, e in zip(vw, vsv, vk, vera, vwhip)]

  #Insert transformed data
  for i in range(len(bat_value)):
    insert_into_projected_batter_value([bat['player_id'][i], bat['name'][i], system, year, vrun[i], vrbi[i], vhr[i], vavg[i], vsb[i], bat_value[i]])

  for i in range(len(pitch_value)):
    insert_into_projected_pitcher_value([pitch['player_id'][i], pitch['name'][i], system, year, vw[i], vsv[i], vk[i], vera[i], vwhip[i], pitch_value[i]])

def insert_into_projected_pitcher_value(values):
  #print values
  insert = '''
          INSERT INTO projected_pitcher_value
          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
          '''
  cursor.execute(insert, values)
  db.commit()

def insert_into_projected_batter_value(values):
  #print values
  insert = '''
          INSERT INTO projected_batter_value
          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
          '''
  cursor.execute(insert, values)
  db.commit()

#---LOAD BATTER AND PITCHER PROJECTION DATA FROM DB AND CREATE DICTIONARY "DATAFRAMES"

#STEAMER PROJECTED VALUE
batter_query = """
            SELECT DISTINCT
                fan.player_id,
                fan.name,
                CASE WHEN fan.team LIKE 'Fans (%' THEN 'Fans' ELSE fan.team END AS team,
                lg.league,
                fan.pa,
                fan.hr,
                fan.r,
                fan.rbi,
                fan.avg,
                fan.sb
            FROM fangraphs_batter_standard fan
            JOIN yahoo_player yahoo ON yahoo.fangraphs_player_id = fan.player_id
            JOIN league lg ON lg.team = yahoo.team
            WHERE fan.team = 'Steamer'
            AND lg.league = 'AL'
            """

cursor.execute(batter_query)
result = cursor.fetchall()

#Create batter dataframe
colnames = ['player_id', 'name', 'team', 'league', 'pa', 'hr', 'r', 'rbi', 'avg', 'sb']
bat = dataframe(result, colnames)  

#Pitcher query
pitcher_query = """
            SELECT DISTINCT
                fan.player_id,
                fan.name,
                CASE WHEN fan.team LIKE 'Fans (%' THEN 'Fans' ELSE fan.team END AS team,
                lg.league,
                fan.ip,
                fan.w,
                fan.sv,
                fan.so,
                fan.era,
                fan.h,
                fan.bb,
		fan.ibb
            FROM fangraphs_pitcher_standard fan
            JOIN yahoo_player yahoo ON yahoo.fangraphs_player_id = fan.player_id
            JOIN league lg ON lg.team = yahoo.team
            WHERE fan.team = 'Steamer'
            AND lg.league = 'AL'
            """

cursor.execute(pitcher_query)
result = cursor.fetchall()

#Create pitcher dataframe
colnames = ['player_id', 'name', 'team', 'league', 'ip', 'w', 'sv', 'so', 'era', 'h', 'bb', 'ibb']
pitch = dataframe(result, colnames)

overall_value(bat, pitch, 'steamer', '2014')

#---ZIPS PROJECTED VALUE
batter_query = """
            SELECT DISTINCT
                fan.player_id,
                fan.name,
                CASE WHEN fan.team LIKE 'Fans (%' THEN 'Fans' ELSE fan.team END AS team,
                lg.league,
                fan.pa,
                fan.hr,
                fan.r,
                fan.rbi,
                fan.avg,
                fan.sb
            FROM fangraphs_batter_standard fan
            JOIN yahoo_player yahoo ON yahoo.fangraphs_player_id = fan.player_id
            JOIN league lg ON lg.team = yahoo.team
            WHERE fan.team = 'ZiPS'
            AND lg.league = 'AL'
            """

cursor.execute(batter_query)
result = cursor.fetchall()

#Create batter dataframe
colnames = ['player_id', 'name', 'team', 'league', 'pa', 'hr', 'r', 'rbi', 'avg', 'sb']
bat = dataframe(result, colnames)  

#Pitcher query
pitcher_query = """
            SELECT DISTINCT
                fan.player_id,
                fan.name,
                CASE WHEN fan.team LIKE 'Fans (%' THEN 'Fans' ELSE fan.team END AS team,
                lg.league,
                fan.ip,
                fan.w,
                fan.sv,
                fan.so,
                fan.era,
                fan.h,
                fan.bb,
		fan.ibb
            FROM fangraphs_pitcher_standard fan
            JOIN yahoo_player yahoo ON yahoo.fangraphs_player_id = fan.player_id
            JOIN league lg ON lg.team = yahoo.team
            WHERE fan.team = 'ZiPS'
            AND lg.league = 'AL'
            """

cursor.execute(pitcher_query)
result = cursor.fetchall()

#Create pitcher dataframe
colnames = ['player_id', 'name', 'team', 'league', 'ip', 'w', 'sv', 'so', 'era', 'h', 'bb', 'ibb']
pitch = dataframe(result, colnames)

overall_value(bat, pitch, 'ZiPS', '2014')

#FANS query
batter_query = """
            SELECT DISTINCT
                fan.player_id,
                fan.name,
                CASE WHEN fan.team LIKE 'Fans (%' THEN 'Fans' ELSE fan.team END AS team,
                lg.league,
                fan.pa,
                fan.hr,
                fan.r,
                fan.rbi,
                fan.avg,
                fan.sb
            FROM fangraphs_batter_standard fan
            JOIN yahoo_player yahoo ON yahoo.fangraphs_player_id = fan.player_id
            JOIN league lg ON lg.team = yahoo.team
            WHERE fan.team like 'Fans (%)'
            AND lg.league = 'AL'
            """

cursor.execute(batter_query)
result = cursor.fetchall()

#Create batter dataframe
colnames = ['player_id', 'name', 'team', 'league', 'pa', 'hr', 'r', 'rbi', 'avg', 'sb']
bat = dataframe(result, colnames)  

#Pitcher query
pitcher_query = """
            SELECT DISTINCT
                fan.player_id,
                fan.name,
                CASE WHEN fan.team LIKE 'Fans (%' THEN 'Fans' ELSE fan.team END AS team,
                lg.league,
                fan.ip,
                fan.w,
                fan.sv,
                fan.so,
                fan.era,
                fan.h,
                fan.bb,
		fan.ibb
            FROM fangraphs_pitcher_standard fan
            JOIN yahoo_player yahoo ON yahoo.fangraphs_player_id = fan.player_id
            JOIN league lg ON lg.team = yahoo.team
            WHERE fan.team like 'Fans (%)'
            AND lg.league = 'AL'
            """

cursor.execute(pitcher_query)
result = cursor.fetchall()

#Create pitcher dataframe
colnames = ['player_id', 'name', 'team', 'league', 'ip', 'w', 'sv', 'so', 'era', 'h', 'bb', 'ibb']
pitch = dataframe(result, colnames)

overall_value(bat, pitch, 'Fans', '2014')


#Average query
batter_query = """
            SELECT
              player_id,
              name,
              'Steamer-ZiPS-Fans Mean' as team,
              league,
              avg(pa) as pa,
              avg(hr) as hr,
              avg(r) as r,
              avg(rbi) as rbi,
              avg(avg) as avg,
              avg(sb) as sb
            FROM (
              SELECT DISTINCT
                  fan.player_id,
                  fan.name,
                  CASE WHEN fan.team LIKE 'Fans (%' THEN 'Fans' ELSE fan.team END AS team,
                  lg.league,
                  fan.pa,
                  fan.hr,
                  fan.r,
                  fan.rbi,
                  fan.avg,
                  fan.sb
              FROM fangraphs_batter_standard fan
              JOIN yahoo_player yahoo ON yahoo.fangraphs_player_id = fan.player_id
              JOIN league lg ON lg.team = yahoo.team
              WHERE (fan.team like 'Steamer' or fan.team like 'ZiPS' or fan.team like 'Fans (%)')
              AND lg.league = 'AL'
            )t
            GROUP BY player_id, name, league
            """

cursor.execute(batter_query)
result = cursor.fetchall()

#Create batter dataframe
colnames = ['player_id', 'name', 'team', 'league', 'pa', 'hr', 'r', 'rbi', 'avg', 'sb']
bat = dataframe(result, colnames)  

#Pitcher query
pitcher_query = """
                SELECT
                    player_id,
                    name,
                    'Steamer-ZiPS-Fans Mean' as team,
                    league,
                    avg(ip) as ip,
                    avg(w) as w,
                    avg(sv) as sv,
                    avg(so) as so,
                    avg(era) as era,
                    avg(bb) as bb,
                    avg(ibb) as ibb,
                    avg(h) as h
                  FROM (
                    SELECT DISTINCT
                            fan.player_id,
                            fan.name,
                            CASE WHEN fan.team LIKE 'Fans (%' THEN 'Fans' ELSE fan.team END AS team,
                            lg.league,
                            fan.ip as ip,
                            fan.w as w,
                            fan.sv as sv,
                            fan.so as so,
                            fan.era as era,
                            fan.bb as bb,
                            fan.ibb as ibb,
                        fan.h as h
                    FROM fangraphs_pitcher_standard fan
                    JOIN yahoo_player yahoo ON yahoo.fangraphs_player_id = fan.player_id
                    JOIN league lg ON lg.team = yahoo.team
                    WHERE (fan.team like 'Steamer' or fan.team like 'ZiPS' or fan.team like 'Fans (%)')
                    AND lg.league = 'AL'
                  )t
                  GROUP BY player_id, name, league
            """

cursor.execute(pitcher_query)
result = cursor.fetchall()

#Create pitcher dataframe
colnames = ['player_id', 'name', 'team', 'league', 'ip', 'w', 'sv', 'so', 'era', 'h', 'bb', 'ibb']
pitch = dataframe(result, colnames)

overall_value(bat, pitch, 'Steamer-Zips-Fans Mean', '2014')


