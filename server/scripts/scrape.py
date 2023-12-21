import requests
from bs4 import BeautifulSoup

class SP500_Scraper:
    def __init__(self):
        self.SP500_list = []

    def scrape(self):
        '''
        Task: We need to scrape the entire list of S&P 500 companies from Wikipedia.
        url: https://en.wikipedia.org/wiki/List_of_S%26P_500_companies
        What the the S&P500 Wikipedia page looks like:
        Symbol | Security   | GICS Sector | GICS Sub Industry        | Headquarters Location | Date first added | CIK    | Founded
        MMM    | 3M         | Industrials | Industrial Conglomerates | St. Paul, Minnesota   | 1976-03-04       | 66740  | 1902
        AOS    | A.O. Smith | Industrials | Building Products        | Milwaukee, Wisconsin  | 2017-07-26       | 91142  | 1916
        ...    | ...        | ...         | ...                      | ...                   | ...              | ...    | ...
        '''
        # URL of the Wikipedia page to scrape
        url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
        # Send a GET request to the URL
        response = requests.get(url)
        # Create a BeautifulSoup object to parse the HTML content
        soup = BeautifulSoup(response.content, "html.parser")
        # Find the table containing the company information
        table = soup.find("table", class_="wikitable sortable")
        # Find all rows in the table
        rows = table.find_all("tr")
        for row in rows[1:]:
            columns = row.find_all("td")
            symbol = columns[0].text.strip()
            company_name = columns[1].text.strip()
            cik_number = columns[7].text.strip().split()[0]  # Extract only the numeric part
            security_url = columns[1].find("a")["href"]  # Extract the URL from the company name column
            redirect_url = columns[0].find("a")["href"]  # Extract the URL from the symbol column
            self.SP500_list.append({
                "Symbol": symbol,
                "Company_Name": company_name,
                "Assumed_Clicks": cik_number,
                "Old_Clicks": 0,
                "Current_Clicks": 0,
                "wiki_url": "https://en.wikipedia.org" + security_url,
                "redirect_url": redirect_url
            })
    
    def get_wiki_stats(self, company_name):
        if not self.SP500_list:
            self.scrape()
        '''
        Task: Now that we have the company (which is inside the SP500_list. We are assuming the user will pass in the correct company_name. its a good idea to 
        use a try and catch to prevent errors), we will need to look at a specific link and grab specific things:
        Number of page watchers, Number of page watchers who visited recent edits, number of redirects to "this page", Page Image, Page views in the past 30 days

        But to do that, we need to scrape a specific url based on the company's name. For example, 3M:
        Company name : 3M
        https://en.wikipedia.org/w/index.php?title=3M&action=info
        Company name : A.O. Smith
        https://en.wikipedia.org/w/index.php?title=A._O._Smith&action=info
        Company name : Abbott Laboratories
        https://en.wikipedia.org/w/index.php?title=Abbott_Laboratories&action=info
        '''
        # Prepare the URL based on the company's name
        url = f"https://en.wikipedia.org/w/index.php?title={company_name.replace(' ', '_')}&action=info"
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        page_watchers = soup.find("td", string="Number of page watchers").find_next_sibling("td").text.strip()
        recent_edit_watchers = soup.find("td", string="Number of page watchers who visited recent edits").find_next_sibling("td").text.strip()
        redirects = soup.find("td", string="Number of redirects to this page").find_next_sibling("td").text.strip()
        page_image = soup.find("td", string="Page image").find_next_sibling("td").text.strip()
        page_views = soup.find("td", string="Page views in the past 30 days").find_next_sibling("td").text.strip()
        return {
            "Number_of_page watchers": int(page_watchers.replace(',', '')),
            "Number_of_page watchers who visited recent edits": int(recent_edit_watchers.replace(',', '')),
            "Number_of_redirects to this page": int(redirects.replace(',', '')),
            "Page_image": page_image,
            "Page_views_in_the_past_30_days": int(page_views.replace(',', ''))
        }
    
    def test_wiki_stats():
        scraper = SP500_Scraper()
        scraper.scrape()
        company_name = input("Enter a company name from the S&P 500: ")
        stats = scraper.get_wiki_stats(company_name)
        print(f"Stats for {company_name}:")
        print(f"Number of page watchers: {stats['Number_of_page watchers']}")
        print(f"Number of page watchers who visited recent edits: {stats['Number_of_page watchers who visited recent edits']}")
        print(f"Number of redirects to this page: {stats['Number_of_redirects to this page']}")
        print(f"Page image: {stats['Page_image']}")
        print(f"Page views in the past 30 days: {stats['Page_views_in_the_past_30_days']}")
        print("Done!")

    def test_scraping(self):
        print("Testing scraping...")
        for company in self.SP500_list:
            print(f"\"Symbol\": {company['Symbol']},")
            print(f"\"Company_Name\": {company['Company_Name']},")
            print(f"\"Assumed_Clicks\": {company['Assumed_Clicks']},")
            print(f"\"Old_Clicks\": {company['Old_Clicks']},")
            print(f"\"Current_Clicks\": {company['Current_Clicks']},")
            print(f"\"wiki_url\": \"{company['wiki_url']}\"")
            print(f"\"redirect_url\": \"{company['redirect_url']}\"")
            print("})")
            
        print("Done!")
if __name__ == "__main__":
    scraper = SP500_Scraper()
    scraper.scrape()
    scraper.test_scraping()
