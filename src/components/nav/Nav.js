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
    <nav className="nav" aria-label="Main navigation">
      <Link className="nav-title" to="/">SpaceX Information System</Link>
      <div className="nav-links">
        {links.map(({ label, to, paths }) => (
          <NavLink key={to} to={to} className="nav-link"
            isActive={(_, location) => paths.some(path =>
              location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'))
            )}>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
