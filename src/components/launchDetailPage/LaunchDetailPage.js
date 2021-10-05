import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";

import './LaunchDetailPage.css'

const LaunchDetailPage = (props) => {
  const launchesData = props.launches;
  const coresData = props.cores;
  const launchNumber = props.match.params.number;
  const number = launchNumber - 1;
  const singleLaunchData = launchesData[number]
  console.log(number)

  const launchDataLength = launchesData.length;

  return (
    <div className='launchDetail'>
      <Link to='/launches'>
        <div className='launchDetail-backButton'>
          <VscArrowLeft />
        </div>
      </Link>
      <div>
        
        <Link to={`/launch/${launchNumber == 1 ? launchDataLength : launchNumber - 1}`}><VscArrowLeft className='launchDetail-backButton'/></Link>
        
        
        <Link to={`/launch/${launchNumber == launchDataLength ? 1 : Number(launchNumber) + 1}`}><VscArrowRight className='launchDetail-backButton'/></Link>
      </div>
      <div>
        {singleLaunchData.name}
      </div>
      <div>
        {singleLaunchData.flight_number}
        <img src={singleLaunchData.links.patch.small} alt="" />
      </div>

    </div>
  )
}

export default LaunchDetailPage
