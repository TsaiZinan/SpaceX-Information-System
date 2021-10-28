import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";

import './LaunchDetailPage2.css'

const LaunchDetailPage = (props) => {
  const launchesData = props.launches;
  const coresData = props.cores;
  const landingData = props.landingPads;
  const launchNumber = props.match.params.number;
  const number = launchNumber - 1;
  const singleLaunchData = launchesData[number]


  const launchDataLength = launchesData.length;

  // console.log(landingData)

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

  let landingPadFetch = (id, data, mode) => {
    let abbr_name = 'NET';
    let full_name = 'NET';
    // console.log(data);
    data.map(site => {

      if (site.id === id) {
        abbr_name = site.name;
        full_name = site.full_name;
      }
    })

    switch (mode) {
      case 0:
        return abbr_name
        break;

      case 1:
        return full_name
        break;

      default: return abbr_name
        break;
    }
  }

  return (
    <div className='launchDetail'>

      <div className='launchDetail-controlPanal'>
        <div>
          <Link to='/filter' className='launchDetail-controlPanal-button'>
            {/* <VscArrowLeft className='launchDetail-Button' /> */}
            BACK
          </Link>
        </div>

        <div className='launchDetail-controlPanal-page'>

          <Link to={`/launch/${launchNumber == 1 ? launchDataLength : launchNumber - 1}`} className='launchDetail-controlPanal-button'>
            {/* <VscArrowLeft className='launchDetail-Button' /> */}
            PREVIOUS
          </Link>


          <Link to={`/launch/${launchNumber == launchDataLength ? 1 : Number(launchNumber) + 1}`} className='launchDetail-controlPanal-button'>
            {/* <VscArrowRight className='launchDetail-Button' /> */}
            NEXT
          </Link>
        </div>
      </div>

      <div className='launchDetail-first'>

        <div className='launchDetail-first-left'>
          

          <div className='launchDetail-patch'>
            <img className='launchDetail-patch-img' src={singleLaunchData.links.patch.small} alt="" />
          </div>

          <div className='launchDetail-basic'>

            <div className='launchDetail-basic-name'>{singleLaunchData.name}</div>
            <div>{singleLaunchData.date_utc.substring(0, 10)}</div>
            {/* <div>{singleLaunchData.flight_number}</div> */}
          </div>



        </div>

        <div className='launchDetail-first-middle'>
          <div className='launchDetail-core-title'>Core</div>
          <div className='launchDetail-core'>
            <div className='launchDetail-core-h'>Name:</div>
            <div className='launchDetail-core-p'>{coreFetch(singleLaunchData.cores[0].core, coresData, 0)}</div>

            <div className='launchDetail-core-h'>Reused Times:</div>
            <div className='launchDetail-core-p'>{singleLaunchData.cores[0].flight}</div>

            <div className='launchDetail-core-h'>Landing Type:</div>
            <div className='launchDetail-core-p'>{singleLaunchData.cores[0].landing_type}</div>

            <div className='launchDetail-core-h'>Landing Site:</div>
            <div className='launchDetail-core-p'>{landingPadFetch('5e9e3033383ecbb9e534e7cc', landingData, 1)}</div>
            {/* <div className='launchDetail-core-p'>{singleLaunchData.cores[0].landpad}</div> */}

            <div className='launchDetail-core-h'>Landing Result:</div>
            <div className='launchDetail-core-p'>{singleLaunchData.cores[0].landing_success === true ? 'Success' : 'Fail'}</div>
          </div>
        </div>

        <div className='launchDetail-first-right'>

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

          <div className='launchDetail-detail'>
            {singleLaunchData.details}
          </div>

        </div>




      </div>




    </div>
  )
}

export default LaunchDetailPage
