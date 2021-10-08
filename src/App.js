import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import Nav from './components/nav/Nav';
import Home from './Home';
import Launches from './Launches';
import CoresPage from './CoresPage';
import LaunchDetailPage from './components/launchDetailPage/LaunchDetailPage';
import FilterTest from './components/filterTest/FilterTest';

import { LatestLaunch, Cores, AllLaunches } from './data'

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />

        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/launches' exact component={Launches} />
          <Route path='/cores' exact component={CoresPage} />
          <Route path='/filter' exact component={FilterTest} />
          <Route
            path='/launch/:number' 
            render={(props) => (
              <LaunchDetailPage {...props} launches={AllLaunches} cores={Cores} />
            )}
          />
          {/* <Route path='/launch/:number' element={<LaunchDetailPage />} /> */}
        </Switch>

      </div>
    </Router>

  );
}

export default App;
