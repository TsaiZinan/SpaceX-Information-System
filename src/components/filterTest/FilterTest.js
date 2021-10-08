import React, { useState } from 'react'

import './FilterTest.css'
import { LatestLaunch, Cores, AllLaunches } from '../../data'

const FilterTest = () => {

  const [reused, setReused] = useState(false);

  let reusedSwitch = () => {
    setReused(!reused)
  }

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  const [multiYears, setMultiYears] = useState([2017, 2018])

  // console.log(multiYears)

  const changeYear = input => {
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


  var yearyear;
  if (multiYears.includes(2020)) {
    yearyear = <div>Yes 2020</div>
    console.log('-----is include')
  } else {
    yearyear = <div>No 2020</div>
    console.log('-----not include')
  }

  // console.log(multiYears.includes(parseInt(2020)));

  const filter = (launchDateUTC, reused) => {
    if (multiYears.includes(parseInt(launchDateUTC.substring(0, 4)))) {
      console.log('trueeeeeeeee')
    } else {
      console.log('falseeeeeeeeeeeeeee')
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



  return (
    <div className='filter'>
      <div>
        <button onClick={reusedSwitch}>Reused: {reused.toString()}</button>


        <input type="checkbox" name='2020' onChange={() => changeYear(2020)} />
        <label htmlFor="2020">2020</label>

        <input type="checkbox" name='2019' onChange={() => changeYear(2019)} />
        <label htmlFor="2019">2019</label>

        <button onClick={() => changeYear(2020)}>+-2020</button>
        {yearyear}
        {console.log([2017, 2020].includes(parseInt('2020')))}

        <div>
          <button onClick={() => switchNum()}>Y/N</button>
          {testyear}
          {console.log('num')}
          {console.log(testNum==true)}
        </div>

        <button onClick={() => filter("2018-09-13T07:07:00.000Z")}>x</button>


      </div>





      <div className='filter-nodes'>
        {/* {console.log(AllLaunches)} */}
        {AllLaunches.map((launch, launchIndex) => {
          // if (reused === launch.cores[0].reused && multiYears.includes(parseInt(launch.date_utc.substring(0, 4)))) {
          //   console.log(launch.date_utc.substring(0, 4)+'yes')
          // } else {
          //   console.log(launch.date_utc.substring(0, 4)+'no')
          // }

          // if (reused === launch.cores[0].reused && year === parseInt(launch.date_utc.substring(0, 4)) ) {
          if (filter(launch.date_utc === true)) {
            return (
              <div className='filter-node'>
                <div>Number: {launch.flight_number}</div>
                <div>Reused: {launch.cores[0].reused === true ? 'Yes' : 'No'}</div>
                <div>Year: {launch.date_utc.substring(0, 4)}</div>
              </div>
            )
          } else { return (null) }


          // reused === launch.cores[0].reused ? {
          //   return (
          //     <div>N</div>
          //   )
          // } : null

          // return (
          //   <div className='filter-node'>
          //     <div>Number: {launch.flight_number}</div>

          //     <div>Reused: {launch.cores[0].reused === true ? 'Yes' : 'No'}</div>

          //   </div>
          // )
        })}
      </div>

    </div>
  )
}

export default FilterTest
