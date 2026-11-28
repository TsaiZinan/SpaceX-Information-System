import React, { useMemo } from 'react'
import './SummaryCharts.css'

function rankSites(data) {
  const counts = new Map()
  for (const record of data) {
    if (!record || record.upcoming) continue
    // Older chart callers supply aggregated SpaceX v4 launch pad records.
    const aggregated = Number.isFinite(record.launch_attempts)
    const site = (aggregated ? record.name : record.launchSite) || 'Unknown'
    counts.set(site, (counts.get(site) || 0) + (aggregated ? record.launch_attempts : 1))
  }
  return [...counts].sort(([left, a], [right, b]) => b - a || left.localeCompare(right, 'en'))
}

function SiteRows({ rows, maximum }) {
  return (
    <ul className="summary-site-list">
      {rows.map(([site, count]) => (
        <li key={site}>
          <span>{site}</span><strong>{count.toLocaleString('en')}</strong>
          <div className="summary-site-track" aria-hidden="true">
            <span style={{ width: count / maximum * 100 + '%' }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function PadChart({ data = [] }) {
  const sites = useMemo(() => rankSites(data), [data])
  const maximum = Math.max(1, sites[0]?.[1] || 0)
  const extraCount = sites.length - 4

  return (
    <section className="summary-chart-panel" aria-label="Launch sites">
      <header className="summary-chart-header">
        <h2>Launch sites</h2>
        {sites.length > 0 && <span>All years</span>}
      </header>
      {sites.length ? (
        <>
          <SiteRows rows={sites.slice(0, 4)} maximum={maximum} />
          {extraCount > 0 && (
            <details className="summary-chart-data">
              <summary>
                <span className="summary-sites-more">{extraCount} more {extraCount === 1 ? 'site' : 'sites'}</span>
                <span className="summary-sites-less">Show fewer sites</span>
              </summary>
              <SiteRows rows={sites.slice(4)} maximum={maximum} />
            </details>
          )}
        </>
      ) : <p className="summary-chart-empty">No launch sites recorded.</p>}
    </section>
  )
}
