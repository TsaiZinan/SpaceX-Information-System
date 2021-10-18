import React from 'react'

import { useState } from 'react'

import './StyleTest.css'


const StyleTest = () => {
  const [myBackgroundColor, setMyBackgroundColor] = useState(['#f7c843'])

  return (
    <div
      className='test-page'
      style={{ backgroundColor: myBackgroundColor }}
    >
      {myBackgroundColor}

      <div>
        <form className='hexForm' action="">

          HEX:
          <input
            type="text"
            name="hex"
            onChange={event => setMyBackgroundColor(event.target.value)} />

          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  )
}

export default StyleTest
