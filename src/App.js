import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import './App.css';
import { getLaunchMetadata, isStarshipLaunch } from './launchMetadata';
import { loadLaunchRecords } from './launchFeed';
import Nav from './components/nav/Nav';
import Footer from './components/footer/Footer';
import Launches from './Launches';
import AllCores from './components/allCores/AllCores';

import Test from './components/Test'

import LaunchDetailPage from './components/launchDetailPage/LaunchDetailPage';
import FilterTest from './components/filterTest/FilterTest';
import TestPage from './TestPage';
import StyleTest from './components/styleTest/StyleTest';
import MainPage from './components/mainPage/MainPage';
import BoostersStatus from './components/boosters/BoostersStatus';

import { AllLaunches as archivedLaunches, Cores as archivedCores, LandingPads as archivedLandingPads } from './data'

import TimelinePage from './components/timelinePage/TimelinePage';

function App() {
  const [allLaunchesData, setAllLaunchesData] = useState([]);
  const [allCoresData, setAllCoresData] = useState([]);
  const [launchLoadState, setLaunchLoadState] = useState('loading');

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, []);

  async function loadData(signal) {
    try {
      const rawLaunches = await loadLaunchRecords(signal);
      if (signal.aborted) return;

      const sortedRawLaunches = [...rawLaunches].sort((a, b) => new Date(a.net) - new Date(b.net));
      const flightNumberById = new Map();
      sortedRawLaunches.forEach(launch => {
        if (!isStarshipLaunch(launch)) flightNumberById.set(launch.id, flightNumberById.size + 1);
      });

      const processedLaunches = rawLaunches.map((launch) => {
        const launcherStages = (launch.rocket && launch.rocket.launcher_stage) || [];
        const primaryStage = launcherStages[0] || {};
        const primaryLauncher = primaryStage.launcher || {};
        const description = (launch.mission?.description || '').toLowerCase();

        const getLandingType = (serialNumberRaw, landing) => {
          if (landing.attempt === false) return null;
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

          if (/^LZ(?:-\d+)?$/.test(abbrev) || /^OLM-[AB]$/.test(abbrev) || locationName.includes('landing zone') || locationName.includes('starship landing pad')) {
            return 'RTLS';
          }

          if (serialNumber.startsWith('SN') || serialNumber === 'Starhopper') {
            return 'RTLS';
          }
          if (serialNumber.startsWith('Booster') && (description.includes('catch') || description.includes('tower'))) return 'RTLS';

          if (description.includes('ocean') || description.includes('splashdown')) {
            return 'Ocean';
          }
          if (description.includes('drone ship') || description.includes('droneship') || description.includes('asds')) {
            return 'ASDS';
          }
          if (description.includes('return to launch site') || description.includes('rtls') || description.includes('landing zone')) return 'RTLS';

          return 'Unknown';
        };

        const coresArray = launcherStages.map((stage) => {
          const landing = stage.landing || {};
          const launcher = stage.launcher || {};
          const serial = launcher.serial_number || '';
          const location = landing && landing.landing_location ? landing.landing_location.name : 'Unknown';

          return {
            core: serial,
            landing_attempt: landing.attempt,
            landing_success: landing.success,
            landing_type: getLandingType(serial, landing),
            landing_location: location,
            reused: stage.reused,
            flight: stage.launcher_flight_number
          };
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

        const metadata = getLaunchMetadata(launch);
        return {
          ...metadata,
          id: launch.id,
          flight_number: flightNumberById.get(launch.id) ?? null,
          name: launch.name,
          date_local: launch.net,
          date_utc: launch.net,
          upcoming: new Date(launch.net) > new Date(),
          success: metadata.launchOutcome === 'success',
          links: {
            patch: {
              small: patchUrl
            },
            webcast: null,
            wikipedia: null,
            reddit: { launch: null }
          },
          cores: coresArray,
          launchpad: 'Unknown',
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
      setLaunchLoadState('ready');

    } catch (error) {
      if (signal.aborted) return;
      setLaunchLoadState('error');
      console.error("Failed to fetch new API", error);
    }
  }

  return (
    <Router basename={new URL(process.env.PUBLIC_URL || '/', window.location.origin).pathname.replace(/\/$/, '')}>
      <div className="App">
        <Nav />
        <Switch>
          <Route exact path={['/', '/SpaceX-Information-System']}>
            <MainPage launches={allLaunchesData} loadState={launchLoadState} />
          </Route>
          <Route exact path='/filter'>
            <FilterTest launches={allLaunchesData} loadState={launchLoadState} />
          </Route>
          <Route exact path='/boosters'>
            <BoostersStatus launches={allLaunchesData} cores={allCoresData} loadState={launchLoadState} />
          </Route>
          <Route exact path='/launch/archive/:launchKey'
            render={props => <LaunchDetailPage {...props} archived launches={archivedLaunches} cores={archivedCores} landingPads={archivedLandingPads} />}
          />
          <Route exact path='/launch/:launchKey'
            render={props => <LaunchDetailPage {...props} launches={allLaunchesData} loadState={launchLoadState} />}
          />
          <Route exact path='/cores'>
            <AllCores launches={allLaunchesData} cores={allCoresData} loadState={launchLoadState} />
          </Route>
          <Route exact path='/launches' component={Launches} />
          <Route exact path='/t'>
            <Test launches={allLaunchesData} />
          </Route>
          <Route exact path='/test' component={TestPage} />
          <Route exact path='/style' component={StyleTest} />
          <Route exact path='/timeline' component={TimelinePage} />
          <Route>
            <main className='route-not-found'>
              <h1>Page not found</h1>
              <Link to='/'>Return to Summary</Link>
            </main>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>

  );

}

export default App;
