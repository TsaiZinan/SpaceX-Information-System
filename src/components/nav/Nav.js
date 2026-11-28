import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Nav.css'

const links = [
  { label: 'Summary', to: '/', paths: ['/', '/SpaceX-Information-System'] },
  { label: 'Launches', to: '/filter', paths: ['/filter', '/launch', '/launches'] },
  { label: 'Cores', to: '/boosters', paths: ['/boosters', '/cores'] },
  { label: 'Experiment', to: '/test', paths: ['/test', '/style', '/timeline', '/t'] },
]

export default function Nav() {
  return (
    <div>
      <nav className="nav" aria-label="Main navigation">
        <Link className="nav-title" to="/" style={{ textDecoration: 'none' }}>SpaceX Information System</Link>
        <div className="nav-links">
          {links.map(({ label, to, paths }) => (
            <NavLink key={to} to={to} style={{ textDecoration: 'none' }}
              isActive={(_, location) => paths.some(path =>
                location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'))
              )}>
              <div className="nav-link">{label}</div>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
