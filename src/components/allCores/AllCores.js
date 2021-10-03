import React from 'react'

import './AllCores.css'

const AllCores = (props) => {
  const launchesData = props.launches;
  const coresData = props.cores;

  return (
    <div className='allCores'>
      
      {console.log(launchesData)}
      {console.log(coresData)}
      {coresData.map((core, coreIndex) => {
        return (
          <div className='singleCore' id={coreIndex}>
            <div className='singleCore-name'>
              {core.serial}
            </div>

            <div className='launch-patches' >
              {console.log(core.serial)}
              {console.log(core.reuse_count)}

              {core.launches.map((idCoreLaunches, idCoreLaunchesIndex) => {
                // console.log(idCoreLaunches)
                return (
                  <div id='idCoreLaunchesIndex'>
                    {launchesData.map((idLaunches, idLaunchesIndex) => {

                      if (idCoreLaunches === idLaunches.id) {
                        console.log(idLaunches.name)
                        return (

                          <div id={idLaunchesIndex}>
                            <img className='launch-patch' src={idLaunches.links.patch.small} alt="" />
                            {/* <p>{idLaunches.name}</p> */}
                          </div>

                        )
                      }
                    })}
                  </div>
                )
              })}
            </div>



          </div>
        )
      })}
    </div>
  )
}

export default AllCores
