import React from 'react'
import { Link } from 'react-router-dom'

import './Nav.css'

const Nav = () => {
  return (
    <div>
      <nav className='nav'>
        <h1>
          Space Info
        </h1>
        <ul className='nav-links'>
          <Link to='/'>
            <li>HOME</li>
          </Link>
          <Link to='/launches'>
            <li>Launches</li>
          </Link>
          <li>Cores</li>
          <li>Test</li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav
