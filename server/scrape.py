import requests
from bs4 import BeautifulSoup

# URL of the Wikipedia page to scrape
url = "https://en.wikipedia.org/wiki/Web_scraping"

# Send a GET request to the URL
response = requests.get(url)

# Create a BeautifulSoup object to parse the HTML content
soup = BeautifulSoup(response.content, "html.parser")

# Find and print the title of the Wikipedia page
title = soup.find("h1", id="firstHeading").text
print("Title:", title)

# Find and print the first paragraph of the Wikipedia page
first_paragraph = soup.find("div", class_="mw-parser-output").p.text
print("First Paragraph:", first_paragraph)




# import requests
# from bs4 import BeautifulSoup
# from flask import Flask
# app = Flask(__name__)

# @app.route("/")
# def scrape_wikipedia():
#     # URL of the Wikipedia page to scrape
#     url = "https://en.wikipedia.org/wiki/Web_scraping"

#     # Send a GET request to the URL
#     response = requests.get(url)

#     # Create a BeautifulSoup object to parse the HTML content
#     soup = BeautifulSoup(response.content, "html.parser")

#     # Find and print the title of the Wikipedia page
#     title = soup.find("h1", id="firstHeading").text
#     print("Title:", title)

#     # Find and print the first paragraph of the Wikipedia page
#     first_paragraph = soup.find("div", class_="mw-parser-output").p.text
#     print("First Paragraph:", first_paragraph)

#     return "Scraping completed!"

# if __name__ == "__main__":
#     app.run()
