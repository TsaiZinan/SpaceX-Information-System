import React from 'react'
import './AllLaunch.css'

import { FaRecycle } from "react-icons/fa";

const AllLaunch = (props) => {
  const allLaunchData = props.data;
  const cores = props.cores;

  return (
    <div className="allLaunch">

      {console.log(cores)}

      {allLaunchData.map((launch, index) => {
        return (
          <div className="allLaunch-card">

            <div className="allLaunch-card-first">

              <div className="allLaunch-card-first-number">
                {launch.flight_number}
              </div>

              <div className="allLaunch-card-first-img">
                <img className="allLaunch-card-first-img-img" src={launch.links.patch.small} alt="" />
              </div>

            </div>

            <div className="allLaunch-card-second">
              <p>{launch.name}</p>
            </div>

            <div className="allLaunch-card-third">
              
            </div>

            <div className="allLaunch-card-fourth">
              {launch.cores[0].reused === true ? <FaRecycle className="reused"/> : <FaRecycle className="unreused"/>}
              {cores.map((core, coreIndex) => {
                // core.id === launch.cores[0].core ? console.log(core.serial) : null
                if (core.id === launch.cores[0].core) {
                  return (
                    <p className="core-name">{core.serial}</p>
                  )
                }
              })}
            </div>

          </div>
        )
      })}
    </div>
  )
}

export default AllLaunch
