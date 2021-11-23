import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";

import { launchConverter } from '../converter/converter'

import './BoostersStatus.css'

const BoostersStatus = (props) => {
  const coresData = props.cores;
  const allLaunches = props.launches;

  const Legend = () => {
    return (
      <div className='legend'>

        <div className='legend-block-line'>
          <div className='legend-block-unit'>
            <div className='legend-singleBlock boosterPage-status boosterPage-status-active'>ACT</div>
            <div> ACTIVE </div>
          </div>
          <div className='legend-block-unit'>
            <div className='legend-singleBlock boosterPage-status boosterPage-status-lost'>LOST</div>
            <div> LOST </div>
          </div>
          <div className='legend-block-unit'>
            <div className='legend-singleBlock boosterPage-status boosterPage-status-unknown'>UNKN</div>
            <div> UNKNOWN </div>
          </div>
          <div className='legend-block-unit'>
            <div className='legend-singleBlock boosterPage-status boosterPage-status-expended'>EXPD</div>
            <div> EXPENDED </div>
          </div>
          <div className='legend-block-unit'>
            <div className='legend-singleBlock boosterPage-status boosterPage-status-inactive'>INACT</div>
            <div> INACTIVE </div>
          </div>
        </div>

        <div className='legend-block-line'>
          <div className='legend-block-unit'>
            <div className='legend-singleBlock legend-statusBlock boosterPage-launchBlock-fail'></div>
            <div> Landing Fail </div>
          </div>
          <div className='legend-block-unit'>
            <div className='legend-singleBlock legend-statusBlock boosterPage-launchBlock-ocean'></div>
            <div> Land on Ocean </div>
          </div>
          <div className='legend-block-unit'>
            <div className='legend-singleBlock legend-statusBlock boosterPage-launchBlock-noattempt'></div>
            <div> Landing not Attempt </div>
          </div>
          <div className='legend-block-unit'>
            <div className='legend-singleBlock legend-statusBlock boosterPage-launchBlock-RTLS'></div>
            <div> Land on Land </div>
          </div>
          <div className='legend-block-unit'>
            <div className='legend-singleBlock legend-statusBlock boosterPage-launchBlock-ASDS'></div>
            <div> Land on Ship </div>
          </div>





        </div>
      </div>
    )
  }

  const ScrollButtons = (props) => {
    const moveRight = () => {
      document.getElementById(props.id).scrollLeft += props.x;
    }

    const moveLeft = () => {
      document.getElementById(props.id).scrollLeft -= props.x;
    }

    return (
      <div className='boosterPage-scrollButtons'>
        <button onClick={() => moveLeft()}><VscArrowLeft /></button>
        <button onClick={() => moveRight()}><VscArrowRight /></button>
      </div>
    )
  }



  const statusConverter = (input) => {

    switch (input) {
      case 'active':
        return 'ACT';
        break;

      case 'inactive':
        return 'INACT';
        break;

      case 'unknown':
        return 'UNKN';
        break;

      case 'expended':
        return 'EXPD';
        break;

      case 'lost':
        return 'LOST';
        break;

      default:
        break;
    }
  }


  const LaunchBlock = (props) => {
    let id = props.id;
    let upcoming = launchConverter(id, allLaunches, 2);
    let landing_attempt = launchConverter(id, allLaunches, 3);
    let landing_success = launchConverter(id, allLaunches, 4);
    let landing_type = launchConverter(id, allLaunches, 5);

    let classname = ''

    // console.log(launchConverter(id, allLaunches, 2));

    if (upcoming === true) {
      classname = 'boosterPage-launchBlock-upcoming'
    } else {
      if (landing_attempt === false) {
        classname = 'boosterPage-launchBlock-noattempt'
      } else {
        if (landing_success === false) {
          classname = 'boosterPage-launchBlock-fail'
        } else {
          if (landing_type === 'Ocean') {
            classname = 'boosterPage-launchBlock-ocean'
          }
          if (landing_type === 'RTLS') {
            classname = 'boosterPage-launchBlock-RTLS'
          }
          if (landing_type === 'ASDS') {
            classname = 'boosterPage-launchBlock-ASDS'
          }
        }
      }
    }

    return (
      <div className='hover-test'>
        <div className={`${classname} boosterPage-launchBlock`}>
          {launchConverter(id, allLaunches, 0)}

          <div className='boosterPage-hoverBox'>

            <div className='boosterPage-hoverBox-imgDiv'>
              <img className='boosterPage-hoverBox-img' src={launchConverter(id, allLaunches, 6)} alt="" />
            </div>

            <div className='boosterPage-hoverBox-time'>
              {launchConverter(id, allLaunches, 7).substring(0, 10).replace('T', ' ')}
            </div>

            <div className='boosterPage-hoverBox-name'>
              {/* <Link to={`/launch/${launchConverter(id, allLaunches, 0)}`} className='boosterPage-hoverBox-link'>
                {launchConverter(id, allLaunches, 1)}
              </Link> */}
              {launchConverter(id, allLaunches, 1)}
            </div>

          </div>
        </div>


      </div>

    )
  }

  return (
    <div>
      <Legend />
      <ScrollButtons id='boosterPage' x={55} />
      <div className='boosterPage' id="boosterPage">

        {/* <button onClick={() => onClickRight()}>L</button> */}



        {coresData.slice(0).reverse().map((core) => {
          return (
            <div className='boosterPage-core'>


              <div className={
                core.status === 'active' ? 'boosterPage-status boosterPage-status-active'
                  : core.status === 'unknown' ? 'boosterPage-status boosterPage-status-unknown'
                    : core.status === 'expended' ? 'boosterPage-status boosterPage-status-expended'
                      : core.status === 'inactive' ? 'boosterPage-status boosterPage-status-inactive'
                        : 'boosterPage-status boosterPage-status-lost'
              }>
                {statusConverter(core.status)}
              </div>

              <div className='boosterPage-name'>
                {core.serial}
              </div>


              <div>
                {core.launches.map((launch) => {
                  return (
                    <div>
                      <LaunchBlock id={launch} />
                    </div>
                  )
                })}
              </div>

              <div className='boosterPage-count'>
                {/* {core.reuse_count + 1} */}
                {core.launches.length}
              </div>



            </div>
          )
        })}

      </div>


    </div>

  )
}

export default BoostersStatus
