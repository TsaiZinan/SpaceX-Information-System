import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SiReddit, SiYoutube, SiWikipedia } from 'react-icons/si'
import { launchPath } from '../../launchPath'
import './FilterTest3.css'

const landingStatuses = ['Landing failed', 'Ocean landing', 'No landing attempt', 'Ground landing', 'Ship landing', 'Landing unknown']
const reuseOptions = ['Reused', 'Unreused', 'Reuse unknown']

function getLandingStatus(core) {
  if (core?.landing_attempt === false) return 'No landing attempt'
  if (core?.landing_success === false) return 'Landing failed'
  if (!core || (core.landing_attempt !== true && core.landing_success !== true)) return 'Landing unknown'
  return { Ocean: 'Ocean landing', RTLS: 'Ground landing', ASDS: 'Ship landing' }[core.landing_type] || 'Landing unknown'
}

function toggleValue(values, value) {
  return values.includes(value) ? values.filter(item => item !== value) : [...values, value]
}

function FilterButton({ children, active, onClick }) {
  return (
    <button type="button" className={active ? 'SelectButton-active' : 'SelectButton-inactive'}
      aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}

const LaunchCard = React.memo(function LaunchCard({ launch, day, landing, reuse }) {
  const links = launch.links || {}
  const patch = links.patch?.small
  return (
    <article className="filter-node new-node">
      <div className="new-node-first">
        {patch && <img className="new-node-first-patch" src={patch} alt="" width="110" height="110" loading="lazy" />}
        <div className="new-node-first-number">{launch.flight_number}</div>
      </div>
      <div className="new-node-second">
        <Link to={launchPath(launch.id)}>{launch.name}</Link>
      </div>
      <div className="new-node-third">
        <span className="new-node-reuse">{reuse}</span>
        <span>{landing}</span>
      </div>
      <div className="new-node-last">
        {day ? <time dateTime={day}>{day}</time> : <span>Date unknown</span>}
        <div className="new-node-links">
          {links.webcast && <a href={links.webcast} aria-label={`Webcast for ${launch.name}`}><SiYoutube className="new-node-link" /></a>}
          {links.reddit?.launch && <a href={links.reddit.launch} aria-label={`Reddit discussion for ${launch.name}`}><SiReddit className="new-node-link" /></a>}
          {links.wikipedia && <a href={links.wikipedia} aria-label={`Wikipedia article for ${launch.name}`}><SiWikipedia className="new-node-link" /></a>}
        </div>
      </div>
    </article>
  )
})

export default function FilterTest({ launches, loadState }) {
  const records = useMemo(() => launches.map(launch => {
    const timestamp = Date.parse(launch.date_utc)
    const day = Number.isFinite(timestamp) ? new Date(timestamp).toISOString().slice(0, 10) : null
    const core = launch.cores?.[0]
    const reuse = core?.reused === true ? 'Reused' : core?.reused === false ? 'Unreused' : 'Reuse unknown'
    return { launch, day, year: day?.slice(0, 4) || 'Unknown year', reuse, landing: getLandingStatus(core) }
  }), [launches])
  const allYears = useMemo(() => [...new Set(records.map(record => record.year))].sort(), [records])
  const latestYear = allYears.filter(year => year !== 'Unknown year').slice(-1)[0]

  // A null selection includes years arriving with the launch feed. An empty array is an explicit selection.
  const [selectedYears, setSelectedYears] = useState(null)
  const [landing, setLanding] = useState(landingStatuses)
  const [reuse, setReuse] = useState(reuseOptions)
  const activeYears = selectedYears ?? allYears
  const visible = records.filter(record => activeYears.includes(record.year) && landing.includes(record.landing) && reuse.includes(record.reuse))

  const toggleYear = year => setSelectedYears(selected => {
    const years = toggleValue(selected ?? allYears, year)
    return allYears.every(value => years.includes(value)) ? null : years
  })

  return (
    <main className="filter">
      <div className="intro">
        <h1 className="intro-title">Launches Information</h1>
        <p className="intro-text">Filter launches by year, landing and booster reuse. Select a mission to see its details.</p>
      </div>

      {records.length > 0 && <>
        <div className="filter-years" role="group" aria-label="Launch years">
          <div className="filter-option">
            <FilterButton active={allYears.every(year => activeYears.includes(year))}
              onClick={() => setSelectedYears(null)}>All Years</FilterButton>
            {latestYear && <FilterButton active={activeYears.length === 1 && activeYears[0] === latestYear}
              onClick={() => setSelectedYears([latestYear])}>Only {latestYear}</FilterButton>}
          </div>
          <div className="filter-option">
            {allYears.map(year => (
              <FilterButton key={year} active={activeYears.includes(year)} onClick={() => toggleYear(year)}>{year}</FilterButton>
            ))}
          </div>
        </div>

        <div className="filter-years" role="group" aria-label="Landing status">
          <div className="filter-option">
            {landingStatuses.filter(status => status !== 'Landing unknown' || records.some(record => record.landing === status)).map(status => (
              <FilterButton key={status} active={landing.includes(status)}
                onClick={() => setLanding(current => toggleValue(current, status))}>{status}</FilterButton>
            ))}
          </div>
        </div>

        <div className="filter-years" role="group" aria-label="Booster reuse">
          <div className="filter-option">
            {reuseOptions.filter(option => option !== 'Reuse unknown' || records.some(record => record.reuse === option)).map(option => (
              <FilterButton key={option} active={reuse.includes(option)}
                onClick={() => setReuse(current => toggleValue(current, option))}>{option}</FilterButton>
            ))}
          </div>
        </div>
      </>}

      {visible.length > 0 ? (
        <div className="filter-nodes">
          {visible.map(record => <LaunchCard key={record.launch.id} {...record} />)}
        </div>
      ) : (
        <p className="filter-status" role="status">
          {loadState === 'error' ? 'Launch data could not be loaded.' :
            loadState === 'loading' ? 'Loading launches…' :
            records.length ? 'No launches match these filters.' : 'No launches available.'}
        </p>
      )}
    </main>
  )
}
