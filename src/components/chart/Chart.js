import React, { useState, useEffect } from 'react'

import './Chart.css'

import PadChart from './PadChart';
import LaunchChart from './LaunchChart';

import { LatestLaunch, Cores, AllLaunches, LaunchPads } from '../../data'


const Chart = () => {



  return (
    <div className='chart'>

      
      <LaunchChart data={AllLaunches} latest={LatestLaunch}/>
      <PadChart data={LaunchPads}/>
    </div>
  )
}

export default Chart
