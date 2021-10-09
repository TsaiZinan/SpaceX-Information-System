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

  const [labb, setLabb] = useState(true)
  

  const [multiYears, setMultiYears] = useState([])

  const changeYear = input => {
    setLabb(!labb);
    if (multiYears.includes(input)) {
      console.log('yes, before:')
      console.log(multiYears)
      // setMultiYears(multiYears.filter(e => e !== input))
      setMultiYears(removeItemOnce(multiYears, input))
      console.log('yes, after:')
      console.log(multiYears)
      console.log('-----')
    } else {
      console.log('no, before:')
      console.log(multiYears)
      multiYears.push(input);
      setMultiYears(multiYears);
      console.log('no, after:')
      console.log(multiYears)
      console.log('-----')
    }
  }


  // var yearyear;
  // if (multiYears.includes(2020)) {
  //   yearyear = <div>Yes 2020</div>
  //   console.log('-----is include')
  // } else {
  //   yearyear = <div>No 2020</div>
  //   console.log('-----not include')
  // }

  // console.log(multiYears.includes(parseInt(2020)));

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


  const [testNum, setTestNum] = useState(false)

  const switchNum = () => {
    setTestNum(!testNum)
  }

  var testyear;

  // if (multiYears.includes(2020)) {
  if (testNum === true) {
    testyear = <div>Yes</div>
  } else {
    testyear = <div>No</div>
  }

  useEffect(() => {
    console.log('use effect--------------------------------------')
    switchNum()
  },[labb]);

  useEffect(() => {
    console.log('Something happened')
  }, [JSON.stringify(multiYears)]);


  return (
    <div className='filter'>
      <div>
        <button onClick={reusedSwitch}>Reused: {reused.toString()}</button>

        <input type="checkbox" name='2017' onChange={() => changeYear(2017)} />
        <label htmlFor="2017">2017</label>

        <input type="checkbox" name='2018' onChange={() => changeYear(2018)} />
        <label htmlFor="2018">2018</label>

        <input type="checkbox" name='2019' onChange={() => changeYear(2019)} />
        <label htmlFor="2019">2019</label>

        <input type="checkbox" name='2020' onChange={() => changeYear(2020)} />
        <label htmlFor="2020">2020</label>

        <input type="checkbox" name='2021' onChange={() => changeYear(2021)} />
        <label htmlFor="2021">2021</label>

        <input type="checkbox" name='reused' onChange={() => reusedSwitch()} />
        <label htmlFor="reused">reused</label>

        {/* <button onClick={() => changeYear(2020)}>+-2020</button> */}
        

        <div>
          <button onClick={() => switchNum()}>WTF</button>
          {testyear}

        </div>
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
