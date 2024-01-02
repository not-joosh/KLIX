'''         IMPORTS         '''
import time
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

# We will make another function that will take in an array of company objects, and we will return an array of stats
# of every company
@app.route("/stats", methods=["POST"])
def get_company_stats_array():
    scraper = SP500_Scraper()
    scraper.scrape()
    
    start_time = time.time()
    stats_list = scraper.test_wiki_stats()
    end_time = time.time()
    
    elapsed_time = end_time - start_time
    print(f"Elapsed time for test_wiki_stats: {elapsed_time} seconds")
    print("Validation Final Output: ", stats_list[-1])
    print("Done!")
    response = jsonify(stats_list)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return jsonify(stats_list)

if __name__ == "__main__":
    app.run()  # Specify the port here
