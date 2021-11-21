import React from 'react'

import { launchConverter } from '../converter/converter'

import './BoostersStatus.css'

const BoostersStatus = (props) => {
  const coresData = props.cores;
  const allLaunches = props.launches;

  console.log(allLaunches)


  console.log(launchConverter("5fe3af43b3467846b324215e", allLaunches, 1));
  console.log(launchConverter("60428aafc041c16716f73cd7", allLaunches, 1));


  const LaunchBlock = (props) => {
    let id = props.id;
    let upcoming = launchConverter(id, allLaunches, 2);
    let landing_attempt = launchConverter(id, allLaunches, 3);
    let landing_success = launchConverter(id, allLaunches, 4);
    let landing_type = launchConverter(id, allLaunches, 5);

    let classname = ''

    // console.log(launchConverter(id, allLaunches, 2));

    if(upcoming === true) {
      classname = 'boosterPage-launchBlock-upcoming'
    } else {
      if (landing_attempt === false) {
        classname = 'boosterPage-launchBlock-noattempt'
      } else {
        if (landing_success === false) {
          classname = 'boosterPage-launchBlock-fail'
        } else {
          if (landing_type === 'Ocean') {
            classname = 'boosterPage-launchBlock-ocean'
          }
          if (landing_type === 'RTLS') {
            classname = 'boosterPage-launchBlock-RTLS'
          }
          if (landing_type === 'ASDS') {
            classname = 'boosterPage-launchBlock-ASDS'
          }
        }
      }
    }

    return (
      <div className={classname}>
        {launchConverter(id, allLaunches, 0)}
        
      </div>
    )
  }

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
                : core.status === 'unknown' ? 'boosterPage-status-unknown'
                  : core.status === 'expended' ? 'boosterPage-status-expended'
                    : core.status === 'inactive' ? 'boosterPage-status-inactive'
                      : 'boosterPage-status-lost'
            }>
              {core.status}
            </div>



            <div>
              {core.launches.map((launch) => {
                return (
                  <div>
                    <LaunchBlock id={launch} />
                  </div>
                )
              })}
            </div>

            <div>
              {/* {core.reuse_count + 1} */}
              {core.launches.length}
            </div>



          </div>
        )
      })}

    </div>
  )
}

export default BoostersStatus
