import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { SiReddit, SiYoutube, SiWikipedia, SiSpacex } from "react-icons/si";

// import './FilterTest.css'
// import './FilterTest2.css'
import './FilterTest3.css'
// import {AllLaunches, LaunchPads } from '../../data'

const FilterTest = (props) => {
  const AllLaunches = props.launches;
  const LaunchPads = props.launchpads;
  // console.log(LaunchPads)

  const launchIntro = {
    title: 'Launches Information',
    text: [
      'This page provides a way to display the information of each launch by different options.',
      'You can find more detail by clicking the name of each launch.',
    ]
  }


  const allYears = [...new Set(AllLaunches.map(launch => parseInt(launch.date_utc.substring(0, 4))))].sort((a, b) => a - b);
  const allLandingStatuses = [
    'Landing Fail',
    'Land on Ocean',
    'Landing not Attempt',
    'Land on Land',
    'Land on Ship'
  ];

  const getLandingStatus = (launch) => {
    const core = launch.cores && launch.cores[0] ? launch.cores[0] : null;
    if (!core) return 'Landing not Attempt';

    const { landing_attempt, landing_success, landing_type } = core;

    if (landing_attempt === false) return 'Landing not Attempt';
    if (landing_success === false) return 'Landing Fail';
    if (landing_type === 'Ocean') return 'Land on Ocean';
    if (landing_type === 'RTLS') return 'Land on Land';
    if (landing_type === 'ASDS') return 'Land on Ship';

    return 'Landing not Attempt';
  }

  // for the selecting of reused state
  const [reusedState, setReusedState] = useState([true, false]);

  // for the multiple selecting of years
  const [yearState, setyearState] = useState([])

  // for the multiple selecting of landing status
  const [landingStatusState, setLandingStatusState] = useState(allLandingStatuses);

  useEffect(() => {
    if (allYears.length > 0 && yearState.length === 0) {
      setyearState([allYears[allYears.length - 1]]);
    }
  }, [allYears]);

  let launchPadFetch = (id, data, mode) => {
    // console.log(id)
    if (id === 'Unknown') return 'Unknown';
    let abbr_name = 'NET';
    let full_name = 'NET';
    // console.log(data);
    data.map(site => {

      if (site.id === id) {
        abbr_name = site.name;
        full_name = site.full_name;
      }
    })

    switch (mode) {
      case 0:
        return abbr_name
        break;

      case 1:
        return full_name
        break;

      default: return abbr_name
        break;
    }
  }






  // array Trigger to trigger the page refresher
  // work with stateSelect() 
  // work with SelectButton component
  const [arrayTrigger, setarrayTrigger] = useState(true)

  // for change the items in array. if exist, remove it, otherwise add into array
  const stateSelect = (input, array, setFunction) => {
    function removeItemOnce(arr, value) {
      var index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
    }
    setarrayTrigger(!arrayTrigger);
    if (array.includes(input)) {
      setFunction(removeItemOnce(array, input))
    } else {
      array.push(input);
      setFunction(array);
    }
  }



  // for the filter condition
  const filter = (launchDateUTC, reusedData, launch) => {
    //take the first fourth digitals of launchDateUTC as year 
    // check if this year in yearState array
    let yearStatement = yearState.includes(parseInt(launchDateUTC.substring(0, 4)));
    // check if this reused in reusedState array
    let reusedStatement = reusedState.includes(reusedData);

    let landingStatus = getLandingStatus(launch);
    let landingStatusStatement = landingStatusState.includes(landingStatus);


    if (yearStatement && reusedStatement && landingStatusStatement) {
      return true;
    } else {
      return false;
    }
  }

  // SelectButton component
  // name: button name | unit: item in array | array: state array | fun: the function which handle the items
  const SelectButton = props => {

    return (
      <button
        className={props.array.includes(props.unit) ? 'SelectButton-active' : 'SelectButton-inactive'}
        onClick={props.fun}
      >
        {props.name}
      </button>
    )
  }



  return (
    <div className='filter'>

      <div className='intro'>
        <div className='intro-title'>{launchIntro.title}</div>
        <div className='intro-text'>
          {launchIntro.text.map((singleText) => {
            return (
              <div>{singleText}</div>
            )
          })}
        </div>
      </div>

      <div className='filter-years'>
        <div className='filter-option'>
          {allYears.map((year) => {
            return (
              <SelectButton name={year} unit={year} array={yearState} fun={() => stateSelect(year, yearState, setyearState)} />
            )
          })}
        </div>

        <div className='filter-option'>
          {/* reset to all year */}
          <button
            className={yearState.length === allYears.length ? 'SelectButton-active' : 'SelectButton-inactive'}
            onClick={() => setyearState(allYears)}
          >All Years</button>
          {/* set to only Latest Year */}
          <button
            className={JSON.stringify(yearState) == JSON.stringify([allYears[allYears.length - 1]]) ? 'SelectButton-active' : 'SelectButton-inactive'}
            onClick={() => setyearState([allYears[allYears.length - 1]])}
          >
            Only {allYears[allYears.length - 1]}
          </button>
        </div>

      </div>





      <div className='filter-years'>
        <div className='filter-option'>
          {allLandingStatuses.map((status, index) => {
            return (
              <SelectButton
                name={status}
                unit={status}
                array={landingStatusState}
                fun={() => stateSelect(status, landingStatusState, setLandingStatusState)}
              />
            )
          })}
        </div>
      </div>

      <div className='filter-years'>
        <div className='filter-option'>
          <SelectButton
            name={'Reused'}
            unit={true}
            array={reusedState}
            fun={() => stateSelect(true, reusedState, setReusedState)}
          />
          <SelectButton
            name={'Unreused'}
            unit={false}
            array={reusedState}
            fun={() => stateSelect(false, reusedState, setReusedState)}
          />
          {/* {console.log(reusedState)}
        {console.log(yearState)} */}
        </div>
      </div>





      {/* <div className='new-node'>

        <div className='new-node-first'>
          <img className='new-node-first-patch' src="https://images2.imgbox.com/12/7c/NiniYxoh_o.png" alt="" />
          <div className='new-node-first-number'>
            63
          </div>
        </div>

        <div className='new-node-second'>
          <div>Nusantara Satu (PSN-6) / S5 / Beresheet</div>
        </div>

        <div className='new-node-third'>
          <div>CCSFS SLC 40</div>
        </div>

        <div className='new-node-last'>
          <div>2020-05-19</div>
          <div className='new-node-links'>
            <SiYoutube className='new-node-link' />
            <SiReddit className='new-node-link' />
            <SiWikipedia className='new-node-link' />
          </div>
        </div>

      </div> */}




      <div className='filter-nodes'>
        {/* {console.log(AllLaunches)} */}
        {AllLaunches.map((launch, launchIndex) => {
          const firstCore = launch.cores && launch.cores.length > 0 ? launch.cores[0] : null;
          const reused = firstCore ? firstCore.reused : false;

          if (filter(launch.date_utc, reused, launch) === true) {
            return (
              <div className={reused === true ? 'filter-node filter-node-reused' : 'filter-node filter-node-unreused'} id={launchIndex}>
                {/* <div>Number: {launch.flight_number}</div> */}
                {/* <div>Reused: {reused === true ? 'Yes' : 'No'}</div> */}
                {/* <div>Year: {launch.date_utc.substring(0, 4)}</div> */}

                {/* <div>{launchPadFetch(launch.launchpad, LaunchPads, 0)}</div> */}

                <div className='new-node'>

                  <div className='new-node-first'>
                    <img className='new-node-first-patch' src={launch.links.patch.small} alt="" />
                    <div className='new-node-first-number'>
                      {launch.flight_number}
                    </div>
                  </div>

                  <div className='new-node-second'>
                    <Link to={`/launch/${launch.flight_number}`} className='new-node-second'>
                      {launch.name}
                    </Link>
                  </div>

                  <div className='new-node-third'>
                    <div className='new-node-reuse'>{reused === true ? 'Reused' : 'Unreused'}</div>
                    <div>{getLandingStatus(launch)}</div>
                  </div>

                  <div className='new-node-last'>
                    <div>{launch.date_utc.substring(0, 10)}</div>
                    <div className='new-node-links'>
                      <a href={launch.links.webcast}>
                        <SiYoutube className='new-node-link' />
                      </a>
                      <a href={launch.links.reddit.launch}>
                        <SiReddit className='new-node-link' />
                      </a>
                      <a href={launch.links.wikipedia}>
                        <SiWikipedia className='new-node-link' />
                      </a>
                    </div>
                  </div>

                </div>



              </div>
            )
          } else { return (null) }
        })}
      </div>

    </div>
  )
}

export default FilterTest
