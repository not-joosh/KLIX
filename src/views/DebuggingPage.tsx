import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

interface DataItem {
  Symbol: string;
  Company_Name: string;
  Current_Clicks: string;
  Assumed_Clicks: string;
  Old_Clicks: number;
  // Add more properties as needed
}

export const DebuggingPage = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [sortOption, setSortOption] = useState('');

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
            initial={{ opacity: 0 }}
            animate={{ opacity: isDataLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-4">
              <label htmlFor="sortOption" className="mr-2">Sort By:</label>
              <select id="sortOption" value={sortOption} onChange={handleSortChange}>
                <option value="leastAssumedClicks">Least Assumed Clicks</option>
                <option value="mostAssumedClicks">Most Assumed Clicks</option>
              </select>
            </div>
            <Table variant="striped">
              <Thead className="sticky top-0 z-10 bg-slate-600 text-white !important">
                <Tr>
                  <Th className="text-white !important" style={{color: "white"}}>Symbol</Th>
                  <Th className="text-white !important" style={{color: "white"}}>Company Name</Th>
                  <Th className="text-white !important" style={{color: "white"}}>Assumed Clicks</Th>
                  {/* Add more table headers as needed */}
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.Symbol}</Td>
                    <Td>{item.Company_Name}</Td>
                    <Td>{item.Assumed_Clicks}</Td>
                    {/* Add more table cells as needed */}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
