import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import Nav from './components/nav/Nav';
import Home from './Home';
import Launches from './Launches';
import CoresPage from './CoresPage';

import LaunchDetailPage from './components/launchDetailPage/LaunchDetailPage';
import FilterTest from './components/filterTest/FilterTest';
import TestPage from './TestPage';
import StyleTest from './components/styleTest/StyleTest';
import Chart from './components/chart/Chart';

import { LatestLaunch, Cores, AllLaunches, LandingPads } from './data'

import TimelinePage from './components/timelinePage/TimelinePage';


function App() {
  document.title = "SpaceX Information System";
  return (
    <Router>
      <div className="App">
        <Nav />

        <Switch>
          <Route path='/' exact component={Chart} />
          <Route path='/SpaceX-Information-System' exact component={Chart} />

          <Route path='/launches' exact component={Launches} />
          <Route path='/cores' exact component={CoresPage} />
          <Route path='/filter' exact component={FilterTest} />
          <Route path='/test' exact component={TestPage} />
          <Route path='/style' exact component={StyleTest} />
          <Route path='/chart' exact component={Chart} />
          <Route
            path='/launch/:number' 
            render={(props) => (
              <LaunchDetailPage {...props} launches={AllLaunches} cores={Cores} landingPads={LandingPads}/>
            )}
          />
          {/* <Route path='/launch/:number' element={<LaunchDetailPage />} /> */}


          <Route path='/timeline' exact component={TimelinePage} />

        </Switch>

      </div>
    </Router>

  );
}

export default App;
