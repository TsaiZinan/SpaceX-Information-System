import React, { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";
import html2canvas from 'html2canvas'

import { launchPath } from '../../launchPath'

import './BoostersStatus.css'

const Legend = ({ showTurnaround, setShowTurnaround }) => {
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
          <div> Landing failed </div>
        </div>
        <div className='legend-block-unit'>
          <div className='legend-singleBlock legend-statusBlock boosterPage-launchBlock-ocean'></div>
          <div> Ocean landing </div>
        </div>
        <div className='legend-block-unit'>
          <div className='legend-singleBlock legend-statusBlock boosterPage-launchBlock-noattempt'></div>
          <div> No landing attempt </div>
        </div>
        <div className='legend-block-unit'>
          <div className='legend-singleBlock legend-statusBlock boosterPage-launchBlock-RTLS'></div>
          <div> Return to launch site </div>
        </div>
        <div className='legend-block-unit'>
          <div className='legend-singleBlock legend-statusBlock boosterPage-launchBlock-ASDS'></div>
          <div> Drone ship landing </div>
        </div>
        <div className='legend-block-unit'>
          <div className='legend-singleBlock legend-statusBlock boosterPage-launchBlock-unknown'></div>
          <div> Landing unknown </div>
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
      <button aria-label="Scroll cores left" onClick={moveLeft}><VscArrowLeft /></button>
      <button aria-label="Scroll cores right" onClick={moveRight}><VscArrowRight /></button>
    </div>
  )
}

const LaunchBlock = ({ launch, coreSerial }) => {
  const [hoverPosition, setHoverPosition] = useState(null);
  const blockRef = useRef(null);
  if (!launch) return null;

  const core = (launch.cores || []).find(stage => stage.core === coreSerial);
  let displayNumber = launch.flight_number;

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

  let classname = 'boosterPage-launchBlock-unknown';
  if (launch.upcoming) {
    classname = 'boosterPage-launchBlock-upcoming';
  } else if (core?.landing_attempt === false) {
    classname = 'boosterPage-launchBlock-noattempt';
  } else if (core?.landing_success === false) {
    classname = 'boosterPage-launchBlock-fail';
  } else if (core?.landing_success === true) {
    if (core.landing_type === 'Ocean') classname = 'boosterPage-launchBlock-ocean';
    if (core.landing_type === 'RTLS') classname = 'boosterPage-launchBlock-RTLS';
    if (core.landing_type === 'ASDS') classname = 'boosterPage-launchBlock-ASDS';
  }

  return (
    <Link
      ref={blockRef}
      to={launchPath(launch.id)}
      className={`${classname} boosterPage-launchBlock`}
      aria-label={`${coreSerial}: ${launch.name}`}
      onFocus={handleMouseEnter}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHoverPosition(null)}
      onBlur={() => setHoverPosition(null)}
    >
      {displayNumber || '·'}
      {hoverPosition && (
        <span className="boosterPage-hoverBox" aria-hidden="true" style={hoverPosition}>
          {launch.links?.patch?.small && <img className="boosterPage-hoverBox-img" src={launch.links.patch.small} alt="" />}
          <span className="boosterPage-hoverBox-time">{launch.date_utc?.slice(0, 10)}</span>
          <span className="boosterPage-hoverBox-name">{launch.name}</span>
        </span>
      )}
    </Link>
  );
}

const BoostersStatus = ({ cores: coresData, launches: allLaunches, loadState = 'ready' }) => {
  const launchesById = useMemo(() => new Map(allLaunches.map(launch => [launch.id, launch])), [allLaunches]);
  const [showTurnaround, setShowTurnaround] = useState(false);

  const [exportState, setExportState] = useState('idle');

  const handleDownloadImage = async () => {
    const element = document.getElementById('boosterPage');
    if (!element || exportState === 'saving') return;
    const width = element.scrollWidth;
    setExportState('saving');
    try {
      const canvas = await html2canvas(element, {
        width,
        height: element.scrollHeight,
        scale: 1,
        useCORS: true,
        backgroundColor: getComputedStyle(element).backgroundColor,
        onclone: documentClone => {
          const board = documentClone.getElementById('boosterPage');
          board.style.width = width + 'px';
          board.style.boxSizing = 'border-box';
          board.style.overflow = 'visible';
          board.scrollLeft = 0;
        },
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'boosters.png';
      link.click();
      setExportState('idle');
    } catch {
      setExportState('error');
    }
  };

  const getLaunchDate = (id) => {
    const launch = launchesById.get(id);
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

  const statusConverter = (input) => {

    switch (input) {
      case 'active':
        return 'ACT';

      case 'inactive':
        return 'INACT';

      case 'unknown':
        return 'UNKN';

      case 'expended':
        return 'EXPD';

      case 'lost':
        return 'LOST';

      default:
        return 'UNKN';
    }
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
    const lastLaunch = launchesById.get(lastLaunchId);

    if (!lastLaunch) return core.status;

    let targetCore = null;
    if (Array.isArray(lastLaunch.cores) && lastLaunch.cores.length > 0) {
      if (core.serial) {
        targetCore = lastLaunch.cores.find(c => c.core === core.serial);
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

  if (!coresData.length) {
    let message = 'No cores to display.';
    if (loadState === 'loading') message = 'Loading core data…';
    if (loadState === 'error') message = 'Core data could not be loaded. Refresh to try again.';
    return <p className="boosterPage-message" role="status">{message}</p>;
  }

  return (
    <div>
      <div className='boosterPage-topRow'>
        <Legend showTurnaround={showTurnaround} setShowTurnaround={setShowTurnaround} />
        <div className="boosterPage-download">
          <button className='boosterPage-downloadButton' disabled={exportState === 'saving'} onClick={handleDownloadImage}>
            {exportState === 'saving' ? 'Saving image…' : 'Download Image'}
          </button>
          {exportState === 'error' && <p role="status">Image could not be saved. Try again.</p>}
        </div>
      </div>
      <ScrollButtons id='boosterPage' x={55} />
      <div className='boosterPage' id="boosterPage">

        {/* <button onClick={() => onClickRight()}>L</button> */}



        {sortedCores.map((core) => {
          const finalStatus = getBoosterStatus(core);
          return (
            <div className='boosterPage-core' key={core.serial}>


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
                      <LaunchBlock launch={launchesById.get(launch)} coreSerial={core.serial} />
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
