import React from 'react'

import './Nav.css'

const Nav = () => {
  return (
    <div>
      <nav className='nav'>
        <h1>
          Space Info
        </h1>
        <ul className='nav-links'>
          <li>HOME</li>
          <li>Launches</li>
          <li>Cores</li>
          <li>Test</li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav
