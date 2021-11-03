import React, { useState, useEffect } from 'react'
import { LatestLaunch, Cores } from '../data'

const Test = (props) => {

  let all = props.launches



  // useEffect(() => {
  //   setAll(props.launches)
  //   console.log('.........effect')
  // }, [props.launches])

  // if (all.length > 1) {
  //   console.log(props.launches)

  //   return (
  //     <div>
  //       {all.map((launch) => {
  //         return (
  //           <div>
  //             {launch.links.patch.small}
  //           </div>
  //         )
  //       })}
  //       GOT
  //     </div>
  //   )
  // }

  return (
    <div>
      {all.map((launch) => {
        return (
          <div>
            {/* <img src={launch.links.patch.small} alt="" /> */}
            {launch.links.patch.small}
          </div>
        )
      })}
      GOT
    </div>
  )
}

export default Test
