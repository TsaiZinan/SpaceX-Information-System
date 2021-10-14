import React, { useState, useEffect } from 'react'

import './FilterTest.css'
import { LatestLaunch, Cores, AllLaunches, LaunchPads } from '../../data'

const FilterTest = () => {
  const allYears = [2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
  const allSite = ['5e9e4502f5090995de566f86', '5e9e4501f509094ba4566f84', '5e9e4502f509092b78566f87', '5e9e4502f509094188566f88']

  // for the selecting of reused state
  const [reusedState, setReusedState] = useState([true, false]);

  // for the multiple selecting of years
  const [yearState, setyearState] = useState([2021])

  // for the multiple selecting of launch site
  const [launchPadState, setLaunchPadState] = useState(['5e9e4501f509094ba4566f84', '5e9e4502f509092b78566f87', '5e9e4502f509094188566f88'])

  console.log(LaunchPads)
  // id: site id
  // data: site data
  // mode: 0 => abbreviation name of site | 1 => full name of site
  let launchPadFetch = (id, data, mode) => {
    console.log(id)
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
  const filter = (launchDateUTC, reusedData, launchpad) => {
    //take the first fourth digitals of launchDateUTC as year 
    // check if this year in yearState array
    let yearStatement = yearState.includes(parseInt(launchDateUTC.substring(0, 4)));
    // check if this reused in reusedState array
    let reusedStatement = reusedState.includes(reusedData);

    let launchpadStatement = launchPadState.includes(launchpad);


    if (yearStatement && reusedStatement && launchpadStatement) {
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

      <div className='filter-years'>
        {/* reset to all year */}
        <button
          className={yearState.length === allYears.length ? 'SelectButton-active' : 'SelectButton-inactive'}
          onClick={() => setyearState(allYears)}
        >All Years</button>
        {/* set to only 2021 */}
        <button
          className={JSON.stringify(yearState) == JSON.stringify([2021]) ? 'SelectButton-active' : 'SelectButton-inactive'}
          onClick={() => setyearState([2021])}
        >
          Only 2021
        </button>
      </div>



      <div className='filter-years'>
        {allYears.map((year) => {
          return (
            <SelectButton name={year} unit={year} array={yearState} fun={() => stateSelect(year, yearState, setyearState)} />
          )
        })}
      </div>

      <div className='filter-reused'>
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

      <div className='filter-sites'>
        {allSite.map((site, siteIndex) => {
          return (
            <SelectButton
              name={launchPadFetch(site, LaunchPads, 0)}
              unit={site}
              array={launchPadState}
              fun={() => stateSelect(site, launchPadState, setLaunchPadState)}
            />
          )
        })}
      </div>


      <div className='filter-nodes'>
        {/* {console.log(AllLaunches)} */}
        {AllLaunches.map((launch, launchIndex) => {
          if (filter(launch.date_utc, launch.cores[0].reused, launch.launchpad) === true) {
            return (
              <div className={launch.cores[0].reused === true ? 'filter-node-reused' : 'filter-node-unreused'} id={launchIndex}>
                <div>Number: {launch.flight_number}</div>
                <div>Reused: {launch.cores[0].reused === true ? 'Yes' : 'No'}</div>
                <div>Year: {launch.date_utc.substring(0, 4)}</div>
                {/* {console.log(launch.launchpad)} */}
                <div>Site: {launchPadFetch(launch.launchpad, LaunchPads, 0)}</div>
              </div>
            )
          } else { return (null) }
        })}
      </div>

    </div>
  )
}

export default FilterTest
