'''         IMPORTS         '''
from flask import Flask, jsonify
from scripts.scrape import SP500_Scraper
from flask_cors import CORS 

'''     FLASK PY BACKEND    '''
app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def scrape_wikipedia():
    scraper = SP500_Scraper()
    scraper.scrape()
    response = jsonify(scraper.SP500_list)
    response.headers.add("Access-Control-Allow-Origin", "*")  # Add this line
    return jsonify(scraper.SP500_list)

@app.route("/stats/<company_name>", methods=["GET"])
def get_company_stats(company_name):
    scraper = SP500_Scraper()
    stats = scraper.get_wiki_stats(company_name)
    response = jsonify(stats)
    response.headers.add("Access-Control-Allow-Origin", "*")  # Add this line
    return jsonify(stats)

if __name__ == "__main__":
    app.run()  # Specify the port here
