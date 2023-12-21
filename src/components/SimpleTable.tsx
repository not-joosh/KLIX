import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowForwardIcon, LinkIcon, ViewIcon } from '@chakra-ui/icons';
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

    fetchData();
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
        <h1 className="text-2xl font-bold mb-4">DebuggingPage</h1>
        <div className="max-h-96 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: isDataLoaded ? 1 : 0, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="mb-4">
              <label htmlFor="sortOption" className="mr-2">Sort By:</label>
              <select id="sortOption" value={sortOption} onChange={handleSortChange} className="px-2 py-1 border border-gray-300 rounded-md">
                <option value="leastAssumedClicks">Least Assumed Clicks</option>
                <option value="mostAssumedClicks">Most Assumed Clicks</option>
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
          {!isDataLoaded && <p>Fetching Data...</p>}
        </div>
      </div>
    </AnimatePresence>
  );
};

/*NOTES FOR LATER:
so i only want to make one webscrape once. Then I want to create a new collection in firebase. I just want the users to initiate the API call once per day. Then they just pull from the data base instead of making an API call. Then on the next day, (on the correct schedule exactly 24 hours after their last attempt), we will make another API call. 
*/