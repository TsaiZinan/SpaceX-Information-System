import React, { useMemo } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { launchPath } from '../../launchPath'
import './LaunchDetailPage2.css'

function landingResult(core) {
  if (core.landing_attempt === false) return 'Not attempted'
  if (core.landing_success === true) return 'Success'
  if (core.landing_success === false) return 'Fail'
  return 'Unknown'
}

function LaunchDetailPage({ launches, cores = [], landingPads = [], loadState = 'ready', archived = false, match }) {
  const { launchKey } = match.params
  const backPath = archived ? '/launches' : '/filter'
  const ordered = useMemo(() => [...launches].sort((a, b) =>
    Date.parse(a.date_utc) - Date.parse(b.date_utc) || String(a.id).localeCompare(String(b.id))
  ), [launches])
  const selectedIndex = ordered.findIndex(launch => launch.id === launchKey)
  const backLink = <Link to={backPath} className="launchDetail-controlPanal-button">BACK</Link>

  if (selectedIndex < 0) {
    // Numeric bookmarks use the displayed flight number, independent of feed order.
    if (!archived && /^[1-9]\d*$/.test(launchKey)) {
      const numbered = ordered.find(launch => launch.flight_number === Number(launchKey))
      if (numbered) return <Redirect to={launchPath(numbered.id)} />
    }

    let message = 'Launch not found.'
    if (loadState === 'loading') message = 'Loading launch data…'
    if (loadState === 'error') message = 'Launch data could not be loaded. Refresh to try again.'
    return <div className="launchDetail"><p role="status">{message}</p>{backLink}</div>
  }

  const launch = ordered[selectedIndex]
  const previous = ordered[(selectedIndex - 1 + ordered.length) % ordered.length]
  const next = ordered[(selectedIndex + 1) % ordered.length]
  const missionCores = (launch.cores || []).filter(Boolean)

  return (
    <div className="launchDetail">
      <div className="launchDetail-controlPanal">
        <div className="launchDetail-controlPanal-page">{backLink}</div>
        {ordered.length > 1 && (
          <div className="launchDetail-controlPanal-page">
            <Link to={launchPath(previous.id, archived)} className="launchDetail-controlPanal-button">PREVIOUS</Link>
            <Link to={launchPath(next.id, archived)} className="launchDetail-controlPanal-button">NEXT</Link>
          </div>
        )}
      </div>

      <div className="launchDetail-first">
        <div className="launchDetail-first-left">
          <div className="launchDetail-patch">
            {launch.links.patch.small && <img className="launchDetail-patch-img" src={launch.links.patch.small} alt="" />}
          </div>
          <div className="launchDetail-basic">
            <h1 className="launchDetail-basic-name">{launch.name}</h1>
            <div>{launch.date_utc.substring(0, 10)}</div>
            {archived && <div>Archived record</div>}
          </div>
        </div>

        <div className="launchDetail-first-middle">
          <h2 className="launchDetail-core-title">{missionCores.length > 1 ? 'Cores' : 'Core'}</h2>
          {missionCores.length === 0 && <div className="launchDetail-core-p">No Core Information</div>}
          {missionCores.map((core, index) => {
            const archiveCore = archived && cores.find(record => record.id === core.core)
            const pad = core.landpad && landingPads.find(site => site.id === core.landpad)
            return (
              <div className="launchDetail-core" key={core.core || index}>
                <div className="launchDetail-core-h">Name:</div>
                <div className="launchDetail-core-p">{(archived ? archiveCore?.serial : core.core) || 'Unknown'}</div>
                <div className="launchDetail-core-h">Core flight:</div>
                <div className="launchDetail-core-p">{core.flight ?? 'Unknown'}</div>
                <div className="launchDetail-core-h">Landing Type:</div>
                <div className="launchDetail-core-p">{core.landing_type || 'Unknown'}</div>
                <div className="launchDetail-core-h">Landing Site:</div>
                <div className="launchDetail-core-p">{core.landing_location || pad?.full_name || pad?.name || 'Unknown'}</div>
                <div className="launchDetail-core-h">Landing Result:</div>
                <div className="launchDetail-core-p">{landingResult(core)}</div>
              </div>
            )
          })}
        </div>

        <div className="launchDetail-first-right">
          {launch.links.youtube_id ? (
            <iframe className="launchDetail-embedVideo"
              src={`https://www.youtube.com/embed/${launch.links.youtube_id}`}
              title="YouTube video player" frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          ) : (
            <div className="launchDetail-embedVideo" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', backgroundColor: '#333'}}>
              No Video Available
            </div>
          )}
          <div className="launchDetail-detail">{launch.details}</div>
        </div>
      </div>
    </div>
  )
}

export default LaunchDetailPage
