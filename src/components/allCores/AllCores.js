import React from 'react'
import { Link } from 'react-router-dom'

import { SiReddit, SiYoutube, SiWikipedia, SiSpacex } from "react-icons/si";

import './AllCores2.css'

const AllCores = (props) => {
  const launchesData = props.launches;
  const coresData = props.cores;

  const coreIntro = {
    title: 'Cores Information',
    text: [
      'As SpaceX begins to recover and reuse the rocket, one rocket can be launched multiple times.',
      'This page shows the list of rockets SpaceX use and patch of each launch with that rocket.',
    ]
  }

  return (
    <div className='core'>

      <div className='intro'>
        <div className='intro-title'>{coreIntro.title}</div>
        <div className='intro-text'>
          {coreIntro.text.map((singleText) => {
            return (
              <div>{singleText}</div>
            )
          })}
        </div>

      </div>

      <div className='allCores'>

        {/* {console.log(launchesData)}
        {console.log(coresData)} */}
        {coresData.map((core, coreIndex) => {
          return (
            <div className='singleCore' id={coreIndex}>
              <div className='singleCore-name'>
                {core.serial}
              </div>

              <div className='launch-patches' >
                {/* {console.log(core.serial)}
        {console.log(core.reuse_count)} */}

                {core.launches.map((idCoreLaunches, idCoreLaunchesIndex) => {
                  // console.log(idCoreLaunches)
                  return (
                    <div className='launch-patch-div' id='idCoreLaunchesIndex'>
                      {launchesData.map((idLaunches, idLaunchesIndex) => {

                        if (idCoreLaunches === idLaunches.id) {
                          // console.log(idLaunches.name)
                          return (

                            <div id={idLaunchesIndex}>
                              <img className='launch-patch' src={idLaunches.links.patch.small} alt="" />
                              <div className='launch-hoverBox'>

                                <img className='launch-hoverBox-img' src={idLaunches.links.patch.small} alt="" />

                                <div className='launch-hoverBox-number'>
                                  {idLaunches.flight_number}
                                </div>

                                <div className='launch-hoverBox-name'>
                                  <Link to={`/launch/${idLaunches.flight_number}`} className="launch-hoverBox-name">
                                    {idLaunches.name}
                                  </Link>

                                </div>



                                <div className='launch-hoverBox-last'>
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

                                  <div className='launch-hoverBox-date'>
                                    {idLaunches.date_utc.substring(0, 10)}
                                  </div>
                                </div>



                                {/* <div className='launch-hoverBox-details'>
                          {idLaunches.details}
                        </div> */}

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
    </div>

  )
}

export default AllCores
