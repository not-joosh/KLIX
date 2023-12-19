/*==========    DEPENDENCIES    ==========*/
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'


/*==========    ROUTES    ==========*/
import { LANDINGPAGE, HOME, PAGE_NOT_FOUND } from './store/routes';

/*==========    COMPONENTS    ==========*/
import { Navbar } from './components/Navbar'; 

/*==========    VIEWS    ==========*/
import { LandingPage } from './views/LandingPage';
import { HomePage } from './views/HomePage';
import { ErrorPage } from './views/ErrorPage';


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
    <Router>
      <Routes>
        <Route path={LANDINGPAGE} element={<LandingPage />} />
        <Route path={HOME} element={wrapNav({ componentIn: <HomePage /> })} />
        <Route path={PAGE_NOT_FOUND} element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
