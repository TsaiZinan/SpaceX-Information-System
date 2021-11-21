import React from 'react'

import { launchConverter } from '../converter/converter'

import './BoostersStatus.css'

const BoostersStatus = (props) => {
  const coresData = props.cores;
  const allLaunches = props.launches;


  console.log(coresData);



  return (
    <div className='boosterPage'>

      {coresData.map((core) => {
        return (
          <div className='boosterPage-core'>
            <div>
              {core.serial}
            </div>

            <div className={
              core.status === 'active' ? 'boosterPage-status-active'
                :core.status === 'unknown' ? 'boosterPage-status-unknown'
                :core.status === 'expended' ? 'boosterPage-status-expended'
                :core.status === 'inactive' ? 'boosterPage-status-inactive'
                : 'boosterPage-status-lost'
            }>
              {core.status}
            </div>

            

            <div>
              {core.launches.map((launch) => {
                return (
                  <div className='boosterPage-block'>
                    {launchConverter(launch, allLaunches, 0)}
                  </div>
                )
              })}
            </div>

            <div>
              {core.reuse_count + 1}
            </div>

            {launchConverter("5eb87d04ffd86e000604b353", allLaunches, 0)}
            

          </div>
        )
      })}

    </div>
  )
}

export default BoostersStatus
