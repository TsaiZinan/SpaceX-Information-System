import React, { Component } from 'react'
import { ReactComponent as RocketIcon } from './rocket.svg'
import {VerticalTimeline,VerticalTimelineElement} from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css";

let timelineElements = [
  {
    id: 1,
    title: "Developer",
    location: "Dragontail, Ascana",
    description:
      "Converting data to a graphical interface, through the use of HTML, CSS, and JavaScript, so that users can view and interact with that data.",
    buttonText: "View Frontend Projects",
    date: " 2016 - present",
    icon: "RocketIcon",
  },
  {
    id: 2,
    title: "Developer",
    location: "Skystead, Craonia",
    description:
      "Working hand-in-hand with front-end developers by providing the outward facing web application elements server-side logic. Creating the logic to make the web app function properly, and accomplishing this through the use of server-side scripting languages.",
    buttonText: "View Backend Projects",
    date: "June 2013 - August 2016",
    icon: "RocketIcon",
  },
  {
    id: 3,
    title: "Engineer",
    location: "South Warren, Geshington",
    description:
      "Assessing the quality of specifications and technical design documents in order to ensure timely, relevant and meaningful feedback.",
    buttonText: "Company Website",
    date: "September 2011 - June 2013",
    icon: "RocketIcon",
  },
  {
    id: 4,
    title: "College",
    location: "South Warren, Geshington",
    description:
      "Online Course in Magical Beasts and Wonders of the World - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec scelerisque sagittis tellus, non ultrices lacus tempus vel.",
    buttonText: "Course Certificate",
    date: "September 2011",
    icon: "RocketIcon",
  },
  {
    id: 5,
    title: "College",
    location: "Skystead, Craonia",
    description:
      "College - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec scelerisque sagittis tellus, non ultrices lacus tempus vel.",
    buttonText: "College Projects",
    date: "2007 - 2011",
    icon: "RocketIcon",
  },
  {
    id: 6,
    title: "School",
    location: "Dragontail, Ascana",
    description:
      "Highschool - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec scelerisque sagittis tellus, non ultrices lacus tempus vel.",
    date: "2003 - 2007",
    icon: "RocketIcon",
  },
];



let RocketIconStyles = {background: "#06D6A0"};
function TimelinePage () {
  return (
    <div className='TimelinePage'>
     <div className = 'PageTitle'>
       <h1>Timeline</h1>
       </div> 
     <VerticalTimeline>
       {
         timelineElements.map(element =>{
           return(
               <VerticalTimelineElement
                key={element.key}
                date={element.date}
                dateClassName="date"
                iconStyle={RocketIconStyles}        
                icon={<RocketIcon/>}
               >

              <h3 className = "vertical-timeline-element-title">
              {element.title} 
              </h3>

              <h5 className = "vertical-timeline-element-subtitle">
                {element.location}
              </h5>

              <p>{element.description}</p>

               </VerticalTimelineElement>
           )
         })
       }

     </VerticalTimeline>

    
    </div>
  );
}

export default TimelinePage
