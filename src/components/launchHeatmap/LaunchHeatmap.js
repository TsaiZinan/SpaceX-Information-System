import React, { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { launchPath } from '../../launchPath';
import { aggregateHeatmap, buildHeatmapIndex, getYearCalendar } from './heatmapData';
import './LaunchHeatmap.css';

const FILTERS = [
  { key: 'rocketModel', label: 'Rocket model' },
  { key: 'launchSite', label: 'Launch site' },
  { key: 'recoverySites', label: 'Recovery site' }
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const UNKNOWN = '#727586';
const OUTCOME_LABELS = { success: 'Success', failure: 'Failure', unknown: 'Unknown' };
const dateFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

function launchCount(count) {
  return count + (count === 1 ? ' launch' : ' launches');
}

function formatDate(key) {
  return dateFormat.format(new Date(key + 'T00:00:00Z'));
}

function daySummary(day) {
  const parts = [];
  if (day.success) parts.push(day.success + ' successful');
  if (day.failure) parts.push(day.failure + ' failed');
  if (day.unknown) parts.push(day.unknown + ' unknown');
  return parts.join(', ');
}

function outcomeColor(outcome, count) {
  if (!count) return null;
  const hueAndSaturation = outcome === 'success' ? '139, 41%' : '5, 55%';
  const lightness = 7 + 65 / (1 + 0.55 * (count - 1));
  return 'hsl(' + hueAndSaturation + ', ' + lightness + '%)';
}

function dayFill(day) {
  const green = outcomeColor('success', day.success);
  const red = outcomeColor('failure', day.failure);
  if (green && red) return 'linear-gradient(to right, ' + green + ' 50%, ' + red + ' 50%)';
  return green || red || UNKNOWN;
}

function FilterBar({ options, filters, onChange }) {
  const [expanded, setExpanded] = useState(null);
  const group = FILTERS.find(filter => filter.key === expanded);

  function toggleOption(option) {
    const values = filters[expanded] || options[expanded];
    const next = values.includes(option) ? values.filter(value => value !== option) : [...values, option];
    onChange(expanded, next.length === options[expanded].length ? null : next);
  }

  return (
    <div className="launch-calendar-filters">
      <div className="launch-calendar-filter-bar" role="group" aria-label="Launch filters">
        {FILTERS.map(({ key, label }) => (
          <button type="button" key={key} className="launch-calendar-filter"
            aria-expanded={expanded === key} aria-controls={expanded === key ? 'launch-calendar-options-' + key : undefined}
            onClick={() => setExpanded(expanded === key ? null : key)}>
            <span>{label}</span>
            <span className="launch-calendar-filter-value">{filters[key] ? filters[key].length : 'All'}</span>
            <span className="launch-calendar-chevron" aria-hidden="true" />
          </button>
        ))}
      </div>
      {group && (
        <div className="launch-calendar-options" id={'launch-calendar-options-' + expanded}
          role="group" aria-label={group.label + ' choices'}>
          <div className="launch-calendar-bulk">
            <button type="button" onClick={() => onChange(expanded, null)}>Select all</button>
            <button type="button" onClick={() => onChange(expanded, [])}>Clear</button>
          </div>
          <div className="launch-calendar-choices">
            {options[expanded].map(option => (
              <button type="button" key={option} aria-pressed={!filters[expanded] || filters[expanded].includes(option)}
                onClick={() => toggleOption(option)}>{option}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="launch-calendar-legend" aria-label="Calendar color key">
      {['success', 'failure'].map(outcome => (
        <span className="launch-calendar-scale" key={outcome}>
          {OUTCOME_LABELS[outcome]}
          <span className="launch-calendar-swatches" aria-hidden="true">
            {[1, 2, 3, 4].map(count => <i key={count} style={{ backgroundColor: outcomeColor(outcome, count) }} title={launchCount(count)} />)}
          </span>
        </span>
      ))}
      <span>Scale shown: 1–4 per outcome</span>
      <span className="launch-calendar-key"><i style={{ background: dayFill({success: 2, failure: 2}) }} />Mixed</span>
      <span className="launch-calendar-key"><i style={{ backgroundColor: UNKNOWN }} />Unknown</span>
      <span className="launch-calendar-key"><i className="launch-calendar-empty-key" />No launch</span>
    </div>
  );
}

function DayDetails({ date, day, onClose }) {
  return (
    <div className="launch-calendar-detail" aria-live="polite">
      <div className="launch-calendar-detail-heading">
        <div><strong>{formatDate(date)} UTC</strong><span>{daySummary(day)}</span></div>
        <button type="button" aria-label="Close day details" onClick={onClose}>×</button>
      </div>
      <ul>
        {day.launches.map(launch => (
          <li key={launch.id || (launch.name + launch.date_utc)}>
            <span className="launch-calendar-outcome" data-outcome={launch.launchOutcome}>
              {OUTCOME_LABELS[launch.launchOutcome] || 'Unknown'}
            </span>
            {launch.id ? <Link to={launchPath(launch.id)}>{launch.name}</Link> : launch.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

const YearCalendar = memo(function YearCalendar({ year, total, days }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [focusedDate, setFocusedDate] = useState(null);
  const { weeks, months } = useMemo(() => getYearCalendar(year), [year]);
  // Paint the empty calendar in seven strips. Only days with launches need DOM controls.
  const rowBounds = useMemo(() => Array.from({ length: 7 }, (_, weekday) => {
    const first = weeks.findIndex(week => week[weekday]);
    const last = weeks.length - 1 - [...weeks].reverse().findIndex(week => week[weekday]);
    return { gridColumn: (first + 2) + ' / ' + (last + 3), gridRow: weekday + 2 };
  }), [weeks]);
  const activeDays = useMemo(() => {
    const result = [];
    weeks.forEach((week, column) => week.forEach((date, row) => {
      if (date && days.has(date)) result.push({ date, day: days.get(date), column, row });
    }));
    return result;
  }, [weeks, days]);
  const tabStop = activeDays.some(item => item.date === focusedDate) ? focusedDate : activeDays[0]?.date;
  const selected = days.get(selectedDate);

  function moveFocus(event) {
    const buttons = Array.from(event.currentTarget.querySelectorAll('[data-launch-day]'));
    const index = buttons.indexOf(event.target);
    if (index === -1) return;
    let next;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown': next = Math.min(index + 1, buttons.length - 1); break;
      case 'ArrowLeft':
      case 'ArrowUp': next = Math.max(0, index - 1); break;
      case 'Home': next = 0; break;
      case 'End': next = buttons.length - 1; break;
      default: return;
    }
    event.preventDefault();
    buttons[next].focus();
  }

  function closeDetails() {
    const button = document.getElementById('launch-calendar-day-' + selectedDate);
    setSelectedDate(null);
    if (button) button.focus();
  }

  return (
    <section className="launch-calendar-year" aria-labelledby={'launch-calendar-year-' + year}>
      <div className="launch-calendar-year-heading">
        <h3 id={'launch-calendar-year-' + year}>{year}</h3>
        <span>{launchCount(total)}</span>
      </div>
      <div className="launch-calendar-scroll">
        <div className="launch-calendar-grid" style={{ '--launch-calendar-weeks': weeks.length }}
          role="group" aria-label={year + ' launch days. Use arrow keys to browse days with launches.'}
          onKeyDown={moveFocus}>
          {months.map(({ month, week }) => (
            <span className="launch-calendar-month" key={month} style={{ gridRow: 1, gridColumn: week + 2 }}>{MONTHS[month]}</span>
          ))}
          {['Mon', 'Wed', 'Fri'].map((weekday, index) => (
            <span className="launch-calendar-weekday" key={weekday}
              style={{ gridRow: 3 + index * 2, gridColumn: 1 }}>{weekday}</span>
          ))}
          {rowBounds.map((placement, row) => <span key={row} aria-hidden="true" className="launch-calendar-track" style={placement} />)}
          {activeDays.map(({ date, day, column, row }) => {
            const label = formatDate(date) + ' UTC · ' + daySummary(day);
            return (
              <button type="button" key={date} id={'launch-calendar-day-' + date}
                data-launch-day={date} className="launch-calendar-day"
                data-has-unknown={day.unknown > 0 && (day.success + day.failure) > 0}
                tabIndex={tabStop === date ? 0 : -1} title={label} aria-label={label} aria-pressed={selectedDate === date}
                style={{ gridColumn: column + 2, gridRow: row + 2, background: dayFill(day) }}
                onFocus={() => setFocusedDate(date)}
                onClick={() => setSelectedDate(selectedDate === date ? null : date)} />
            );
          })}
        </div>
      </div>
      {selected && <DayDetails date={selectedDate} day={selected} onClose={closeDetails} />}
    </section>
  );
});

export default function LaunchHeatmap({ launches }) {
  const [filters, setFilters] = useState({});
  const index = useMemo(() => buildHeatmapIndex(launches), [launches]);
  const { days, totals } = useMemo(() => aggregateHeatmap(index, filters), [index, filters]);

  return (
    <section className="launch-calendar" aria-labelledby="launch-calendar-title">
      <header className="launch-calendar-heading">
        <h2 id="launch-calendar-title">Launch calendar</h2>
        <span>Daily launches · UTC</span>
      </header>
      <FilterBar options={index.options} filters={filters}
        onChange={(key, values) => setFilters(previous => ({ ...previous, [key]: values }))} />
      <Legend />
      {!days.size && <p className="launch-calendar-empty" role="status">No launches match these filters.</p>}
      {index.years.map(year => <YearCalendar key={year} year={year} total={totals.get(year) || 0} days={days} />)}
    </section>
  );
}
