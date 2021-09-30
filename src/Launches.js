import React from 'react'
import AllLaunch from './components/allLaunch/AllLaunch'

import { LatestLaunch, Cores, AllLaunches } from './data'

const Launches = () => {
  return (
    <div>
      <AllLaunch data={AllLaunches} cores={Cores}/>
    </div>
  )
}

export default Launches
