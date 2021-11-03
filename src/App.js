import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import './App.css';
import Nav from './components/nav/Nav';
import Home from './Home';
import Launches from './Launches';
import CoresPage from './CoresPage';
import AllCores from './components/allCores/AllCores';

import Test from './components/Test'

import LaunchDetailPage from './components/launchDetailPage/LaunchDetailPage';
import FilterTest from './components/filterTest/FilterTest';
import TestPage from './TestPage';
import StyleTest from './components/styleTest/StyleTest';
import Chart from './components/chart/Chart';

// import { LatestLaunch, Cores, LandingPads, DemoLaunch } from './data'

import TimelinePage from './components/timelinePage/TimelinePage';


function App() {
  document.title = "SpaceX Information System";

  const coresURL = 'https://api.spacexdata.com/v4/cores'
  const launchpadsURL = 'https://api.spacexdata.com/v4/launchpads'
  const latestLaunchURL = 'https://api.spacexdata.com/v4/launches/latest'

  useEffect(() => {
    console.log('Effect');
    fetchAllLaunchData();
    // console.log('AllLaunch Effect');
    fetchAllCoresData();
    // console.log('AllCores Effect');
    fetchAllLaunchpadsData();
    // console.log('AllLaunchpads Effect');
    fetchLatestLaunchData();
    // console.log('LatestLaunch Effect');
  }, [])

  const [allLaunchesData, setAllLaunchesData] = useState([]);

  const fetchAllLaunchData = async () => {
    const data = await fetch(
      'https://api.spacexdata.com/v4/launches'
    );
    const allLaunchesData = await data.json();
    // console.log(allLaunchesData)
    setAllLaunchesData(allLaunchesData)
  }


  const [allCoresData, setAllCoresData] = useState([]);

  const fetchAllCoresData = async () => {
    const data = await fetch(
      coresURL
    );
    const allCoresData = await data.json();
    // console.log(allCoresData)
    setAllCoresData(allCoresData)
  }


  const [allLaunchpadsData, setAllLaunchpadsData] = useState([]);

  const fetchAllLaunchpadsData = async () => {
    const data = await fetch(
      launchpadsURL
    );
    const allLaunchpadsData = await data.json();
    // console.log(allLaunchpadsData)
    setAllLaunchpadsData(allLaunchpadsData)
  }


  const [latestLaunchData, setLatestLaunchData] = useState({});

  const fetchLatestLaunchData = async () => {
    const data = await fetch(
      latestLaunchURL
    );
    const latestLaunchData = await data.json();
    // console.log(latestLaunchData)
    setLatestLaunchData(latestLaunchData)
  }


  return (
    <Router>
      <div className="App">
        <Nav />



        <Switch>
          {/* =========================== Chart Done ==================================== */}
          {/* <Route path='/' exact component={Chart} /> */}
          <Route
            path='/' exact
            render={(props) => (
              <Chart {...props} launches={allLaunchesData} launchpads={allLaunchpadsData} latestLaunch={latestLaunchData} />
            )}
          />

          {/* =========================== Main Page Done ==================================== */}
          {/* <Route path='/SpaceX-Information-System' exact component={Chart} /> */}
          <Route
            path='/SpaceX-Information-System' exact
            render={(props) => (
              <Chart {...props} launches={allLaunchesData} launchpads={allLaunchpadsData} latestLaunch={latestLaunchData} />
            )}
          />

          <Route path='/launches' exact component={Launches} />

          {/* =========================== AllCores Done ==================================== */}
          {/* <Route path='/cores' exact component={CoresPage} /> */}
          <Route
            path='/cores' exact
            render={(props) => (
              <AllCores {...props} launches={allLaunchesData} cores={allCoresData} />
            )}
          />


          {/* =========================== Filter Done ==================================== */}
          {/* <Route path='/filter' exact component={FilterTest} /> */}
          <Route
            path='/filter' exact
            render={(props) => (
              <FilterTest {...props} launches={allLaunchesData} launchpads={allLaunchpadsData} />
            )}
          />









          {/* <Route
            path='/launch/:number'
            render={(props) => (
              <LaunchDetailPage {...props} launches={AllLaunches} cores={Cores} landingPads={LandingPads} demo={DemoLaunch} />
            )}
          /> */}
          {/* <Route path='/launch/:number' element={<LaunchDetailPage />} /> */}

          {/* =========================================================================== */}
          <Route
            path='/t'
            render={(props) => (
              <Test {...props} launches={allLaunchesData} />
            )}
          />
          {/* =========================================================================== */}

          <Route path='/test' exact component={TestPage} />
          <Route path='/style' exact component={StyleTest} />
          <Route path='/timeline' exact component={TimelinePage} />

        </Switch>

        {/* {allLaunchesData.map((launch, index) => {
          return (
            <div>
              <p>{launch.name}</p>
              <p>{launch.links.patch.small}</p>
            </div>
          )
        })} */}
      </div>
    </Router>

  );
}

export default App;
