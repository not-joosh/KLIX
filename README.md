# Clickonomics

## Functional Requirements:
- Data Gathering:
  - Retrieve a list of all S&P 500 companies.
  - Access page visit data for each company's Wikipedia page.
  - Store the data in a structured format (e.g., database).
- Data Processing:
  - Calculate the average page visit for all companies over a specific period (e.g., year).
  - Identify individual company page visits exceeding the average threshold.
  - Quantify the data, potentially including:
  - Average daily/weekly/monthly page visits.
  - Percentage change in page visits compared to previous periods.
  - Trend analysis of page visits over time.
- Alerting:
  - Send real-time notifications (e.g., email, text message) for companies exceeding the average page visit threshold.
- Presentation:
  - Display the processed data in a user-friendly interface (e.g., dashboard, graph)
  - Allow user to adjust the average visit threshold and other parameters.
- Data Export:
  - Optionally, allow data export to Excel for further analysis.
## Non-Functional Requirements:
- Performance:
  - Data gathering and processing should be efficient and timely.
  - Alerting should be prompt and reliable.
  - User interface should be responsive and intuitive.
- Scalability:
  - The system should be able to handle large amounts of data efficiently.
  - It should be adaptable to potential increases in the number of companies tracked.
- Security:
  - Access to data and alerts should be restricted to authorized users.
  - Sensitive data should be stored securely.
- Maintainability:
  - The code should be well-organized, documented, and easy to understand.
  - Updates and bug fixes should be easy to implement.
- User Friendliness:
  - The user interface should be intuitive and easy to use for non-technical users.
  - Data visualization should be clear and informative.
## Additional Requirements:
  - Consider data sources with historical page visit data for more comprehensive analysis.
  - Incorporate outlier detection and filtering mechanisms to handle finance/economy-related anomalies.
  - Allow for future expansion of functionality, such as sentiment analysis of Wikipedia page content.
## Data Flow Diagram:
1. Fetch S&P 500 company list.
2. Scrape or access Wikipedia page visit data for each company.
3. Store data in a database.
4. Calculate average page visits and thresholds.
5. Monitor page visits in real-time.
6. Trigger alerts when visits exceed thresholds.
7. Visualize and present data.
8. Optionally, export data to Excel.


### Documented Inquire
`Kai J — 06/21/2022 12:10 PM`
```bat
essentially most public traded companies have wiki pages and you can view page visits 
for each of those wikipedia pages. so essentially this is where the coding comes in, 
you will compile a list of all the wiki pages of the companies that are in the sp500 which is 500 companies, 
then you will make a code (this is the part where you will make the code and tell it what to do because 
i have no idea what type of code you will need) you will need to create a bot that can catergorize all the page 
visits of those 500 companies and quantify the data, so that it would show me differences for example we can 
set a base average visits and then whenever a certain company gets above a certain amount of visits (above average) 
it will notify you and me, and from intial findings most companies that have received higher than average page 
visits in the past year have gone mostly up. let me know if this is something you can do, this is great 
oppurtunity not only for me when I apply to Investment banking jobs, but also you if you didnt want to work 
in the software/tech industry you can take this and go to Quant hedge funds. I think either way even if 
we don't invest in the companies ourselves it would look great in both our portfolios.
(there might even be room to make excel coded sheets on my end in case you can't get the bot to look user 
friendly. And don't think it would just be you working on it.  I would help the most that I can possibly can, 
for example in the code their might be certain outliers that are finance or economical related and I can take 
a look and decide if those outliers provide any meaningful data. please let me know if you can do this, 
I know you are busy with school, but I do know if you want to land a sofrware engineer job you have 
to have a website with all your projects
```

### Progress
Nowhere near done, just started `12/18/2023`
