import React, { Component } from 'react'
import { ReactComponent as RocketIcon } from './rocket.svg'
import {VerticalTimeline,VerticalTimelineElement} from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css";
import './TimelinePage.css'
import { SiReddit, SiYoutube, SiWikipedia, SiSpacex } from "react-icons/si";


let timelineElements = [
  {
    id: 1,
    title: "Launch 1",
    location: "Dragontail, Ascana",
    description:
      "Converting data to a graphical interface, through the use of HTML, CSS, and JavaScript, so that users can view and interact with that data.",
    buttonText: "Wikipedia",
    date: " 2016 - present",
    icon: "RocketIcon",
  },
  {
    id: 2,
    title: "Launch 2",
    location: "Skystead, Craonia",
    description:
      "Working hand-in-hand with front-end developers by providing the outward facing web application elements server-side logic. Creating the logic to make the web app function properly, and accomplishing this through the use of server-side scripting languages.",
    buttonText: "Wikipedia",
    date: "June 2013 - August 2016",
    icon: "RocketIcon",
  },
  {
    id: 3,
    title: "Launch 3",
    location: "South Warren, Geshington",
    description:
      "Assessing the quality of specifications and technical design documents in order to ensure timely, relevant and meaningful feedback.",
    buttonText: "Wikipedia",
    date: "September 2011 - June 2013",
    icon: "RocketIcon",
  },
  {
    id: 4,
    title: "Launch 4",
    location: "South Warren, Geshington",
    description:
      "Online Course in Magical Beasts and Wonders of the World - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec scelerisque sagittis tellus, non ultrices lacus tempus vel.",
    buttonText: "Wikipedia",
    date: "September 2011",
    icon: "RocketIcon",
  },

];



let RocketIconStyles = {background: "#06D6A0"};
function TimelinePage () {
  return (
    <div className='TimelinePage'>
     <div className = 'PageTitle'>
       <h1>TIMELINE</h1>
       </div> 
     <VerticalTimeline>
       {
         timelineElements.map((element) =>{
           let showButton = element.buttonText !== undefined && 
           element.buttonText !== null && 
           element.buttonText !== "";
           
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

              <p id ="description">
                {element.description}
              </p>

        
              {showButton && 
              <a 
               className ="Button"
               href="/"
              >
              {element.buttonText}</a>}
              

           {/*{showButton && 
          <a href={wikipedia}>
          <SiWikipedia className='launch-hoverBox-link' />
          </a>}*/}

               </VerticalTimelineElement>
           )
         })
       }

     </VerticalTimeline>

    
    </div>
  );
}

export default TimelinePage
