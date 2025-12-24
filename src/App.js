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
import BoostersStatus from './components/boosters/BoostersStatus';
import SitesPage from './components/sitesPage/SitesPage';

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
  const newApiURL = 'https://cdn.jsdelivr.net/gh/TsaiZinan/ll2-DATA@main/spacex/spacex-previous-launches-simple.json'

  useEffect(() => {
    console.log('Effect');
    // fetchAllLaunchData();
    // fetchAllCoresData();
    fetchAllLaunchpadsData();
    fetchLatestLaunchData();
    fetchAllLandingpadsData();
    fetchNewApiData();
  }, [])

  //Fetch allLaunchesData
  const [allLaunchesData, setAllLaunchesData] = useState([]);

  const fetchNewApiData = async () => {
    try {
      const response = await fetch(newApiURL);
      const data = await response.json();
      const rawLaunches = data.launches;
      const spacexLaunchesResponse = await fetch(launchesURL);
      const spacexLaunches = await spacexLaunchesResponse.json();

      const isStarshipSerial = (serial) => {
        if (!serial) {
          return false;
        }
        return serial.startsWith('SN') || serial === 'Starhopper' || serial.startsWith('Booster');
      };

      const normalizeLaunchName = (name) => {
        const raw = String(name || '');
        const afterPipe = raw.includes('|') ? raw.split('|').pop() : raw;
        return afterPipe.toLowerCase().replace(/[^a-z0-9]+/g, '');
      };

      const spacexLaunchesWithTime = (Array.isArray(spacexLaunches) ? spacexLaunches : [])
        .filter(launch => launch && launch.date_utc)
        .map(launch => ({
          ...launch,
          _time: new Date(launch.date_utc).getTime(),
          _nameKey: normalizeLaunchName(launch.name)
        }))
        .sort((a, b) => a._time - b._time);

      const spacexLaunchesByName = {};
      spacexLaunchesWithTime.forEach(launch => {
        const key = launch._nameKey;
        if (!spacexLaunchesByName[key]) spacexLaunchesByName[key] = [];
        spacexLaunchesByName[key].push(launch);
      });

      const findClosestSpacexLaunchByTime = (targetTime) => {
        if (!spacexLaunchesWithTime.length) return null;

        let left = 0;
        let right = spacexLaunchesWithTime.length - 1;

        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          const midTime = spacexLaunchesWithTime[mid]._time;

          if (midTime === targetTime) return spacexLaunchesWithTime[mid];
          if (midTime < targetTime) left = mid + 1;
          else right = mid - 1;
        }

        const candidates = [];
        if (left < spacexLaunchesWithTime.length) candidates.push(spacexLaunchesWithTime[left]);
        if (left - 1 >= 0) candidates.push(spacexLaunchesWithTime[left - 1]);

        if (!candidates.length) return null;

        let best = candidates[0];
        let bestDiff = Math.abs(best._time - targetTime);
        for (let i = 1; i < candidates.length; i++) {
          const diff = Math.abs(candidates[i]._time - targetTime);
          if (diff < bestDiff) {
            best = candidates[i];
            bestDiff = diff;
          }
        }

        return best;
      };

      const findLaunchpadId = (rawLaunch) => {
        const targetTime = new Date(rawLaunch.net).getTime();
        const nameKey = normalizeLaunchName(rawLaunch.name);
        const maxDiffMs = 36 * 60 * 60 * 1000;

        const namedCandidates = spacexLaunchesByName[nameKey];
        if (Array.isArray(namedCandidates) && namedCandidates.length) {
          let best = namedCandidates[0];
          let bestDiff = Math.abs(best._time - targetTime);
          for (let i = 1; i < namedCandidates.length; i++) {
            const diff = Math.abs(namedCandidates[i]._time - targetTime);
            if (diff < bestDiff) {
              best = namedCandidates[i];
              bestDiff = diff;
            }
          }

          if (bestDiff <= maxDiffMs && best.launchpad) return best.launchpad;
        }

        const closest = findClosestSpacexLaunchByTime(targetTime);
        if (closest && Math.abs(closest._time - targetTime) <= maxDiffMs && closest.launchpad) {
          return closest.launchpad;
        }

        return 'Unknown';
      };

      const sortedRawLaunches = [...rawLaunches].sort((a, b) => new Date(a.net) - new Date(b.net));
      const nonStarshipIds = [];

      sortedRawLaunches.forEach(launch => {
        const coreInfo = (launch.rocket && launch.rocket.launcher_stage && launch.rocket.launcher_stage[0]) || {};
        const launcher = coreInfo.launcher || {};
        const serial = launcher.serial_number || '';

        if (!isStarshipSerial(serial)) {
          nonStarshipIds.push(launch.id);
        }
      });

      let flightCounter = 1;
      const flightNumberById = {};

      nonStarshipIds.forEach(id => {
        flightNumberById[id] = flightCounter;
        flightCounter = flightCounter + 1;
      });

      const processedLaunches = rawLaunches.map((launch) => {
        const launcherStages = (launch.rocket && launch.rocket.launcher_stage) || [];
        const primaryStage = launcherStages[0] || {};
        const primaryLauncher = primaryStage.launcher || {};
        const primarySerial = primaryLauncher.serial_number;
        const starship = isStarshipSerial(primarySerial || '');
        const description = (launch.mission && launch.mission.description) ? launch.mission.description.toLowerCase() : '';
        const flightNumber = starship ? null : flightNumberById[launch.id];
        const launchpadId = findLaunchpadId(launch);

        const getLandingType = (serialNumberRaw, landing) => {
          const serialNumber = serialNumberRaw || '';
          const location = landing && landing.landing_location ? landing.landing_location : null;
          const abbrev = location && location.abbrev ? String(location.abbrev).toUpperCase() : '';
          const locationName = location && location.name ? location.name.toLowerCase() : '';
          const locationDescription = location && location.description ? location.description.toLowerCase() : '';

          if (abbrev === 'ATL' || abbrev === 'GOM' || abbrev === 'PAC' || locationName.includes('ocean')) {
            return 'Ocean';
          }

          if (abbrev === 'OCISLY' || abbrev === 'JRTI' || abbrev === 'ASOG' || locationName.includes('of course i still love you') || locationName.includes('just read the instructions') || locationName.includes('shortfall of gravitas') || locationDescription.includes('drone ship') || locationDescription.includes('droneship') || locationDescription.includes('asds')) {
            return 'ASDS';
          }

          if (abbrev === 'LZ' || abbrev === 'LZ-1' || abbrev === 'LZ-2' || abbrev === 'LZ-4' || abbrev === 'OLM-A' || locationName.includes('landing zone')) {
            return 'RTLS';
          }

          if (serialNumber.startsWith('SN') || serialNumber === 'Starhopper') {
            return 'RTLS';
          }
          if (serialNumber.startsWith('Booster')) {
            if (description.includes('catch') || description.includes('tower')) return 'RTLS';
            return 'Ocean';
          }

          if (description.includes('ocean') || description.includes('splashdown')) {
            return 'Ocean';
          }
          if (description.includes('land at') || description.includes('return to launch site') || description.includes('rtls') || description.includes('landing zone')) {
            return 'RTLS';
          }
          if (description.includes('drone ship') || description.includes('droneship') || description.includes('asds')) {
            return 'ASDS';
          }

          return 'ASDS';
        };

        const overrideLandingData = (input) => {
          if (!flightNumber) return input;

          if (flightNumber === 1 || flightNumber === 2 || flightNumber === 24) {
            return { ...input, landing_attempt: false, landing_success: null };
          }

          if (flightNumber === 11) {
            return { ...input, landing_attempt: true, landing_success: false };
          }

          if (flightNumber === 14 || flightNumber === 15 || flightNumber === 20) {
            return { ...input, landing_attempt: true, landing_success: null };
          }

          return input;
        };

        const coresArray = launcherStages.map((stage) => {
          const landing = stage.landing || {};
          const launcher = stage.launcher || {};
          const serial = launcher.serial_number || '';
          const location = landing && landing.landing_location ? landing.landing_location.name : 'Unknown';

          return overrideLandingData({
            core: serial,
            landing_attempt: landing.attempt,
            landing_success: landing.success,
            landing_type: getLandingType(serial, landing),
            landing_location: location,
            reused: stage.reused,
            flight: stage.launcher_flight_number
          });
        });

        let patchUrl = null;
        if (Array.isArray(launch.mission_patches) && launch.mission_patches.length > 0) {
          const primaryPatch = launch.mission_patches[0];
          if (primaryPatch) {
            if (primaryPatch.image_url) {
              patchUrl = primaryPatch.image_url;
            } else if (primaryPatch.image && primaryPatch.image.image_url) {
              patchUrl = primaryPatch.image.image_url;
            }
          }
        }

        if (!patchUrl) {
          const launcherImage = primaryLauncher.image;
          if (launcherImage && launcherImage.image_url) {
            patchUrl = launcherImage.image_url;
          } else if (typeof launcherImage === 'string') {
            patchUrl = launcherImage;
          }
        }

        if (!patchUrl) {
          patchUrl = 'https://images2.imgbox.com/3c/0e/T8iJcSN3_o.png';
        }

        return {
          id: launch.id,
          flight_number: flightNumber,
          name: launch.name,
          date_local: launch.net,
          date_utc: launch.net,
          upcoming: new Date(launch.net) > new Date(),
          success: launch.status ? (launch.status.name === 'Launch Successful' || launch.status.abbrev === 'Success') : false,
          links: {
            patch: {
              small: patchUrl
            },
            webcast: null,
            wikipedia: null,
            reddit: { launch: null }
          },
          cores: coresArray,
          launchpad: launchpadId,
          details: launch.mission ? launch.mission.description : ''
        };
      });

      const coresMap = {};
      const sortedLaunches = [...processedLaunches].sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));

      sortedLaunches.forEach(launch => {
        (launch.cores || []).forEach(core => {
          const serial = core.core;
          const landingSuccess = core.landing_success;

          if (serial) {
            if (!coresMap[serial]) {
              coresMap[serial] = {
                serial: serial,
                status: 'unknown',
                launches: []
              };
            }

            if (!coresMap[serial].launches.includes(launch.id)) {
              coresMap[serial].launches.push(launch.id);
            }

            if (landingSuccess === false) {
              coresMap[serial].status = 'lost';
            } else {
              const launchDate = new Date(launch.date_utc);
              const oneYearAgo = new Date();
              oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

              if (launchDate > oneYearAgo) {
                coresMap[serial].status = 'active';
              } else if (coresMap[serial].status !== 'lost') {
                coresMap[serial].status = 'inactive';
              }
            }
          }
        });
      });
      
      const processedCores = Object.values(coresMap);

      setAllLaunchesData(processedLaunches);
      setAllCoresData(processedCores);

    } catch (error) {
      console.error("Failed to fetch new API", error);
    }
  }

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
            path='/boosters' exact
            render={(props) => (
              <BoostersStatus {...props} launches={allLaunchesData} launchpads={allLaunchpadsData} latestLaunch={latestLaunchData} cores={allCoresData} landingPads={allLandingpadsData} />
            )}
          />

          <Route
            path='/sites' exact
            render={(props) => (
              <SitesPage {...props} launches={allLaunchesData} launchpads={allLaunchpadsData} />
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
