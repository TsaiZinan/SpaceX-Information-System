import React, { useMemo, useState } from 'react'
import './SummaryCharts.css'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function countLaunches(data) {
  const byYear = new Map()
  let latestTime = -Infinity
  for (const launch of data) {
    const time = Date.parse(launch?.date_utc)
    if (launch?.upcoming || !Number.isFinite(time)) continue
    const date = new Date(time)
    const year = date.getUTCFullYear()
    if (!byYear.has(year)) byYear.set(year, Array(12).fill(0))
    byYear.get(year)[date.getUTCMonth()] += 1
    latestTime = Math.max(latestTime, time)
  }

  const years = []
  if (byYear.size) {
    const firstYear = Math.min(...byYear.keys())
    const lastYear = new Date(latestTime).getUTCFullYear()
    for (let year = firstYear; year <= lastYear; year += 1) years.push(year)
  }
  return { byYear, years, lastMonth: new Date(latestTime).getUTCMonth() }
}

function BarPlot({ series, monthly }) {
  const peak = Math.max(1, ...series.map(item => item.count))
  const stepSize = Math.max(1, peak / 3)
  const magnitude = 10 ** Math.floor(Math.log10(stepSize))
  const step = magnitude * [1, 2, 5, 10].find(value => value * magnitude >= stepSize)
  const ceiling = Math.ceil(peak / step) * step
  const ticks = Array.from({ length: ceiling / step + 1 }, (_, index) => index * step)
  const stride = monthly ? 1 : Math.max(1, Math.ceil((series.length - 1) / 4))
  const finalIndex = series.length - 1

  return (
    <div className="summary-plot" aria-hidden="true">
      <div className="summary-plot-area">
        {ticks.map(tick => (
          <div className="summary-plot-rule" key={tick} style={{ bottom: tick / ceiling * 100 + '%' }}>
            <span>{tick}</span>
          </div>
        ))}
        <div className="summary-plot-columns">
          {series.map(({ label, count }) => (
            <div className="summary-plot-column" key={label} title={label + ' · ' + count + (count === 1 ? ' launch' : ' launches')}>
              <span style={{ height: count / ceiling * 100 + '%', minHeight: count ? 2 : 0 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="summary-plot-axis">
        {series.map(({ label }, index) => (
          <span key={label}>
            {(index === finalIndex || (index % stride === 0 && finalIndex - index >= stride / 2)) && label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function LaunchChart({ data = [], type = 'year' }) {
  const [period, setPeriod] = useState(type)
  const [selectedYear, setSelectedYear] = useState(null)
  const { years, byYear, lastMonth } = useMemo(() => countLaunches(data), [data])
  const latestYear = years[years.length - 1]
  const year = years.includes(selectedYear) ? selectedYear : latestYear
  const monthly = period === 'month'
  const range = years.length > 1 ? years[0] + '–' + latestYear : latestYear
  const series = monthly
    ? months.slice(0, year === latestYear ? lastMonth + 1 : 12).map((label, index) => ({
        label, count: byYear.get(year)?.[index] || 0,
      }))
    : years.map(label => ({
        label, count: (byYear.get(label) || []).reduce((sum, count) => sum + count, 0),
      }))

  return (
    <section className="summary-chart-panel" aria-label="Launch cadence">
      <header className="summary-chart-header">
        <h2>Launch cadence</h2>
        {years.length > 0 && <span>{monthly ? year : range} · UTC</span>}
      </header>
      {years.length ? (
        <>
          <div className="summary-chart-controls">
            <div className="summary-chart-switch" role="group" aria-label="Chart interval">
              <button type="button" aria-pressed={!monthly} onClick={() => setPeriod('year')}>Yearly</button>
              <button type="button" aria-pressed={monthly} onClick={() => setPeriod('month')}>Monthly</button>
            </div>
            {monthly && (
              <select aria-label="Chart year" value={year} onChange={event => setSelectedYear(Number(event.target.value))}>
                {[...years].reverse().map(value => <option value={value} key={value}>{value}</option>)}
              </select>
            )}
          </div>
          <BarPlot series={series} monthly={monthly} />
          <details className="summary-chart-data">
            <summary>View counts</summary>
            <table>
              <caption>{monthly ? year + ' monthly launches' : 'Yearly launches'}</caption>
              <thead><tr><th scope="col">{monthly ? 'Month' : 'Year'}</th><th scope="col">Launches</th></tr></thead>
              <tbody>
                {series.map(({ label, count }) => <tr key={label}><th scope="row">{label}</th><td>{count}</td></tr>)}
              </tbody>
            </table>
          </details>
        </>
      ) : <p className="summary-chart-empty">No completed launches.</p>}
    </section>
  )
}
