import requests
from bs4 import BeautifulSoup
import time
import multiprocessing
import time
import multiprocessing

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
        # print("\n\tURL: ", url, "\n")
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        try:
            page_watchers = soup.find("td", string="Number of page watchers").find_next_sibling("td").text.strip()
            page_watchers = ''.join(filter(str.isdigit, page_watchers))
            if page_watchers:
                page_watchers = int(page_watchers)
            else:
                page_watchers = 0 
        except AttributeError:
            page_watchers = "N/A"
        try:
            recent_edit_watchers = soup.find("td", string="Number of page watchers who visited recent edits").find_next_sibling("td").text.strip()
            recent_edit_watchers = ''.join(filter(str.isdigit, recent_edit_watchers))
            if recent_edit_watchers:
                recent_edit_watchers = int(recent_edit_watchers.replace(",", ""))
            else:
                recent_edit_watchers = 0
        except AttributeError:
            recent_edit_watchers = "N/A"
        try:
            redirects = soup.find("td", string="Number of redirects to this page").find_next_sibling("td").text.strip()
            redirects = ''.join(filter(str.isdigit, redirects))
            if redirects:
                redirects = int(redirects.replace(",", ""))
            else:
                redirects = 0
        except AttributeError:
            redirects = "N/A"
        try:
            page_image = soup.find("td", string="Page image").find_next_sibling("td").text.strip()
        except AttributeError:
            page_image = "N/A"
        try:
            page_views = soup.find("td", string="Page views in the past 30 days").find_next_sibling("td").text.strip()
            page_views = ''.join(filter(str.isdigit, page_views))
            # We need to check if page_views is empty string or still has digit, if it has a digit, then we save that
            # digit, if its empty, then we set it to 0
            if page_views:
                page_views = int(page_views.replace(",", ""))
            else:
                page_views = 0
        except AttributeError:
            page_views = "N/A"
        result = {
            "company_name": company_name,
            "page_watchers": page_watchers,
            "recent_edit_watchers": recent_edit_watchers,
            "number_of_redirects": redirects,
            "page_image": page_image,
            "page_views_in_the_past_30_days": page_views
        }
        print(company_name, "Has been Processed...")
        # print(result)
        return result
        

    def test_wiki_stats(self):
        scraper = SP500_Scraper()
        scraper.scrape()
        pool = multiprocessing.Pool(processes=40)  # Set the number of processes
        results = []
        successful_processes = 0
        companies = scraper.SP500_list.copy()
        wait_event = multiprocessing.Event()
        while companies:
            batch = companies[:]
            companies = []
            batch_results = [pool.apply_async(scraper.get_wiki_stats, (company['Company_Name'],)) for company in batch]
            results.extend([result.get() for result in batch_results])
            successful_processes += len(batch_results)
            wait_event.wait(timeout=3)  # Wait for 3 seconds between batches
            wait_event.clear()
        pool.close()
        pool.join()
        print(f"\n\n\n\nNumber of successful processes: {successful_processes}")
        print(results.__len__() == scraper.SP500_list.__len__())
        # print(results)
        print("Done!")
        return results

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
# if __name__ == "__main__":
#     scraper = SP500_Scraper()
#     scraper.scrape()
    
#     start_time = time.time()
#     test = scraper.test_wiki_stats()
#     end_time = time.time()
    
#     elapsed_time = end_time - start_time
#     print(f"Elapsed time for test_wiki_stats: {elapsed_time} seconds")
#     print("Final Output: ", test[-1])
