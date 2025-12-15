import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";
import html2canvas from 'html2canvas'

import { launchConverter } from '../converter/converter'

import './BoostersStatus.css'

const BoostersStatus = (props) => {
  const coresData = props.cores;
  const allLaunches = props.launches;
  const [showTurnaround, setShowTurnaround] = useState(false);

  const handleDownloadImage = () => {
    const element = document.getElementById('boosterPage');
    if (!element) {
      return;
    }

    const previousOverflowX = element.style.overflowX;
    const previousWidth = element.style.width;

    element.style.overflowX = 'visible';
    element.style.width = element.scrollWidth + 'px';

    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const rootStyles = getComputedStyle(document.documentElement);
    const varBg = rootStyles.getPropertyValue('--main-bg-color').trim();
    const elementBg = window.getComputedStyle(element).backgroundColor;
    const backgroundColor = varBg || elementBg || '#ffffff';

    html2canvas(element, {
      useCORS: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      width: width,
      height: height,
      backgroundColor: backgroundColor
    }).then((canvas) => {
      element.style.overflowX = previousOverflowX;
      element.style.width = previousWidth;

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'boosters.png';
      link.click();
    }).catch(() => {
      element.style.overflowX = previousOverflowX;
      element.style.width = previousWidth;
    });
  }

  const getLaunchDate = (id) => {
    const launch = allLaunches.find(singleLaunch => singleLaunch.id === id);
    if (launch && launch.date_local) {
      return new Date(launch.date_local);
    }
    return null;
  }

  const getTurnaroundColor = (days) => {
    // Green (Good/Fast): rgb(94, 139, 94)
    // Yellow (Medium): rgb(219, 219, 112)
    // Red (Slow): rgb(212, 120, 120)
    
    const minDays = 20;
    const maxDays = 150;
    
    let normalized = (days - minDays) / (maxDays - minDays);
    if (normalized < 0) normalized = 0;
    if (normalized > 1) normalized = 1;
    
    let r, g, b;

    if (normalized < 0.5) {
      // Green to Yellow (0 to 0.5 -> 0 to 1)
      const localRatio = normalized * 2;
      r = Math.round(94 + (219 - 94) * localRatio);
      g = Math.round(139 + (219 - 139) * localRatio);
      b = Math.round(94 + (112 - 94) * localRatio);
    } else {
      // Yellow to Red (0.5 to 1 -> 0 to 1)
      const localRatio = (normalized - 0.5) * 2;
      r = Math.round(219 + (212 - 219) * localRatio);
      g = Math.round(219 + (120 - 219) * localRatio);
      b = Math.round(112 + (120 - 112) * localRatio);
    }
    
    return `rgb(${r}, ${g}, ${b})`;
  }

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
          <div className='legend-toggle-container'>
            <input
              type="checkbox"
              id="turnaround-switch"
              className='legend-toggle-checkbox'
              checked={showTurnaround}
              onChange={(e) => setShowTurnaround(e.target.checked)}
            />
            <label htmlFor="turnaround-switch" className='legend-toggle-label'></label>
            <label htmlFor="turnaround-switch" className='legend-toggle-text'>
              Turnaround Days
            </label>
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
    const coreSerial = props.coreSerial;

    let upcoming = true;
    let landing_attempt = true;
    let landing_success = true;
    let landing_type = '';

    let classname = '';

    const [hoverPosition, setHoverPosition] = useState(null);
    const blockRef = useRef(null);

    const launch = allLaunches.find(singleLaunch => singleLaunch.id === id);

    let displayNumber = launchConverter(id, allLaunches, 0);

    if (launch) {
      upcoming = launch.upcoming;

      let targetCore = null;
      if (Array.isArray(launch.cores) && launch.cores.length > 0) {
        if (coreSerial) {
          targetCore = launch.cores.find(core => core.core === coreSerial) || launch.cores[0];
        } else {
          targetCore = launch.cores[0];
        }
      }

      if (targetCore) {
        landing_attempt = targetCore.landing_attempt;
        landing_success = targetCore.landing_success;
        landing_type = targetCore.landing_type;
      }
    }

    if (launch && launch.cores && launch.cores[0]) {
      const serial = launch.cores[0].core;
      const isStarship = serial && (serial.startsWith('SN') || serial === 'Starhopper' || serial.startsWith('Booster'));

      if (isStarship) {
        const name = launch.name || '';
        let label = '';

        const snMatch = name.match(/\bSN(\d+)\b/i);
        if (snMatch) {
          label = `SN${snMatch[1]}`;
        } else {
          const flightMatch = name.match(/Flight\s*(\d+)/i);
          const testMatch = name.match(/Test\s*(\d+)/i);

          if (flightMatch && flightMatch[1]) {
            label = flightMatch[1];
          } else if (testMatch && testMatch[1]) {
            label = testMatch[1];
          } else if (/Test\b/i.test(name)) {
            label = '1';
          }
        }

        displayNumber = label;
      }
    }

    // console.log(launchConverter(id, allLaunches, 2));

    const handleMouseEnter = () => {
      const el = blockRef.current;
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const tooltipWidth = 120;
      const tooltipHeight = 120;
      const margin = 8;

      let left = rect.right + margin;
      if (rect.right + margin + tooltipWidth > viewportWidth && rect.left - margin - tooltipWidth >= 0) {
        left = rect.left - margin - tooltipWidth;
      } else if (rect.right + margin + tooltipWidth > viewportWidth && rect.left - margin - tooltipWidth < 0) {
        left = Math.max(margin, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, viewportWidth - tooltipWidth - margin));
      }

      let top = rect.top + rect.height / 2 - tooltipHeight / 2;
      if (top < margin) {
        top = margin;
      }
      if (top + tooltipHeight + margin > viewportHeight) {
        top = viewportHeight - tooltipHeight - margin;
      }

      setHoverPosition({ top, left });
    };

    if (upcoming === true) {
      classname = 'boosterPage-launchBlock-upcoming'
    } else if (landing_attempt === false) {
      classname = 'boosterPage-launchBlock-noattempt'
    } else if (landing_success === false) {
      classname = 'boosterPage-launchBlock-fail'
    } else if (landing_type === 'Ocean') {
      classname = 'boosterPage-launchBlock-ocean'
    } else if (landing_type === 'RTLS') {
      classname = 'boosterPage-launchBlock-RTLS'
    } else if (landing_type === 'ASDS') {
      classname = 'boosterPage-launchBlock-ASDS'
    } else {
      classname = 'boosterPage-launchBlock-ASDS'
    }

    return (
      <div className='hover-test'>
        <div
          ref={blockRef}
          className={`${classname} boosterPage-launchBlock`}
          onMouseEnter={handleMouseEnter}
        >
          {displayNumber}

          <div
            className='boosterPage-hoverBox'
            style={hoverPosition ? { top: hoverPosition.top, left: hoverPosition.left } : undefined}
          >

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

  const parseBoosterNumber = (serial) => {
    if (!serial) {
      return -Infinity;
    }
    const matches = serial.match(/\d+/g);
    if (!matches || matches.length === 0) {
      return -Infinity;
    }
    return parseInt(matches[matches.length - 1], 10);
  }

  const getBoosterStatus = (core) => {
    // Logic to override status based on the last launch
    if (!core.launches || core.launches.length === 0) return core.status;

    const lastLaunchId = core.launches[core.launches.length - 1];
    const lastLaunch = allLaunches.find(l => l.id === lastLaunchId);

    if (!lastLaunch) return core.status;

    let targetCore = null;
    if (Array.isArray(lastLaunch.cores) && lastLaunch.cores.length > 0) {
      if (core.serial) {
        targetCore = lastLaunch.cores.find(c => c.core === core.serial) || lastLaunch.cores[0];
      } else {
        targetCore = lastLaunch.cores[0];
      }
    }

    if (!targetCore) return core.status;

    const { landing_attempt, landing_success, landing_type } = targetCore;

    // If upcoming, use original status (it hasn't failed yet)
    if (lastLaunch.upcoming) return core.status;

    // "All Landing not Attempt and Land on Ocean and Landing Fail boosters should be LOST"
    if (landing_attempt === false) return 'lost';
    if (landing_success === false) return 'lost';
    if (landing_type === 'Ocean') return 'lost';

    return core.status;
  }

  const sortedCores = (() => {
    const starship = [];
    const falcon = [];

    coresData.forEach(core => {
      if (core.serial.startsWith('Booster') || core.serial.startsWith('SN') || core.serial === 'Starhopper') {
        starship.push(core);
      } else {
        falcon.push(core);
      }
    });

    const f1Legacy = [];
    const otherFalcon = [];

    falcon.forEach(core => {
      if (core.serial && core.serial.startsWith('F1 B000')) {
        f1Legacy.push(core);
      } else {
        otherFalcon.push(core);
      }
    });

    const sortedOtherFalcon = otherFalcon.slice(0).sort((a, b) => parseBoosterNumber(b.serial) - parseBoosterNumber(a.serial));
    const sortedF1Legacy = f1Legacy.slice(0).sort((a, b) => parseBoosterNumber(b.serial) - parseBoosterNumber(a.serial));

    return [...starship.slice(0).reverse(), ...sortedOtherFalcon, ...sortedF1Legacy];
  })();

  return (
    <div>
      <div className='boosterPage-topRow'>
        <Legend />
        <button className='boosterPage-downloadButton' onClick={handleDownloadImage}>
          Download Image
        </button>
      </div>
      <ScrollButtons id='boosterPage' x={55} />
      <div className='boosterPage' id="boosterPage">

        {/* <button onClick={() => onClickRight()}>L</button> */}



        {sortedCores.map((core) => {
          const finalStatus = getBoosterStatus(core);
          return (
            <div className='boosterPage-core'>


              <div className={
                finalStatus === 'active' ? 'boosterPage-status boosterPage-status-active'
                  : finalStatus === 'unknown' ? 'boosterPage-status boosterPage-status-unknown'
                    : finalStatus === 'expended' ? 'boosterPage-status boosterPage-status-expended'
                      : finalStatus === 'inactive' ? 'boosterPage-status boosterPage-status-inactive'
                        : 'boosterPage-status boosterPage-status-lost'
              }>
                {statusConverter(finalStatus)}
              </div>

              <div className='boosterPage-name'>
                {core.serial}
              </div>

              <div className='boosterPage-count'>
                {/* {core.reuse_count + 1} */}
                {core.launches.length}
              </div>

              <div>
                {core.launches.map((launch, index) => {
                  let turnaroundElement = null;
                  if (showTurnaround && index > 0) {
                    const prevLaunchId = core.launches[index - 1];
                    const currentLaunchId = launch;
                    const prevDate = getLaunchDate(prevLaunchId);
                    const currDate = getLaunchDate(currentLaunchId);

                    if (prevDate && currDate) {
                      const diffTime = Math.abs(currDate - prevDate);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      const color = getTurnaroundColor(diffDays);
                      turnaroundElement = <div className="turnaround-display" style={{ borderColor: color, color: color }}>{diffDays}</div>
                    }
                  }
                  return (
                    <div key={launch}>
                      {turnaroundElement}
                      <LaunchBlock id={launch} coreSerial={core.serial} />
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

export default BoostersStatus
