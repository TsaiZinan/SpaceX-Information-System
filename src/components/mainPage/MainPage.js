import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { launchPath } from '../../launchPath'
import { getRocketFamily } from '../../launchMetadata'
import LaunchChart from '../chart/LaunchChart'
import PadChart from '../chart/PadChart'
import LaunchHeatmap from '../launchHeatmap/LaunchHeatmap'
import './MainPage.css'

const utcDate = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC'
})
const utcTime = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZone: 'UTC'
})

function getSummary(launches, year) {
  const seen = new Set()
  const dated = launches.filter(launch => {
    if (!launch || !Number.isFinite(Date.parse(launch.date_utc))) return false
    if (launch.id && seen.has(launch.id)) return false
    if (launch.id) seen.add(launch.id)
    return true
  }).sort((a, b) => Date.parse(a.date_utc) - Date.parse(b.date_utc))

  const completed = dated.filter(launch => !launch.upcoming)
  return {
    completed,
    last: completed[completed.length - 1],
    next: dated.find(launch => launch.upcoming),
    thisYear: completed.filter(launch => new Date(launch.date_utc).getUTCFullYear() === year).length,
    successful: completed.filter(launch => launch.launchOutcome === 'success' ||
      (!launch.launchOutcome && launch.success === true)).length,
    recoveries: completed.reduce((count, launch) => count + (launch.cores || []).filter(core =>
      core && core.landing_attempt !== false && core.landing_success === true).length, 0)
  }
}

function Metric({ label, value }) {
  return <div className="summary-metric"><dt>{label}</dt><dd>{value.toLocaleString('en-US')}</dd></div>
}

function MissionCard({ launch, scheduled = false }) {
  const date = new Date(launch.date_utc)
  const fullName = launch.name || 'Unnamed mission'
  const missionName = fullName.split('|').slice(1).join('|').trim() || fullName
  const family = getRocketFamily(launch.rocketModel)
  const cores = (launch.cores || []).filter(Boolean)
  const sites = [...new Set(launch.recoverySites?.length ? launch.recoverySites :
    cores.map(core => core.landing_attempt === false ? 'No recovery attempt' : core.landing_location).filter(Boolean))]
  const serials = cores.filter(core => core.core).map(core => core.flight ? core.core + '.' + core.flight : core.core)
  const landingResults = cores.map(core => {
    if (core.landing_attempt === false) return 'Not attempted'
    if (core.landing_success === true) return 'Success'
    if (core.landing_success === false) return 'Failed'
    return 'Unknown'
  })
  const patch = launch.links?.patch?.small
  return (
    <article className={'summary-mission' + (scheduled ? ' summary-mission-next' : '')}>
      <div className="summary-mission-body">
        {patch && <img className="summary-patch" src={patch} alt="" onError={event => { event.currentTarget.hidden = true }} />}
        <h2 className="summary-label">{scheduled ? 'Next launch' : 'Latest launch'}</h2>
        <h3 className="summary-mission-name">
          {launch.id ? <Link to={launchPath(launch.id)}>{missionName} <span aria-hidden="true">↗</span></Link> : missionName}
        </h3>
        <p className="summary-mission-date"><time dateTime={launch.date_utc}>{utcDate.format(date)} · {utcTime.format(date)} UTC</time></p>
      </div>
      <dl className="summary-mission-facts">
        {family && <div><dt>Rocket</dt><dd>{family}</dd></div>}
        <div><dt>Launch site</dt><dd>{launch.launchSite || 'Unknown'}</dd></div>
        <div><dt>{serials.length > 1 ? 'First stages' : 'First stage'}</dt><dd>{serials.join(' / ') || 'Unknown'}</dd></div>
        <div><dt>Recovery site</dt><dd>{sites.join(' / ') || 'Unknown'}</dd></div>
        {!scheduled && <div><dt>Landing result</dt><dd>{landingResults.join(' / ') || 'Unknown'}</dd></div>}
      </dl>
    </article>
  )
}

export default function MainPage({ launches, loadState }) {
  const year = new Date().getUTCFullYear()
  const summary = useMemo(() => getSummary(launches, year), [launches, year])

  if (loadState === 'error') return <main className="summary-status"><p role="alert">Launch data could not be loaded. Refresh to try again.</p></main>
  if (!launches.length) return (
    <main className="summary-status"><p role="status">{loadState === 'ready' ? 'No launch records are available.' : 'Loading launch data…'}</p></main>
  )

  return (
    <main className="mainpage">
      <div className="summary-row">
        <div className="summary-dashboard">
          <header className="summary-heading">
            <h1>Launch summary</h1>
            <Link to="/filter">Explore launches <span aria-hidden="true">→</span></Link>
          </header>
          <dl className="summary-metrics" aria-label="Launch statistics">
            <Metric label="Total launches" value={summary.completed.length} />
            <Metric label={'Launches in ' + year} value={summary.thisYear} />
            <Metric label="Successful launches" value={summary.successful} />
            <Metric label="Successful landings" value={summary.recoveries} />
          </dl>
          {(summary.last || summary.next) && <div className="summary-missions">
            {summary.last && <MissionCard launch={summary.last} />}
            {summary.next && <MissionCard launch={summary.next} scheduled />}
          </div>}
          <div className="summary-charts">
            <LaunchChart data={summary.completed} />
            <PadChart data={summary.completed} />
          </div>
        </div>
      </div>
      <LaunchHeatmap launches={launches} />
    </main>
  )
}