import React from 'react'

import './MainPage.css'

import PadChart from '../chart/PadChart'
import LaunchChart from '../chart/LaunchChart'

const MainPage = (props) => {
  const LatestLaunch = props.latestLaunch;
  const AllLaunches = props.launches;
  const LaunchPads = props.launchpads;

  const NextLaunchBlock = () => {
    return(
      <div className='launch-block-m'>
        XXXXXXXXXX
      </div>
    )
  }

  const SmallBlock = (props) => {
    return(
      <div className='launch-block-s'>
        <div className='launch-block-s-title'>
          {props.title}
        </div>
        <div className='launch-block-s-number'>
          {props.number}
        </div>
      </div>
    )
  }

  let content = <div class="lds-roller">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>

  if (AllLaunches.length > 1 && LaunchPads.length > 1 && Object.keys(LatestLaunch).length != 0) {
    content =
      <div className='mainpage'>
        <div className='mainpage-block'>
          <NextLaunchBlock />
        </div>
        <div className='mainpage-block'>
          <NextLaunchBlock />
        </div>
        <div className='mainpage-block'>
          <SmallBlock title='Launch' number='137'/>
          <SmallBlock title='Launch this Year' number='20'/>
          <SmallBlock title='Success' number='135'/>
          <SmallBlock title='Recover' number='62'/>
        </div>
        
        <div className='mainpage-block'>
          <div className='mainpage-block-chart'>
            <LaunchChart data={AllLaunches} latest={LatestLaunch} type='month' />
          </div>
        </div>
        
        <div className='mainpage-block'>
          <div className='mainpage-block-chart'>
            <LaunchChart data={AllLaunches} latest={LatestLaunch} type='year' />
          </div>
        </div>

        <div className='mainpage-block'>
          <PadChart data={LaunchPads} />
        </div>



      </div>
  }

  return (
    <div className='mainpage'>
      {content}
    </div>
  )
}

export default MainPage
