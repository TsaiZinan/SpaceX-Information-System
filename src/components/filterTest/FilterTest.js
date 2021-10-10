import React, { useState, useEffect } from 'react'

import './FilterTest.css'
import { LatestLaunch, Cores, AllLaunches } from '../../data'

const FilterTest = () => {

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  const [reused, setReused] = useState(false);

  let reusedSwitch = () => {
    setReused(!reused)
  }

  // array Trigger to trigger the page refresher
  const [arrayTrigger, setarrayTrigger] = useState(true)


  // for the multiple selecting of years
  const [multiYears, setMultiYears] = useState([])

  const changeYear = input => {
    setarrayTrigger(!arrayTrigger);
    if (multiYears.includes(input)) {
      setMultiYears(removeItemOnce(multiYears, input))
    } else {
      multiYears.push(input);
      setMultiYears(multiYears);
    }
  }


  // for the filter condition
  const filter = (launchDateUTC, reusedData) => {
    let yearStatement = multiYears.includes(parseInt(launchDateUTC.substring(0, 4)));
    var reusedStatement;
    reusedData === reused ? reusedStatement = true : reusedStatement = false;

    if (yearStatement && reusedStatement) {
      // console.log('trueeeeeeeee')
      return true;
    } else {
      // console.log('falseeeeeeeeeeeeeee')
      return false;
    }
  }

  // still working on because of the bug:
  // can't run two function in one onChange
  const YearSelectCheckbox = (props) => {
    const [checked, setChecked] = useState(true);

    let changeChecked = () => {
      setChecked(!checked)
      console.log('work')
    }

    const handleChange = () => {
      setChecked(!checked);
    };

    function eventHandler1() {
      console.log('eventHandler1 called!');
    }

    function eventHandler2() {
      console.log('eventHandler2 called!');
    }


    const act = (year) => {
      console.log(checked)
      // not work with changeYear(2017)
      // handleChange();
      console.log(checked)
      // changeYear(2017)
      changeYear(year)
      eventHandler1()
    }

    return (
      <label>
        <input
          type="checkbox"
          value={props.value}
          checked={checked}
          onChange={() => act(props.year)}
        />
        {props.label}
      </label>
    )
  }



  return (
    <div className='filter'>
      <div className='filter-years'>


        {/* <YearSelectButton year={2006} /> */}

        {/* <YearSelectCheckbox label='200017' value={2017} /> */}



        {[2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021].map((year) => {
          return (
            <label>
              <input type="checkbox" name='2016' onChange={() => changeYear(year)} />
              {year}
            </label>
          )
        })}


        {/* <input type="checkbox" name='2017' onChange={() => changeYear(2017)} />
        <label htmlFor='2017'>2017</label>

        <input type="checkbox" name='2018' onChange={() => changeYear(2018)} />
        <label htmlFor="2018">2018</label>

        <input type="checkbox" name='2019' onChange={() => changeYear(2019)} />
        <label htmlFor="2019">2019</label>

        <input type="checkbox" name='2020' onChange={() => changeYear(2020)} />
        <label htmlFor="2020">2020</label>

        <input type="checkbox" name='2021' onChange={() => changeYear(2021)} />
        <label htmlFor="2021">2021</label> */}




      </div>

      <div>
        <button onClick={reusedSwitch}>Reused: {reused.toString()}</button>
        <input type="checkbox" name='reused' onChange={() => reusedSwitch()} />
        <label htmlFor="reused">reused</label>
      </div>





      <div className='filter-nodes'>
        {/* {console.log(AllLaunches)} */}
        {AllLaunches.map((launch, launchIndex) => {
          if (filter(launch.date_utc, launch.cores[0].reused) === true) {
            return (
              <div className='filter-node'>
                <div>Number: {launch.flight_number}</div>
                <div>Reused: {launch.cores[0].reused === true ? 'Yes' : 'No'}</div>
                <div>Year: {launch.date_utc.substring(0, 4)}</div>
              </div>
            )
          } else { return (null) }


        })}
      </div>

    </div>
  )
}

export default FilterTest
