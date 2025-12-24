import React, { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import './SitesPage.css'

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const SitesPage = (props) => {
  const launchesWithDate = useMemo(() => {
    const allLaunches = Array.isArray(props.launches) ? props.launches : [];
    return allLaunches
      .filter(launch => launch && launch.date_utc)
      .map(launch => new Date(launch.date_utc).getTime())
      .filter(time => Number.isFinite(time));
  }, [props.launches]);

  const launchpadsById = useMemo(() => {
    const allLaunchpads = Array.isArray(props.launchpads) ? props.launchpads : [];
    const map = {};
    allLaunchpads.forEach(pad => {
      if (pad && pad.id) map[pad.id] = pad;
    });
    return map;
  }, [props.launchpads]);

  const launchesWithSite = useMemo(() => {
    const allLaunches = Array.isArray(props.launches) ? props.launches : [];
    return allLaunches
      .filter(launch => launch && launch.date_utc)
      .map(launch => ({
        ...launch,
        _padId: launch && launch.launchpad ? launch.launchpad : 'Unknown',
        _time: new Date(launch.date_utc).getTime()
      }))
      .filter(launch => Number.isFinite(launch._time));
  }, [props.launches]);

  const padIds = useMemo(() => {
    const ids = new Set();
    launchesWithSite.forEach(launch => {
      if (launch._padId) ids.add(launch._padId);
    });
    return Array.from(ids).sort((a, b) => {
      const aUnknown = a === 'Unknown';
      const bUnknown = b === 'Unknown';
      if (aUnknown && !bUnknown) return 1;
      if (!aUnknown && bUnknown) return -1;
      const aName = (launchpadsById[a] && launchpadsById[a].name) ? launchpadsById[a].name : a;
      const bName = (launchpadsById[b] && launchpadsById[b].name) ? launchpadsById[b].name : b;
      return String(aName).localeCompare(String(bName));
    });
  }, [launchesWithSite, launchpadsById]);

  const timeline = useMemo(() => {
    if (!launchesWithDate.length) return null;

    let min = launchesWithDate[0];
    let max = launchesWithDate[0];
    launchesWithDate.forEach(time => {
      if (time < min) min = time;
      if (time > max) max = time;
    });

    const start = new Date(min);
    start.setHours(0, 0, 0, 0);
    const end = new Date(max);
    end.setHours(0, 0, 0, 0);

    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY) + 1);
    const pixelsPerDay = 5;
    const height = totalDays * pixelsPerDay;

    return { start: start.getTime(), end: end.getTime(), pixelsPerDay, height };
  }, [launchesWithDate]);

  const axisTicks = useMemo(() => {
    if (!timeline) return [];

    const ticks = [];
    const start = new Date(timeline.start);
    const end = new Date(timeline.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const monthCursor = new Date(start.getTime());
    monthCursor.setDate(1);
    monthCursor.setHours(0, 0, 0, 0);

    if (monthCursor.getTime() < start.getTime()) {
      monthCursor.setMonth(monthCursor.getMonth() + 1);
    }

    const format = (time) => {
      const d = new Date(time);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    ticks.push({ time: end.getTime(), label: format(end.getTime()), kind: 'edge' });

    while (monthCursor.getTime() <= end.getTime()) {
      const time = monthCursor.getTime();
      if (time >= start.getTime() && time <= end.getTime()) {
        const y = monthCursor.getFullYear();
        const m = String(monthCursor.getMonth() + 1).padStart(2, '0');
        ticks.push({ time, label: `${y}-${m}`, kind: 'month' });
      }
      monthCursor.setMonth(monthCursor.getMonth() + 1);
    }

    ticks.push({ time: start.getTime(), label: format(start.getTime()), kind: 'edge' });

    const seen = new Set();
    return ticks.filter(t => {
      const key = String(t.time);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [timeline]);

  const launchesByPad = useMemo(() => {
    const map = {};
    padIds.forEach(id => {
      map[id] = [];
    });
    launchesWithSite.forEach(launch => {
      const key = launch._padId || 'Unknown';
      if (!map[key]) map[key] = [];
      map[key].push(launch);
    });
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => b._time - a._time);
    });
    return map;
  }, [launchesWithSite, padIds]);

  const getPadCode = (padId) => {
    const pad = launchpadsById[padId];
    if (pad && pad.name) return pad.name;
    return padId;
  };

  const getDisplayNumber = (launch) => {
    if (launch.flight_number) return launch.flight_number;

    const name = String(launch.name || '');
    const snMatch = name.match(/\bSN(\d+)\b/i);
    if (snMatch) return `SN${snMatch[1]}`;

    const flightMatch = name.match(/Flight\s*(\d+)/i);
    if (flightMatch && flightMatch[1]) return flightMatch[1];

    const testMatch = name.match(/Test\s*(\d+)/i);
    if (testMatch && testMatch[1]) return testMatch[1];

    if (/Test\b/i.test(name)) return '1';
    return '';
  };

  const getLaunchBlockClass = (launch) => {
    const core = launch.cores && launch.cores[0] ? launch.cores[0] : null;
    const upcoming = Boolean(launch.upcoming);

    if (upcoming) return 'boosterPage-launchBlock-upcoming';
    if (!core) return 'boosterPage-launchBlock-noattempt';

    const landingAttempt = core.landing_attempt;
    const landingSuccess = core.landing_success;
    const landingType = core.landing_type;

    if (landingAttempt === false) return 'boosterPage-launchBlock-noattempt';
    if (landingSuccess === false) return 'boosterPage-launchBlock-fail';
    if (landingType === 'Ocean') return 'boosterPage-launchBlock-ocean';
    if (landingType === 'RTLS') return 'boosterPage-launchBlock-RTLS';
    if (landingType === 'ASDS') return 'boosterPage-launchBlock-ASDS';
    return 'boosterPage-launchBlock-ASDS';
  };

  const SiteLaunchMarker = (markerProps) => {
    const launch = markerProps.launch;
    const offsetPx = markerProps.offsetPx;
    const stackIndex = markerProps.stackIndex;

    const [hoverPosition, setHoverPosition] = useState(null);
    const blockRef = useRef(null);

    const handleMouseEnter = () => {
      const el = blockRef.current;
      if (!el) return;

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
      if (top < margin) top = margin;
      if (top + tooltipHeight + margin > viewportHeight) top = viewportHeight - tooltipHeight - margin;

      setHoverPosition({ top, left });
    };

    const number = getDisplayNumber(launch);
    const wrapperStyle = {
      top: offsetPx,
      left: '50%',
      transform: `translate(-50%, -50%) translateX(${stackIndex * 12}px)`
    };

    const content = (
      <div
        ref={blockRef}
        className={`${getLaunchBlockClass(launch)} boosterPage-launchBlock`}
        onMouseEnter={handleMouseEnter}
      >
        {number}
        <div className='boosterPage-hoverBox' style={hoverPosition ? { top: hoverPosition.top, left: hoverPosition.left } : undefined}>
          <div className='boosterPage-hoverBox-imgDiv'>
            <img className='boosterPage-hoverBox-img' src={launch.links && launch.links.patch ? launch.links.patch.small : ''} alt="" />
          </div>
          <div className='boosterPage-hoverBox-time'>
            {String(launch.date_utc || '').substring(0, 10)}
          </div>
          <div className='boosterPage-hoverBox-name'>
            {launch.name}
          </div>
        </div>
      </div>
    );

    if (launch.flight_number) {
      return (
        <div className='sitesPage-marker' style={wrapperStyle}>
          <Link to={`/launch/${launch.flight_number}`} className='sitesPage-markerLink'>
            {content}
          </Link>
        </div>
      );
    }

    return (
      <div className='sitesPage-marker' style={wrapperStyle}>
        {content}
      </div>
    );
  };

  if (!timeline || !padIds.length) {
    return (
      <div className='sitesPage'>
        <div className='intro'>
          <div className='intro-title'>Sites</div>
          <div className='intro-text'>No launch site data available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className='sitesPage'>
        <div className='intro'>
          <div className='intro-title'>Sites</div>
          <div className='intro-text'>Launches by site on a vertical timeline.</div>
        </div>

      <div className='sitesPage-gridWrapper'>
        <div className='sitesPage-gridHeader'>
          <div className='sitesPage-axisHeaderCell'>Date</div>
          {padIds.map(padId => (
            <div key={padId} className='sitesPage-headerCell'>
              {getPadCode(padId)}
            </div>
          ))}
        </div>

        <div className='sitesPage-gridBody'>
          <div className='sitesPage-axisColumn'>
            <div className='sitesPage-axisTimeline' style={{ height: timeline.height }}>
              {axisTicks.map(tick => {
                const dayIndex = Math.floor((timeline.end - tick.time) / MS_PER_DAY);
                const offsetPx = dayIndex * timeline.pixelsPerDay;
                return (
                  <div key={tick.time} className={`sitesPage-axisTick sitesPage-axisTick-${tick.kind}`} style={{ top: offsetPx }}>
                    <div className='sitesPage-axisLine' />
                    <div className='sitesPage-axisLabel'>{tick.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {padIds.map((padId, padIndex) => {
            const launches = launchesByPad[padId] || [];
            const dayStack = {};

            return (
              <div key={padId} className='sitesPage-column'>
                <div className={`sitesPage-timeline ${padIndex === 0 ? 'sitesPage-timeline-first' : ''}`} style={{ height: timeline.height }}>
                  {launches.map(launch => {
                    const dayIndex = Math.floor((timeline.end - launch._time) / MS_PER_DAY);
                    const offsetPx = dayIndex * timeline.pixelsPerDay;
                    const key = String(dayIndex);
                    const stackIndex = dayStack[key] || 0;
                    dayStack[key] = stackIndex + 1;

                    return (
                      <SiteLaunchMarker
                        key={launch.id}
                        launch={launch}
                        offsetPx={offsetPx}
                        stackIndex={stackIndex}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default SitesPage
