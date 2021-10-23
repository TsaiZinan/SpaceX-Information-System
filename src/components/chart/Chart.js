import React, { useState, useEffect } from 'react'

import './Chart.css'

import PadChart from './PadChart';

import { LatestLaunch, Cores, AllLaunches, LaunchPads } from '../../data'


const Chart = () => {



  return (
    <div className='chart'>

      <PadChart data={LaunchPads}/>

    </div>
  )
}

export default Chart
