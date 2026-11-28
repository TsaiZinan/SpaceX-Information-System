import { getRocketFamily, ROCKET_FAMILIES } from '../../launchMetadata';

const dimensions = ['rocketModel', 'launchSite', 'recoverySites'];
const dayInMilliseconds = 24 * 60 * 60 * 1000;
const optionOrder = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

function optionName(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : 'Unknown';
}

export function buildHeatmapIndex(launches) {
  const launchSites = new Set();
  const recoverySiteOptions = new Set();
  const seenIds = new Set();
  const records = [];
  let earliestYear = Infinity;
  let latestYear = -Infinity;

  for (const launch of launches) {
    if (!launch || launch.upcoming || !launch.date_utc || (launch.id && seenIds.has(launch.id))) {
      continue;
    }
    const time = Date.parse(launch.date_utc);
    if (!Number.isFinite(time)) continue;

    if (launch.id) seenIds.add(launch.id);
    const date = new Date(time);
    const year = date.getUTCFullYear();
    const rocketModel = getRocketFamily(launch.rocketModel);
    const launchSite = optionName(launch.launchSite);
    const recoverySites = Array.isArray(launch.recoverySites) && launch.recoverySites.length
      ? [...new Set(launch.recoverySites.map(optionName))]
      : ['Unknown'];

    launchSites.add(launchSite);
    recoverySites.forEach(site => recoverySiteOptions.add(site));
    earliestYear = Math.min(earliestYear, year);
    latestYear = Math.max(latestYear, year);
    records.push({ launch, day: date.toISOString().slice(0, 10), year, rocketModel, launchSite, recoverySites });
  }

  const years = [];
  for (let year = latestYear; year >= earliestYear; year -= 1) {
    years.push(year);
  }
  const options = {
    rocketModel: ROCKET_FAMILIES,
    launchSite: [...launchSites].sort(optionOrder.compare),
    recoverySites: [...recoverySiteOptions].sort(optionOrder.compare),
  };
  return { years, options, records };
}

// An omitted selection includes every value. An explicitly empty one matches none.
export function aggregateHeatmap(index, filters = {}) {
  const active = {};
  for (const key of dimensions) {
    active[key] = filters[key] == null ? null : new Set(filters[key]);
  }
  const days = new Map();
  const totals = new Map(index.years.map(year => [year, 0]));

  for (const record of index.records) {
    if (active.rocketModel && !active.rocketModel.has(record.rocketModel)) continue;
    if (active.launchSite && !active.launchSite.has(record.launchSite)) continue;
    if (active.recoverySites && !record.recoverySites.some(site => active.recoverySites.has(site))) continue;

    const { day, year, launch } = record;
    if (!days.has(day)) days.set(day, { success: 0, failure: 0, unknown: 0, launches: [] });
    const summary = days.get(day);
    const outcome = launch.launchOutcome;
    if (outcome === 'success') summary.success += 1;
    else if (outcome === 'failure') summary.failure += 1;
    else summary.unknown += 1;
    summary.launches.push(launch);
    totals.set(year, totals.get(year) + 1);
  }
  return { days, totals };
}

// Columns are Sunday–Saturday UTC weeks. Blank cells belong to the adjacent year.
export function getYearCalendar(year) {
  const first = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  const offset = new Date(first).getUTCDay();
  const dayCount = (end - first) / dayInMilliseconds;
  const weeks = Array.from({ length: Math.ceil((offset + dayCount) / 7) }, () => Array(7).fill(null));
  const months = [];
  for (let day = 0; day < dayCount; day += 1) {
    const date = new Date(first + day * dayInMilliseconds);
    const week = Math.floor((day + offset) / 7);
    weeks[week][date.getUTCDay()] = date.toISOString().slice(0, 10);
    if (date.getUTCDate() === 1) months.push({ month: date.getUTCMonth(), week });
  }
  return { weeks, months };
}
