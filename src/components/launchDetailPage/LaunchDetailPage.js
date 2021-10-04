import React from 'react'
import { Link } from 'react-router-dom'
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";

import './LaunchDetailPage.css'

const LaunchDetailPage = (props) => {
  const launchesData = props.launches;
  const coresData = props.cores;
  const number = props.match.params.number - 1;
  const singleLaunchData = launchesData[number]
  console.log(number)

  return (
    <div className='launchDetail'>
      <Link to='/launches'>
        <div className='launchDetail-backButton'>
          <VscArrowLeft />
        </div>
      </Link>
      <div>
        <Link to={`/launch/${number}`}><VscArrowLeft /></Link>
        <Link to={`/launch/${number+2}`}><VscArrowRight /></Link>
      </div>
      <div>
        {singleLaunchData.name}
      </div>
      <div>
        <img src={singleLaunchData.links.patch.small} alt="" />
      </div>

    </div>
  )
}

export default LaunchDetailPage
