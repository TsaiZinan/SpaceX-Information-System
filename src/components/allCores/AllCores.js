import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SiReddit, SiYoutube, SiWikipedia, SiSpacex } from 'react-icons/si'
import { launchPath } from '../../launchPath'
import './AllCores2.css'

export default function AllCores({ launches, cores, loadState = 'ready' }) {
  const launchById = useMemo(() => new Map(launches.map(launch => [launch.id, launch])), [launches])
  let message = 'No cores to display.'
  if (loadState === 'loading') message = 'Loading core data…'
  if (loadState === 'error') message = 'Core data could not be loaded. Refresh to try again.'

  return (
    <main className="core">
      <div className="intro">
        <div className="intro-title">Cores Information</div>
        <div className="intro-text">Select a mission patch to see the flight details for that core.</div>
      </div>
      {!cores.length && <p role="status">{message}</p>}
      <div className="allCores">
        {cores.map(core => (
          <div className="singleCore" key={core.serial}>
            <div className="singleCore-name">{core.serial}</div>
            <div className="launch-patches">
              {core.launches.map(id => {
                const mission = launchById.get(id)
                if (!mission) return null
                const { name, links, flight_number, date_utc } = mission
                const iconLinks = [
                  ['Webcast', links?.webcast, SiYoutube],
                  ['Reddit', links?.reddit?.launch, SiReddit],
                  ['Wikipedia', links?.wikipedia, SiWikipedia],
                  ['Press kit', links?.presskit, SiSpacex],
                ]
                return (
                  <div className="launch-patch-div" key={id}>
                    <Link className="core-patch-link" to={launchPath(id)} aria-label={`${core.serial}: ${name}`}>
                      {links?.patch?.small ? <img className="launch-patch" src={links.patch.small} alt="" loading="lazy" /> : name}
                    </Link>
                    <div className="launch-hoverBox">
                      <div className="launch-hoverBox-number">{flight_number}</div>
                      <Link to={launchPath(id)} className="launch-hoverBox-name">{name}</Link>
                      <div className="launch-hoverBox-last">
                        <div className="launch-hoverBox-links">
                          {iconLinks.filter(([, href]) => href).map(([label, href, Icon]) => (
                            <a key={label} className="launch-hoverBox-a" href={href} aria-label={label}>
                              <Icon className="launch-hoverBox-link" />
                            </a>
                          ))}
                        </div>
                        <div className="launch-hoverBox-date">{date_utc?.slice(0, 10)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
