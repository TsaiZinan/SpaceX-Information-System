import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

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

import { LatestLaunch, Cores, AllLaunches, LandingPads, DemoLaunch } from './data'

import TimelinePage from './components/timelinePage/TimelinePage';


function App() {
  document.title = "SpaceX Information System";

  useEffect(() => {
    fetchAllLaunchData();
    console.log('Effect')
  }, [])

  const [allLaunchesData, setAllLaunchesData] = useState([{
    links: {
      patch: {},
    },
  }]);

  const fetchAllLaunchData = async () => {
    const data = await fetch(
      'https://api.spacexdata.com/v4/launches'
    );
    const allLaunchesData = await data.json();
    console.log('Fetch')
    setAllLaunchesData(allLaunchesData)
  }


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
              <LaunchDetailPage {...props} launches={AllLaunches} cores={Cores} landingPads={LandingPads} demo={DemoLaunch}/>
            )}
          />
          {/* <Route path='/launch/:number' element={<LaunchDetailPage />} /> */}


          <Route path='/timeline' exact component={TimelinePage} />

        </Switch>

        {allLaunchesData.map((launch, index) => {
          return (
            <div>
              <p>{launch.name}</p>
              <p>{launch.links.patch.small}</p>
            </div>
          )
        })}
      </div>
    </Router>

  );
}

export default App;
