import React from 'react'
import { Link } from 'react-router-dom'

import './Nav.css'

const Nav = () => {
  return (
    <div>
      <nav className='nav'>
        <div className='nav-title'>
          SpaceX Information System
        </div>
        <div className='nav-links'>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <div className='nav-link'>Summary</div>
          </Link>
          <Link to='/filter' style={{ textDecoration: 'none' }}>
            <div className='nav-link'>Launches</div>
          </Link>
          <Link to='/cores' style={{ textDecoration: 'none' }}>
            <div className='nav-link'>Cores</div>
          </Link>

          <Link to='/test' style={{ textDecoration: 'none' }}>
            <div className='nav-link'>Experiment</div>
          </Link>

          <Link to='/t' style={{ textDecoration: 'none' }}>
            <div className='nav-link'>T</div>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Nav
