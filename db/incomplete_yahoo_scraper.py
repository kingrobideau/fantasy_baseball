from bs4 import BeautifulSoup
import requests
import csv
import re
import mysql.connector  

class Yahoo_Scraper():
        def __init__(self):
                self.base = 'http://sports.yahoo.com'
                self.all_players_path = '/mlb/players?type=position&c=MLB&pos=ALL'

        def url_to_soup(self, url):
                r = requests.get(url)
                data = r.text
                return BeautifulSoup(data)

        def scrape_all_players_table(self):
                soup = self.url_to_soup(self.base + self.all_players_path)          

if __name__ == '__main__':
        scraper = Yahoo_Scraper()
        scraper.scrape_all_players_table()

