import React, { useState } from 'react'
import { AllLaunches, Cores } from '../../data'

const SingleLaunch = () => {
  const cores = Cores;

  const [launchNumber, setLaunchNumber] = useState(20)

  return (
    <div>
      <p>-------------------------------------------------------------------------</p>
      <button onClick={() => setLaunchNumber(launchNumber + 1)}>+</button>
      <button onClick={() => setLaunchNumber(launchNumber - 1)}>-</button>
      {/* {console.log(AllLaunches)} */}
      <p>{AllLaunches[launchNumber].name}</p>
      <p>{AllLaunches[launchNumber].flight_number}</p>
      
      {/* fetch core information in Cores by useing core id in AllLaunch */}
      {cores.map((singleCore, coreIndex) => {
        if (singleCore.id === AllLaunches[launchNumber].cores[0].core) {
          console.log('Yes')
          console.log(singleCore.serial)
          return (
            <div>{singleCore.serial}</div>
          )
        }
      })}

      <img src={AllLaunches[launchNumber].links.patch.small} alt="" />
    </div>
  )
}

export default SingleLaunch
