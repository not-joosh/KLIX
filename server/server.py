'''         IMPORTS         '''
from flask import Flask, jsonify
from scripts.scrape import SP500_Scraper

'''     FLASK PY BACKEND    '''
app = Flask(__name__)

@app.route("/")
def scrape_wikipedia():
    scraper = SP500_Scraper()
    scraper.scrape()
    return jsonify(scraper.SP500_list)

@app.route("/stats/<company_name>")
def get_company_stats(company_name):
    scraper = SP500_Scraper()
    stats = scraper.get_wiki_stats(company_name)
    return jsonify(stats)
if __name__ == "__main__":
    app.run()
