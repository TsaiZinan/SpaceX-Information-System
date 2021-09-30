import React from 'react'

import './Timeline.css'

import { TimelineData } from './timelineData'

const Timeline = () => {
  const year = TimelineData[0].year


  return (
    <div>
      timeline?
      <p>{TimelineData[0].country}</p>
      <div>
        {[...Array(TimelineData[0].country)].map((x, i) => (
          <div className="year">
            {[...Array(year * 12)].map((x, i) =>
              (<p>|</p>)
            )}
          </div>
        ))}
      </div>

    </div>
  )
}

export default Timeline
