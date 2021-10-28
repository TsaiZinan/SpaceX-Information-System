import React, { Component } from 'react'
import { ReactComponent as RocketIcon } from './rocket.svg'
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css";
import './TimelinePage.css'
import { SiReddit, SiYoutube, SiWikipedia, SiSpacex } from "react-icons/si";

import { LatestLaunch, Cores, AllLaunches } from '../../data'


// const rocketInfo = AllLaunches

// const aaa = AllLaunches[0]

// console.log(aaa.links.patch.small)




let RocketIconStyles = { background: "#06D6A0" };
function TimelinePage() {
  return (
    <div className='TimelinePage'>
      <div className='PageTitle'>
        <h1>TIMELINE</h1>


        {/* {AllLaunches.map((singleLaunch) => {
          console.log(singleLaunch.links.patch.small)
          return(
            <div>
              <img src={singleLaunch.links.patch.small} alt="" />
              <p>{singleLaunch.name}</p>
            {console.log(singleLaunch.name)}
            </div>
          )
        })} */}

      </div>

      <VerticalTimeline>
        {
          AllLaunches.map((singleLaunch) => {
            // let showButton = element.buttonText !== undefined &&
            //   element.buttonText !== null &&
            //   element.buttonText !== "";

            return (
              <VerticalTimelineElement
                key={singleLaunch.flight_number}
                date={singleLaunch.date_utc}
                dateClassName="date"
                iconStyle={RocketIconStyles}
                icon={<RocketIcon />}
              >
                <img src={singleLaunch.links.patch.small} alt="" />
                <h3 className="vertical-timeline-element-title">
                  {singleLaunch.name}
                </h3>

                <h5 className="vertical-timeline-element-subtitle">
                  {singleLaunch.launchpad}
                </h5>

                <p id="description">
                  {singleLaunch.details}
                </p>


                <a
                  className="Button"
                  href={singleLaunch.links.webcast}
                >  <SiYoutube />
                  {/* {element.buttonText} */}
                </a>
                {/* <a href="https://www.google.com"><SiWikipedia /></a>
               */}
                <a
                  className="Button"
                  href={singleLaunch.links.wikipedia}
                >  <SiWikipedia />
                  {/* {element.buttonText} */}
                </a>
     



              </VerticalTimelineElement>
            )
          })
        }

      </VerticalTimeline>



    </div>
  );
}

export default TimelinePage
