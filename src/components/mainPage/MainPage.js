import React from 'react'

import {landingPadConverter, launchPadConverter, coresConverter } from '../converter/converter'

import './MainPage.css'

import PadChart from '../chart/PadChart'
import LaunchChart from '../chart/LaunchChart'

const MainPage = (props) => {
  const LatestLaunch = props.latestLaunch;
  const AllLaunches = props.launches;
  const LaunchPads = props.launchpads;
  const LandingPads = props.landingPads;
  const CoresData = props.cores;

  const lastLaunchNumber = LatestLaunch.flight_number;
  console.log(lastLaunchNumber)
  console.log(AllLaunches[137])

  const LaunchBlock = (props) => {

    let launchBlockData = props.data;

    let blockUnit = (name, content) => {
      return (
        <div className='launch-block-m-blockunit'>
          <div className='launch-block-m-blockunit-name'>{name}</div>
          <div className='launch-block-m-blockunit-content'>{content}</div>
        </div>
      )
    }

    return (
      <div className='launch-block-m'>
        <div className='launch-block-m-patch'>
          <img className='launch-block-m-patch-img' src={launchBlockData.links.patch.small} alt="" />
        </div>

        <div className='launch-block-m-title'>
          {props.mode === 'next' ? 'Next Launch' : 'Last Launch'}
        </div>

        <div className='launch-block-m-name'>
          {launchBlockData.name}
          {/* Crew-3 */}
        </div>

        <div className='launch-block-m-time'>
          {launchBlockData.date_utc.substring(0, 19).replace('T', ' ')}
        </div>

        <div className='blockunit-row'>
          {blockUnit('Launch Site:', launchPadConverter('5e9e4501f509094ba4566f84', LaunchPads, 0))}
          {blockUnit('First Stage:', coresConverter(launchBlockData.cores[0].core, CoresData, 2))}
        </div>

        <div className='blockunit-row'>
          {blockUnit('First Stage Landing Site:', landingPadConverter(launchBlockData.cores[0].landpad, LandingPads, 1))}
          {props.mode === 'last' ? blockUnit('Landing Result:', launchBlockData.cores[0].landing_success === true ? 'Success' : 'fail') : null}
        </div>

      </div>
    )
  }

  const SmallBlock = (props) => {
    return (
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

  let content =
    <div class="lds-roller">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>

  if (AllLaunches.length > 1 && LaunchPads.length > 1 && LandingPads.length > 1 && CoresData.length > 1 && Object.keys(LatestLaunch).length != 0) {


    content =
      <div className='mainpage'>
        <div className='mainpage-block'>
          <LaunchBlock mode='next' data={AllLaunches[lastLaunchNumber]} />
        </div>
        <div className='mainpage-block'>
          <LaunchBlock mode='last' data={LatestLaunch} />
        </div>
        <div className='mainpage-block'>
          <SmallBlock title='Launch' number='137' />
          <SmallBlock title='Launch this Year' number='20' />
          <SmallBlock title='Success' number='135' />
          <SmallBlock title='Recover' number='62' />
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
