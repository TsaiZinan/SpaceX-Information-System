import React from 'react'
import Test from './components/Test'

import { LatestLaunch, Cores, AllLaunches } from './data'

import SingleLaunch from './components/singleLaunch/SingleLaunch'
import About from './components/about/About'
import Timeline from './components/timeline/Timeline'
import AllLaunch from './components/allLaunch/AllLaunch'
import Chart from './components/chart/Chart'

const Home = () => {
  return (
    <div>
      {/* <AllLaunch data={AllLaunches} cores={Cores}/> */}
      {/* <Timeline /> */}
      <Chart />
      {/* <Test />
      <SingleLaunch />
      <About /> */}
    </div>
  )
}

export default Home
