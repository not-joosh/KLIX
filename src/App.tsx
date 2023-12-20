/*==========    DEPENDENCIES    ==========*/
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css'


/*==========    ROUTES    ==========*/
import { LANDINGPAGE, HOME, PAGE_NOT_FOUND, SETTINGS } from './store/routes';

/*==========    COMPONENTS    ==========*/
import { Navbar } from './components/Navbar'; 

/*==========    VIEWS    ==========*/
import { LandingPage } from './views/LandingPage';
import { HomePage } from './views/HomePage';
import { ErrorPage } from './views/ErrorPage';
import { SettingsPage } from './views/SettingsPage';
import { DebuggingPage } from './views/DebuggingPage';


const wrapNav = ({ componentIn }: { componentIn: React.ReactElement }) => {
  return (
    <>
      <Navbar />
      {componentIn}
    </>
  );
};

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path = "Testing" element = {<DebuggingPage />} />
          <Route path={LANDINGPAGE} element={<LandingPage />} />
          <Route path={HOME} element={wrapNav({ componentIn: <HomePage /> })} />
          <Route path={HOME + SETTINGS} element={wrapNav({ componentIn: <SettingsPage /> })} />
          <Route path={PAGE_NOT_FOUND} element={<ErrorPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
