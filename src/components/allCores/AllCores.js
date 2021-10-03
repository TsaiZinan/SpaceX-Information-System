import React from 'react'

import { SiReddit, SiYoutube, SiWikipedia, SiSpacex } from "react-icons/si";

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
                  <div className='launch-patch-div' id='idCoreLaunchesIndex'>
                    {launchesData.map((idLaunches, idLaunchesIndex) => {

                      if (idCoreLaunches === idLaunches.id) {
                        console.log(idLaunches.name)
                        return (

                          <div id={idLaunchesIndex}>
                            <img className='launch-patch' src={idLaunches.links.patch.small} alt="" />
                            <div className='launch-hoverBox'>
                              <img className='launch-hoverBox-img' src={idLaunches.links.patch.small} alt="" />
                              <div className='launch-hoverBox-name'>
                                {idLaunches.name}
                              </div>
                              <div className='launch-hoverBox-links'>

                                <a href={idLaunches.links.webcast}>
                                  <SiYoutube className='launch-hoverBox-link' />
                                </a>
                                <a href={idLaunches.links.reddit.launch}>
                                  <SiReddit className='launch-hoverBox-link' />
                                </a>
                                <a href={idLaunches.links.wikipedia}>
                                  <SiWikipedia className='launch-hoverBox-link' />
                                </a>
                                <a href={idLaunches.links.presskit}>
                                  <SiSpacex className='launch-hoverBox-link' />
                                </a>

                              </div>
                              <div className='launch-hoverBox-details'>
                                {idLaunches.details}
                              </div>
                            </div>
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
