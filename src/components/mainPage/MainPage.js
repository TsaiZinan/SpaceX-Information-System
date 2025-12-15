import React from 'react'

import {landingPadConverter, launchPadConverter, coresConverter, countNumberInData, testConverter } from '../converter/converter'

import './MainPage.css'

import PadChart from '../chart/PadChart'
import LaunchChart from '../chart/LaunchChart'

const MainPage = (props) => {
  const LatestLaunch = props.latestLaunch;
  const AllLaunches = props.launches;
  const LaunchPads = props.launchpads;
  const LandingPads = props.landingPads;
  const CoresData = props.cores;

  var CurrentYear = new Date().getFullYear()

  // Find the last completed launch and next upcoming launch
  const sortedLaunches = [...AllLaunches].sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));
  let lastLaunchIndex = -1;
  for (let i = 0; i < sortedLaunches.length; i++) {
    if (sortedLaunches[i].upcoming) {
      break;
    }
    lastLaunchIndex = i;
  }

  const LastLaunch = lastLaunchIndex >= 0 ? sortedLaunches[lastLaunchIndex] : {};
  const NextLaunch = (lastLaunchIndex + 1 < sortedLaunches.length) ? sortedLaunches[lastLaunchIndex + 1] : {};
  const lastLaunchNumber = LastLaunch.flight_number || 0;
  const totalLaunchesCount = lastLaunchIndex + 1;

  // console.log(lastLaunchNumber)
  // console.log(AllLaunches[137])

  const LaunchBlock = (props) => {

    let launchBlockData = props.data;
    if (!launchBlockData || Object.keys(launchBlockData).length === 0) return null;

    // display the single block row in launch block
    let blockUnit = (name, content) => {
      return (
        <div className='launch-block-m-blockunit'>
          <div className='launch-block-m-blockunit-name'>{name}</div>
          <div className='launch-block-m-blockunit-content'>{content}</div>
        </div>
      )
    }

    const firstCore = launchBlockData.cores && launchBlockData.cores.length > 0 ? launchBlockData.cores[0] : null;

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
          {blockUnit('Launch Site:', launchPadConverter(launchBlockData.launchpad, LaunchPads, 0))}
          {blockUnit('First Stage:', firstCore ? coresConverter(firstCore.core, CoresData, 2) : 'N/A')}
        </div>

        <div className='blockunit-row'>
          {blockUnit('First Stage Landing Site:', firstCore ? firstCore.landing_location : 'N/A')}
          {/* display the landing result in last launch block instead of next launch block */}
          {props.mode === 'last' && firstCore ? blockUnit('Landing Result:', firstCore.landing_success === true ? 'Success' : 'fail') : null}
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
    <div className='lds-roller'>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>

  if (AllLaunches.length > 0) {


    content =
      <div className='mainpage'>
        <div className='mainpage-block'>
          <LaunchBlock mode='next' data={NextLaunch} />
        </div>
        <div className='mainpage-block'>
          <LaunchBlock mode='last' data={LastLaunch} />
        </div>
        <div className='mainpage-block'>
          <SmallBlock title='Launch' number={totalLaunchesCount} />
          <SmallBlock title='Launch this Year' number={testConverter('.date_utc.substring(0,4)', sortedLaunches.slice(0, lastLaunchIndex + 1), CurrentYear.toString())} />
          <SmallBlock title='Success' number={countNumberInData('.success', sortedLaunches.slice(0, lastLaunchIndex + 1), true)} />
          <SmallBlock title='Recover' number={countNumberInData('.cores[0].landing_success', sortedLaunches.slice(0, lastLaunchIndex + 1), true)} />
        </div>

        <div className='mainpage-block'>
          <div className='mainpage-block-chart'>
            <LaunchChart data={AllLaunches} latest={LastLaunch} type='month' />
          </div>
        </div>

        <div className='mainpage-block'>
          <div className='mainpage-block-chart'>
            <LaunchChart data={AllLaunches} latest={LastLaunch} type='year' />
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
