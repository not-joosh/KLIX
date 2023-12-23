import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowForwardIcon, LinkIcon, ViewIcon } from '@chakra-ui/icons';
import { auth, db } from '../store/firebase';
import { onSnapshot, query, where } from 'firebase/firestore';
interface DataItem {
  Symbol: string;
  Company_Name: string;
  Current_Clicks: string;
  Assumed_Clicks: string;
  Old_Clicks: number;
  wiki_url: string;
  redirect_url: string;
};

export const SimpleTable = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [sortOption, setSortOption] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000');
        const data = await response.json();
        console.log(data)
        setData(data);
        
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

    //   const unsubscribe = onSnapshot(query(db, "users", where("userID", "==", userID)), (snapshot) => {
    //     snapshot.forEach((doc) => {
    //       const data = doc.data()
    //       if
    //       const fetchTimeStamp = data.fetchTimeStamp
    //       const hasFetchedToday = data.hasFetchedToday
    //       const today = new Date()
    //       const todayTimeStamp = today.getTime()
    //       if(!hasFetchedToday) {

    //         fetchData()


      fetchData();
    // }
    }
  }, []);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const sortData = () => {
    if (sortOption === 'leastAssumedClicks') {
      setData([...data].sort((a, b) => parseInt(a.Assumed_Clicks) - parseInt(b.Assumed_Clicks)));
    } else if (sortOption === 'mostAssumedClicks') {
      setData([...data].sort((a, b) => parseInt(b.Assumed_Clicks) - parseInt(a.Assumed_Clicks)));
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
              <Table variant="simple">
                <Thead className="sticky top-0 bg-slate-950 text-white !important" style = {{zIndex: "1"}}>
                  <Tr>
                    <Th className="text-white !important" style={{color: "white"}}>Index</Th>
                    <Th className="text-white !important" style={{color: "white"}}>Symbol</Th>
                    <Th className="text-white !important" style={{color: "white"}}>Company Name</Th>
                    <Th className="text-white !important" style={{color: "white"}}>Assumed Clicks</Th>
                    <Th className="text-white !important" style={{color: "white"}}>KLIX STAT REVIEW</Th>
                    {/* Add more table headers as needed */}
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((item, index) => (
                    <Tr key={index}>
                      <Td style = {{fontWeight: "bold"}}>{index + 1}</Td>
                      <Td>
                        <a href={item.redirect_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#6495ED" }}>
                          {item.Symbol}
                        </a>
                      </Td>
                      <Td style={{ textDecoration: "underline", color: "#6495ED" }}>
                        <a href={item.wiki_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#6495ED" }}>
                          {item.Company_Name}
                        </a>
                      </Td>
                      <Td>{item.Assumed_Clicks}</Td>
                      <Td
                        onClick={() => {
                          navigate(`/company-stats/${item.Symbol}`);
                        }}
                        style={{
                          textDecoration: "underline",
                          color: "blue",
                          cursor: "pointer",
                        }}
                        className="hover:text-red-500"
                      >
                        View Company Stats <ViewIcon />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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