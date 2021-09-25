import React from 'react'
import { LatestLaunch, Cores } from '../data'

const Test = () => {
  const Latest = LatestLaunch[0];
  const core = Cores;

  return (
    <div>
      {/* {console.log(Latest.flight_number)} */}
      <p>Last Launch</p>
      <p>flight number: {Latest.flight_number}</p>
      <p>name: {Latest.name}</p>
      <p>core: {Latest.cores[0].core}</p>
      <p>detail: {Latest.details}</p>
      <img src={Latest.links.patch.small} alt="" />
      {/* <div>
        <iframe 
          // width="100%" 
          // height="100%" 
          src={`https://www.youtube.com/embed/${Latest.links.youtube_id}`} 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      </div> */}

      {/* {console.log(core)} */}
      {core.map((singleCore, coreIndex) => {
        // singleCore.id === Latest.cores[0].core ? <div>1</div> : ' '
        if (singleCore.id === Latest.cores[0].core) {
          console.log('Yes')
          console.log(singleCore.serial)
          return (
            <div>{singleCore.serial}</div>
          )
        } else {
          // console.log('No')
        }
        // {console.log(singleCore.id + Latest.cores[0].core)}
      })}
    </div>
  )
}

export default Test
