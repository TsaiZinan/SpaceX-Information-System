import React, { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import './SitesPage.css'

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

const SitesPage = (props) => {
  const launchesWithDate = useMemo(() => {
    const allLaunches = Array.isArray(props.launches) ? props.launches : [];
    return allLaunches
      .filter(launch => launch && launch.date_utc)
      .map(launch => new Date(launch.date_utc).getTime())
      .filter(time => Number.isFinite(time));
  }, [props.launches]);

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
      // Custom order: Omelek Island and Orbital Launch Pad 1 at the end
      const specialPads = ['Omelek Island', 'Orbital Launch Pad 1'];
      const aSpecial = specialPads.includes(a);
      const bSpecial = specialPads.includes(b);

      if (aSpecial && !bSpecial) return 1;
      if (!aSpecial && bSpecial) return -1;
      if (aSpecial && bSpecial) {
         return specialPads.indexOf(a) - specialPads.indexOf(b);
      }

      const aUnknown = a === 'Unknown';
      const bUnknown = b === 'Unknown';
      if (aUnknown && !bUnknown) return 1;
      if (!aUnknown && bUnknown) return -1;
      return String(a).localeCompare(String(b));
    });
  }, [launchesWithSite]);

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
    // Align start to the beginning of the week (e.g. Monday)
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    start.setDate(diff);

    const end = new Date(max);
    end.setHours(0, 0, 0, 0);
    // Align end to the end of the week (next Sunday)
    const endDay = end.getDay();
    const endDiff = end.getDate() - endDay + (endDay === 0 ? 0 : 7);
    end.setDate(endDiff);


    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalWeeks = Math.max(1, Math.ceil(diffTime / MS_PER_WEEK) + 1);
    const pixelsPerWeek = 50;
    const height = totalWeeks * pixelsPerWeek;

    return { start: start.getTime(), end: end.getTime(), pixelsPerWeek, height };
  }, [launchesWithDate]);

  const axisTicks = useMemo(() => {
    if (!timeline) return [];

    const ticks = [];
    const start = new Date(timeline.start);
    const end = new Date(timeline.end);
    
    // Generate weekly ticks
    // We want ticks for every week. Let's iterate from end down to start.
    const cursor = new Date(end.getTime());
    
    // Helper to get Year-Week
    const getYearWeek = (d) => {
        const date = new Date(d.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        const week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    };

    while (cursor.getTime() >= start.getTime()) {
      const time = cursor.getTime();
      const d = new Date(time);
      
      // ISO Week calculation logic roughly
      // But simpler formatting: YYYY-Www
      const year = d.getFullYear();
      // Simple week number approximation or use a library if available.
      // Since we don't have moment/date-fns, let's stick to a simple label or the helper above.
      // Actually, let's use the helper but be careful about year boundaries.
      // The helper above returns week number.
      
      // Let's just use a simple approach: Year + Week Index relative to year start?
      // Or just standard ISO week.
      const weekNum = getYearWeek(d);
      // Adjust year if week 1 is in December or week 52/53 is in January.
      // The helper uses the year of the Thursday.
      const targetDate = new Date(d.getTime());
      targetDate.setDate(targetDate.getDate() + 3 - (targetDate.getDay() + 6) % 7);
      const targetYear = targetDate.getFullYear();
      
      const label = `${targetYear}-W${String(weekNum).padStart(2, '0')}`;
      
      let kind = 'week';
      if (d.getDate() <= 7) kind = 'month'; 
      
      ticks.push({ time, label, kind });
      
      cursor.setDate(cursor.getDate() - 7);
    }
    
    return ticks;
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

  const columnWidths = useMemo(() => {
    if (!timeline) return {};
    const widths = {};
    padIds.forEach(padId => {
      const launches = launchesByPad[padId] || [];
      const weekStack = {};
      let maxStack = 0;
      
      launches.forEach(launch => {
         const weekIndex = Math.floor((timeline.end - launch._time) / MS_PER_WEEK);
         const key = String(weekIndex);
         const stackIndex = weekStack[key] || 0;
         weekStack[key] = stackIndex + 1;
         if (stackIndex + 1 > maxStack) maxStack = stackIndex + 1;
      });
      
      // Calculate width
      // item width 35, gap 20. Stride = 55.
      // Offset = 5px.
      // left = stackIndex * 55 + 5
      // right edge = left + 35 = stackIndex * 55 + 5 + 35 = stackIndex * 55 + 40
      // max right edge = (maxStack - 1) * 55 + 40
      // Add right padding 5px.
      // Total required width = (maxStack - 1) * 55 + 45.
      
      const minStack = 4;
      const effectiveStack = Math.max(maxStack, minStack);
      
      let width = (effectiveStack - 1) * 55 + 45;
      
      widths[padId] = width;
    });
    return widths;
  }, [padIds, launchesByPad, timeline]);

  const getPadCode = (padId) => {
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
      left: `${stackIndex * 55 + 5}px`, // 35px width + 20px gap = 55px per item + 5px padding
      transform: `translateY(-50%)`
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
                const weekIndex = Math.floor((timeline.end - tick.time) / MS_PER_WEEK);
                const offsetPx = weekIndex * timeline.pixelsPerWeek;
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
              <div key={padId} className='sitesPage-column' style={{ width: columnWidths[padId], minWidth: columnWidths[padId] }}>
                <div className={`sitesPage-timeline ${padIndex === 0 ? 'sitesPage-timeline-first' : ''}`} style={{ height: timeline.height }}>
                  {launches.map(launch => {
                    const weekIndex = Math.floor((timeline.end - launch._time) / MS_PER_WEEK);
                    const offsetPx = weekIndex * timeline.pixelsPerWeek;
                    const key = String(weekIndex);
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
