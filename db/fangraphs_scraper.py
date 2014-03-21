from bs4 import BeautifulSoup
import requests
import csv
import re
import mysql.connector  

class fangraphs_scraper():

    def __init__(self, scrape_type, league, player_type, year, table):
        self.base = "http://www.fangraphs.com/"
        self.player_path = "players.aspx"
        self.league_path = 'leaders.aspx?pos=all&stats=bat&lg=' + league + '&qual=0&type=8&season=2013&month=0&season1=2013&ind=0&team=0,ts&players=0'
        self.scrape_type = scrape_type
        #self.filename = filename
        #self.writer = csv.writer(open (self.filename, "wb")) #INITIALIZE: csv writer
        self.year = year
        self.player_type = player_type
        self.table = table
        #if self.table == 'standard':
            #if self.player_type == 'batter':
                #self.header = ["player_id", "name", "pos", "dob", "current_team", "year", "team", "g", "pa", "hr", "r", "rbi", "sb", "bb_pct", "k_pct", "iso", "babip", "avg", "obp", "slg", "woba", "wrc_plus", "bsr", "off", "def", "war"]
            #elif self.player_type == 'pitcher':
                #self.header = ["player_id", "name", "pos", "dob", "current_team", "year", "team", "w", "l", "era", "g", "gs", "cg", "sho", "sv", "hld", "bs", "ip", "tbf", "h", "r", "er", "hr", "bb", "ibb", "hbp", "wp", "bk", "so"]
        self.insert_count = 0

    def connect(self):
        self.db = mysql.connector.Connect(
            user="root",
            password ="",
            host = "localhost",
            db ="fantasy_commander"
        )
        self.cursor = self.db.cursor()

    #---get text from a table cell---
    def cell_text(self, cell):
        return " ".join(cell.stripped_strings)

    #---get beautiful soup from a url---
    def url_to_soup(self, url):
        r = requests.get(url)
        data = r.text
        return BeautifulSoup(data)
        
    #---crawl through alphabetical links---
    def crawl_alpha_links(self):
        soup = self.url_to_soup(self.base + self.player_path) #REQUEST: player index
        links = soup.findAll("a", href=re.compile("^players.aspx")) #SCRAPE: alphabetical key links
        for link in links: #ITERATE: alphabetical keys
            path = link.get("href")
            self.crawl_alpha_subset(path)
           
    #---crawl through a two-letter alphabetical subset of players (e.g., Ac)
    def crawl_alpha_subset(self, path):
         soup = self.url_to_soup(self.base + path) #REQUEST: alphabetical key page
         div = soup.find("div", {"class": "search"}) #NOTE: div containing table of major league players
         rows = div.findAll("tr")
         for row in rows:
             cells = row.findAll("td")
             date_range = cells[1].text #NOTE: date range is second column

             year2 = date_range.split(" - ")[1]  #SCRAPE: year2

             if year2== self.year: #INPUT CHECK: year
                link = cells[0].find("a")
                name = link.text #SCRAPE: name
                path = link.get("href")

                m = re.search("position\=(.*?)$", path) #SCRAPE: pos
                pos = m.group(1)

                team = "N/A"

                if (pos == "P" and self.player_type =="pitcher") or (pos != "P" and self.player_type == "batter"): #INPUT CHECK: player_type
                    try:
                        self.scrape_player_page(path, team, name, pos)
                    except:
                        print "Couldn't scrape page"

    #---crawl through AL or NL teams
    def crawl_teams(self):
        soup = self.url_to_soup(self.base + self.league_path)
        links = soup.findAll("a", href=re.compile("leaders.aspx\?pos=all&stats=bat&lg=all&qual=0&type=8&season=2013&month=0&season1=2013&ind=0&team=[0-9]+&rost=0&age=0")) #SCRAPE: AL team linkss:
        for link in links:
            path = link.get("href")
            team = link.text
            self.crawl_roster(path, team)

    #---crawl through players in on a roster
    def crawl_roster(self, path, team):
        print '---'
        print 'Crawling The ' + team
        team = team
        soup = self.url_to_soup(self.base + path)
        tableDiv = soup.find('div', {'id': 'LeaderBoard1_dg1'})
        links = tableDiv("a", href=re.compile("statss.aspx\?playerid=[0-9]+&position="))
        for link in links:
            path = link.get("href")
            name  = link.text
            m = re.search('position=(.+?)$', path) #SCRAPE: player_id
            pos = m.group(1)
            if (pos == "P" and self.player_type =="pitcher") or (pos != "P" and self.player_type == "batter"): #INPUT CHECK: player_type
                self.scrape_player_page(path, team, name, pos)
            
    #---scrape table data from a player's page
    def scrape_player_page(self, path, team, name, pos):
        print("Extracting data for " + name) #OUTPUT: player currently being scraped
        soup = self.url_to_soup(self.base + path) #REQUEST: player page:

        m = re.search('playerid\=(.+?)\&', path) #SCRAPE: player_id
        player_id = m.group(1)

        div= soup.find("div", {"id": "content"}) #SCRAPE: dob
        div = div.find("div")
        text = div.getText()
        m = re.search("Birthdate: ([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}).*Bats.*", text)
        dob = m.group(1)

        if self.table == 'standard' and self.player_type == 'batter':  #SCRAPE: master table
            table = soup.find("table", {"class": "rgMasterTable"})

        if self.table == 'standard' and self.player_type == 'pitcher':
            table = soup.find("table", {"id": "SeasonStats1_dgSeason1_ctl00"})

        body = table.find("tbody")
        for row in body.findAll("tr"):
            stats = map(self.cell_text, row.find_all("td"))
            self.insert([player_id] + [name] + [pos] + [dob] + [team] + stats) #WRITE: standard table row

    #insert data
    def insert(self, values):
        if self.player_type == 'batter':
            self.insert_batter(values)
        elif self.player_type == 'pitcher':
            self.insert_pitcher(values)
        else:
            print("Invalid player type")
            
    def insert_batter(self, values):
        insert = """
                INSERT INTO fangraphs_batter_standard
                (player_id, name, pos, dob, current_team, year, team, g, pa, hr, r, rbi, sb, bb_pct, k_pct, iso, babip, avg, obp, slg, woba, wrc_plus, bsr, off, def, war)
                VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """
        self.cursor.execute(insert, values)
        self.insert_count += 1
        if self.insert_count >= 1000:
            print "Committing 1,000 records"
            self.db.commit()
            self.insert_count=0

    def insert_pitcher(self, values):
        insert = """
                INSERT INTO fangraphs_pitcher_standard
                (player_id, name, pos, dob, current_team, year, team, w, l, era, g, gs, cg, sho, sv, hld, bs, ip, tbf, h, r, er, hr, bb, ibb, hbp, wp, bk, so)
                VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """
        self.cursor.execute(insert, values)
        self.insert_count += 1
        if self.insert_count >= 1000:
            print "Committing 1,000 records"
            self.db.commit()
            self.insert_count=0

    #---kickoff scraper---
    def scrape(self):
        print("Scraping fangraphs data")
        self.connect()
        #print("Writing to " + self.filename)
        #self.writer.writerow(self.header) #WRITE: table header
        if self.scrape_type == 'alpha':
            self.crawl_alpha_links()
        elif self.scrape_type == 'team':
            self.crawl_teams
        self.db.commit() #commit the remaining records
        print("--")
        print("Finished scraping")
#--------------------------------------------------

scraper = fangraphs_scraper("alpha", "all","pitcher", "2013", "standard")
scraper.scrape()


           
            
    
    
    
        
