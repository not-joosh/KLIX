import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowForwardIcon, LinkIcon, ViewIcon } from '@chakra-ui/icons';
import { auth, db } from '../store/firebase';
import { addDoc, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { usersRef, dataRef } from '../store/firebase';
// interface DataItem {
//   Symbol: string;
//   Company_Name: string;
//   Current_Clicks: string;
//   Assumed_Clicks: string;
//   Old_Clicks: number;
//   wiki_url: string;
//   redirect_url: string;
// };

interface ScrapedItem {
  Company_Name: string;
  Symbol: string;
  redirect_url: string;
  wiki_url: string;
};
interface FetchForDBItem {
    company_name: string;
    page_watchers: number;
    recent_edit_watchers: number;
    number_of_redirects: number;
    page_image: string;
    page_views_in_the_past_30_days: number;
};
interface TableItem {
  Company_Name: string;
  Symbol: string;
  redirect_url: string;
  wiki_url: string;
  Clicks_This_Month: string;
};


export const SimpleTable = () => {
  const [data, setData] = useState<[]>([]);
  const [dataForDatabase, setDataForDatabase] = useState<ScrapedItem[]>([]); // This is the data that will be sent to the database
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [sortOption, setSortOption] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        try {
          // First we will grab the data from the webscrape
          const responseFromScrape = await fetch('http://localhost:5000');
          // Secondly, we will then fetch the new information for the database
          const responseForDatabase = await fetch('http://localhost:5000/stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          const dataFromScrape = await responseFromScrape.json() as ScrapedItem[];
          const dataForDatabase = await responseForDatabase.json() as FetchForDBItem[];

          const querySnapshot = await getDocs(collection(db, 'data'));

          dataForDatabase.forEach(async (companyData, index) => {
            const companyName = companyData.company_name;
            const existingCompanyData = querySnapshot.docs.find((doc) => doc.data().company_name === companyName);
            if (existingCompanyData) {
              // Edge Case 1:
              // Since the company exists, lets see if the current date is already in the database, if it is, then
              // We will just compute the clicks in the day, and then update the document. 
              // If it is not, then we will create a newDataPoint object, and then push it to the DataPoints array.
              /*
              Edge case if the date already exists exists:
              */
              
              // Update existing document
              const docId = existingCompanyData.id;
              const dataPoints = existingCompanyData.data().DataPoints;
              
              const currentDate = new Date().toLocaleDateString();
              const existingDataPoint = dataPoints.find((dataPoint: { Date: string; }) => dataPoint.Date === currentDate);
              if (existingDataPoint) {
                // Calculate Clicks in Day
                const clicksInDay = companyData.page_views_in_the_past_30_days - existingDataPoint.Total_Clicks;
                
                // Update existing data point
                existingDataPoint.Last_Updated = new Date().toLocaleTimeString();
                existingDataPoint.Total_Clicks = companyData.page_views_in_the_past_30_days;
                existingDataPoint.Clicks_in_Day = clicksInDay;
                existingDataPoint.FetchedClicks = companyData.page_views_in_the_past_30_days;
                existingDataPoint.page_watchers = companyData.page_watchers;
                existingDataPoint.recent_edit_watchers = companyData.recent_edit_watchers;
                existingDataPoint.number_of_redirects = companyData.number_of_redirects;
                existingDataPoint.page_image = companyData.page_image;
                existingDataPoint.page_views_in_the_past_30_days = companyData.page_views_in_the_past_30_days;
                existingDataPoint.Symbol = dataFromScrape[index].Symbol;
                existingDataPoint.redirect_url = dataFromScrape[index].redirect_url;
                existingDataPoint.wiki_url = dataFromScrape[index].wiki_url;
                
                await updateDoc(doc(db, 'data', docId), { DataPoints: dataPoints });
              } else {
                // Create new data point
                const newDataPoint = {
                  Year: new Date().getFullYear(),
                  Date: currentDate,
                  Last_Updated: new Date().toLocaleTimeString(),
                  Total_Clicks: companyData.page_views_in_the_past_30_days,
                  Clicks_in_Day: companyData.page_views_in_the_past_30_days,
                  FetchedClicks: companyData.page_views_in_the_past_30_days,
                  page_watchers: companyData.page_watchers,
                  recent_edit_watchers: companyData.recent_edit_watchers,
                  number_of_redirects: companyData.number_of_redirects,
                  page_image: companyData.page_image,
                  page_views_in_the_past_30_days: companyData.page_views_in_the_past_30_days,
                  Symbol: dataFromScrape[index].Symbol,
                  redirect_url: dataFromScrape[index].redirect_url,
                  wiki_url: dataFromScrape[index].wiki_url,
                };
                
                dataPoints.unshift(newDataPoint);
                await updateDoc(doc(db, 'data', docId), { DataPoints: dataPoints });
              }
            } else {
              // Create new document
              const newDocument = {
                company_name: companyName,
                docId: '',
                Monthly_Clicks: 0, // Replace with scraped data
                Clicks_This_Month: '', // Replace with calculation
                DataPoints: [
                  {
                    Year: new Date().getFullYear(),
                    Date: new Date().toLocaleDateString(),
                    Last_Updated: new Date().toLocaleTimeString(),
                    Total_Clicks: companyData.page_views_in_the_past_30_days, // Page Views in the past 30 days
                    Clicks_in_Day: companyData.page_views_in_the_past_30_days, // Replace with calculation
                    FetchedClicks: companyData.page_views_in_the_past_30_days, // Replace with scraped data
                    page_watchers: companyData.page_watchers, // Replace with scraped data
                    recent_edit_watchers: companyData.recent_edit_watchers, // Replace with scraped data
                    number_of_redirects: companyData.number_of_redirects, // Replace with scraped data
                    page_image: companyData.page_image, // Replace with scraped data
                    page_views_in_the_past_30_days: companyData.page_views_in_the_past_30_days, // Replace with scraped data
                    Symbol: dataFromScrape[index].Symbol, // Replace with scraped data
                    redirect_url: dataFromScrape[index].redirect_url, // Replace with scraped data
                    wiki_url: dataFromScrape[index].wiki_url, // Replace with scraped data
                  },
                ],
              };
              const newDocRef = doc(collection(db, 'data'));
              newDocument.docId = newDocRef.id;
              await setDoc(newDocRef, newDocument);
            }
          });
        } catch (error) {
          console.error(error);
          // Edge Case 2:
          // The date already exists, but it seems that this is the first datapoint, there is no previous day.
          // In this case, the forumla for clicks in the day will 
        }
        // We want to create  a new document, rather then setting the data. This will be stored under the
        // collection export const dataRef = collection(db, 'data');
        // There is only one of this document that exists in here, so we will make sure just to update it .
        //the data ref looks like this:
        /*
        
            For Each 
        */
        setIsDataLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };
    const userID = auth.currentUser?.uid || localStorage.getItem("userID") || "";
    if(!userID) return
    else {
      // We will first verify whether or not it has been 24 hours since the user has last
      // fetched data, this we can get using onSnapshot. Then we can make a function
      // That will compare the time stamp retrieved. If it has been 24 hours, then we will
      // make an API call to the backend to fetch the data. If it has not been 24 hours,then we will
      // go ahead and fetch the data from the database.
      // We just need to use the userID to find the user's document in the database.
      // fetchTimeStamp: null,
      // hasFetchedToday: false,
      const unsubscribe = onSnapshot(query(usersRef, where("id", "==", userID)), (snap) => {
        const data = snap.docs[0].data();
        // const fetchTimeStamp = data.fetchTimeStamp
        console.log(data)
        const hasFetchedToday = data.hasFetchedToday
        // const today = new Date()
        // const todayTimeStamp = today.getTime()
        if(!hasFetchedToday) {
          fetchData()

        } else {

        };
      });

      return () => unsubscribe();
    }
  }, []);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const sortData = () => {
    if (sortOption === 'leastAssumedClicks') {
      // setData([...data].sort((a, b) => parseInt(a.Assumed_Clicks) - parseInt(b.Assumed_Clicks)));
    } else if (sortOption === 'mostAssumedClicks') {
      // setData([...data].sort((a, b) => parseInt(b.Assumed_Clicks) - parseInt(a.Assumed_Clicks)));
    }
  };

  useEffect(() => {
    sortData();
  }, [sortOption]);

  return (
    <AnimatePresence>
      <div className="p-4">
        <div className="max-h-96 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: isDataLoaded ? 1 : 0, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="mb-4 items-center justify-center flex">
              <label htmlFor="sortOption" className="mr-2 font-bold">SORT BY</label>
            <select
                id="sortOption"
                value={sortOption}
                onChange={handleSortChange}
                className="cursor-pointer px-2 py-1 border border-gray-300 rounded-md shadow-md"
                style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)" }}
            >
                <option
                    value="leastAssumedClicks"
                    className="cursor-pointer"
                    style={{
                        cursor: "pointer",
                        transition: "color 0.3s",
                        color: "white",
                        backgroundColor: "black"
                    }}
                >
                    Least Assumed Clicks
                </option>
                <option
                    value="mostAssumedClicks"
                    className="cursor-pointer"
                    style={{
                        cursor: "pointer",
                        transition: "color 0.3s",
                        color: "white",
                        backgroundColor: "black"
                    }}
                >
                    Most Assumed Clicks
                </option>
            </select>
            </div>
            {isDataLoaded && (
              // <Table variant="simple">
              //   <Thead className="sticky top-0 bg-slate-950 text-white !important" style = {{zIndex: "1"}}>
              //     <Tr>
              //       <Th className="text-white !important" style={{color: "white"}}>Index</Th>
              //       <Th className="text-white !important" style={{color: "white"}}>Symbol</Th>
              //       <Th className="text-white !important" style={{color: "white"}}>Company Name</Th>
              //       <Th className="text-white !important" style={{color: "white"}}>Assumed Clicks</Th>
              //       <Th className="text-white !important" style={{color: "white"}}>KLIX STAT REVIEW</Th>
              //       {/* Add more table headers as needed */}
              //     </Tr>
              //   </Thead>
              //   <Tbody>
              //     {data.map((item, index) => (
              //       <Tr key={index}>
              //         <Td style = {{fontWeight: "bold"}}>{index + 1}</Td>
              //         <Td>
              //           <a href={item.redirect_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#6495ED" }}>
              //             {item.Symbol}
              //           </a>
              //         </Td>
              //         <Td style={{ textDecoration: "underline", color: "#6495ED" }}>
              //           <a href={item.wiki_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#6495ED" }}>
              //             {item.Company_Name}
              //           </a>
              //         </Td>
              //         <Td>{item.Assumed_Clicks}</Td>
              //         <Td
              //           onClick={() => {
              //             navigate(`/company-stats/${item.Symbol}`);
              //           }}
              //           style={{
              //             textDecoration: "underline",
              //             color: "blue",
              //             cursor: "pointer",
              //           }}
              //           className="hover:text-red-500"
              //         >
              //           View Company Stats <ViewIcon />
              //         </Td>
              //       </Tr>
              //     ))}
              //   </Tbody>
              // </Table>
              <div>Hello</div>
            )}
          </motion.div>
          {/* BEGIN: ed8c6549bwf9 */}
          {!isDataLoaded && (
            <motion.p
                className="font-bold text-stone-900 text-center justify-center items-center flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Fetching Data . . .
            </motion.p>
        )}
        {/* END: ed8c6549bwf9 */}
        </div>
      </div>
    </AnimatePresence>
  );
};

/*NOTES FOR LATER:
so i only want to make one webscrape once. Then I want to create a new collection in firebase. I just want the users to initiate the API call once per day. Then they just pull from the data base instead of making an API call. Then on the next day, (on the correct schedule exactly 24 hours after their last attempt), we will make another API call. 
*/