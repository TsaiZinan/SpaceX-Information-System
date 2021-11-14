import React, { useState, useEffect } from 'react'

// import './Chart.css'

import PadChart from './PadChart';
import LaunchChart from './LaunchChart';

// import { LatestLaunch, Cores, AllLaunches, LaunchPads } from '../../data'


const Chart = (props) => {
  {/* <LaunchChart data={AllLaunches} latest={LatestLaunch}/> */ }
  {/* <PadChart data={LaunchPads}/> */ }


  const LatestLaunch = props.latestLaunch;
  const AllLaunches = props.launches;
  const LaunchPads = props.launchpads;
  // console.log(LaunchPads)
  // console.log(LatestLaunch)
  // console.log(AllLaunches)

  let content = <div class="lds-roller">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

  if (AllLaunches.length > 1 && LaunchPads.length > 1 && Object.keys(LatestLaunch).length != 0) {
    // console.log('....................')
    content =
      <div className='chart'>

        <LaunchChart data={AllLaunches}/>
        <PadChart data={LaunchPads} />
      </div>

  }


  return (
    <div className='chart'>
      {/* {console.log('XXXXXXXXXXXXXXXXX')} */}

      {content}
      {/* <LaunchChart data={AllLaunches} latest={LatestLaunch}/> */}
      {/* <PadChart data={LaunchPads}/> */}
    </div>
  )
}

export default Chart


