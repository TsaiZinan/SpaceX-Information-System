import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import './App.css';
import Nav from './components/nav/Nav';
import Footer from './components/footer/Footer';
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
import MainPage from './components/mainPage/MainPage';

// import { LatestLaunch, Cores, LandingPads, DemoLaunch } from './data'

import TimelinePage from './components/timelinePage/TimelinePage';

// import { createBrowserHistory } from "history";
// const history = createBrowserHistory();

function App() {
  document.title = "SpaceX Information System";

  const launchesURL = 'https://api.spacexdata.com/v4/launches'
  const coresURL = 'https://api.spacexdata.com/v4/cores'
  const launchpadsURL = 'https://api.spacexdata.com/v4/launchpads'
  const latestLaunchURL = 'https://api.spacexdata.com/v4/launches/latest'
  const landingpadsURL = 'https://api.spacexdata.com/v4/landpads'

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
    fetchAllLandingpadsData();
    // console.log('AllLandingpads Effect');
  }, [])

  //Fetch allLaunchesData
  const [allLaunchesData, setAllLaunchesData] = useState([]);

  const fetchAllLaunchData = async () => {
    const data = await fetch(
      launchesURL
    );
    const allLaunchesData = await data.json();
    // console.log(allLaunchesData)
    setAllLaunchesData(allLaunchesData)
  }

  //Fetch allCoresData
  const [allCoresData, setAllCoresData] = useState([]);

  const fetchAllCoresData = async () => {
    const data = await fetch(
      coresURL
    );
    const allCoresData = await data.json();
    // console.log(allCoresData)
    setAllCoresData(allCoresData)
  }

  //Fetch allLaunchpadsData
  const [allLaunchpadsData, setAllLaunchpadsData] = useState([]);

  const fetchAllLaunchpadsData = async () => {
    const data = await fetch(
      launchpadsURL
    );
    const allLaunchpadsData = await data.json();
    // console.log(allLaunchpadsData)
    setAllLaunchpadsData(allLaunchpadsData)
  }

  //Fetch latestLaunchData
  const [latestLaunchData, setLatestLaunchData] = useState({});

  const fetchLatestLaunchData = async () => {
    const data = await fetch(
      latestLaunchURL
    );
    const latestLaunchData = await data.json();
    // console.log(latestLaunchData)
    setLatestLaunchData(latestLaunchData)
  }

  //Fetch allLandingpadsData
  const [allLandingpadsData, setAllLandingpadsData] = useState({});

  const fetchAllLandingpadsData = async () => {
    const data = await fetch(
      landingpadsURL
    );
    const allLandingpadsData = await data.json();
    // console.log(allLandingpadsData)
    setAllLandingpadsData(allLandingpadsData)
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
              <MainPage {...props} launches={allLaunchesData} launchpads={allLaunchpadsData} latestLaunch={latestLaunchData} cores={allCoresData} landingPads={allLandingpadsData} />
            )}
          />

          {/* =========================== Main Page Done ==================================== */}
          {/* <Route path='/SpaceX-Information-System' exact component={Chart} /> */}
          <Route
            path='/SpaceX-Information-System' exact
            render={(props) => (
              <MainPage {...props} launches={allLaunchesData} launchpads={allLaunchpadsData} latestLaunch={latestLaunchData} cores={allCoresData} landingPads={allLandingpadsData} />
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







          {/* =========================== Single Launch Page Done ==================================== */}
          {/* <Route path='/launch/:number' element={<LaunchDetailPage />} /> */}
          <Route
            path='/launch/:number'
            render={(props) => (
              <LaunchDetailPage {...props} launches={allLaunchesData} cores={allCoresData} landingPads={allLandingpadsData} />
            )}
          />


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
        <Footer />
      </div>
    </Router>

  );

}

export default App;
