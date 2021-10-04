import React from 'react'
import AllCores from './components/allCores/AllCores'

import { LatestLaunch, Cores, AllLaunches } from './data'

const CoresPage = () => {
  return (
    <div className='coresPage'>
      <AllCores cores={Cores} launches={AllLaunches}/>
    </div>
  )
}

export default CoresPage
