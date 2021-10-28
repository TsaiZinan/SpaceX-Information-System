import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";

import './LaunchDetailPage.css'

const LaunchDetailPage = (props) => {
  const launchesData = props.launches;
  const coresData = props.cores;
  const launchNumber = props.match.params.number;
  const number = launchNumber - 1;
  const singleLaunchData = launchesData[number]


  const launchDataLength = launchesData.length;

  // console.log(coresData)

  // id: core id | data: core data | mode: 0=>serial number; 1=>reused times
  let coreFetch = (id, data, mode) => {
    let serialNumber = 'NET';
    let reuse_count = 0;
    // console.log(data);
    data.map(core => {
      // core.id === id ? serialNumber = core.serial : null
      if (core.id === id) {
        serialNumber = core.serial;
        reuse_count = core.reuse_count;
      }
    })

    switch (mode) {
      case 0:
        return serialNumber
        break;

      case 1:
        return reuse_count
        break;

      default: return serialNumber
        break;
    }
  }

  return (
    <div className='launchDetail'>

      <div className='launchDetail-controlPanal'>
        <div>
          <Link to='/launches'>
            <VscArrowLeft className='launchDetail-Button' />
          </Link>
        </div>

        <div className='launchDetail-controlPanal-page'>

          <Link to={`/launch/${launchNumber == 1 ? launchDataLength : launchNumber - 1}`}>
            <VscArrowLeft className='launchDetail-Button' />
          </Link>


          <Link to={`/launch/${launchNumber == launchDataLength ? 1 : Number(launchNumber) + 1}`}>
            <VscArrowRight className='launchDetail-Button' />
          </Link>
        </div>
      </div>

      <div className='launchDetail-first'>

        <iframe
          className='launchDetail-embedVideo'
          // width="560" 
          // height="315"
          src={`https://www.youtube.com/embed/${singleLaunchData.links.youtube_id}`}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>

        <div className='launchDetail-basicInfo'>
          <div className='launchDetail-basicInfo-launch'>
            <div className='launchDetail-basicInfo-launch-numpatch'>

              <div className='launchDetail-basicInfo-launch-patch'>
                <img className='launchDetail-basicInfo-launch-patch-img' src={singleLaunchData.links.patch.small} alt="" />
              </div>
              {/* <div>{singleLaunchData.flight_number}</div> */}
              <div className='launchDetail-basicInfo-launchTimeSite'>

                {/* <div>{singleLaunchData.launchpad}</div> */}
                <div>{singleLaunchData.date_utc.substring(0, 10)}</div>
              </div>


            </div>
            <div className='launchDetail-basicInfo-name'>{singleLaunchData.name}</div>
            {/* <div>{singleLaunchData.date_utc}</div> */}
            {/* <div>{singleLaunchData.launchpad}</div> */}
          </div>
        </div>

        <div className='launchDetail-basicInfo-core'>
          <div>First Stage:{coreFetch(singleLaunchData.cores[0].core, coresData, 0)}</div>
          <div>Reused Times: {singleLaunchData.cores[0].flight}</div>
          <div>Landing Type: {singleLaunchData.cores[0].landing_type}</div>
          <div>Landing Site: {singleLaunchData.cores[0].landpad}</div>
          <div>Landing Result: {singleLaunchData.cores[0].landing_success === true ? 'Y' : 'N'}</div>
        </div>
      </div>


      <div className='launchDetail-second'>
        {singleLaunchData.details}
      </div>

      <div style={{ height: '50px' }}>
        {' '}
      </div>

    </div>
  )
}

export default LaunchDetailPage
