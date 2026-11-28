import { aggregateHeatmap, buildHeatmapIndex, getYearCalendar } from './heatmapData';

function launch(id, changes = {}) {
  return {
    id,
    date_utc: '2024-02-29T12:00:00Z',
    rocketModel: 'Falcon Heavy',
    launchSite: '39A',
    recoverySites: ['LZ-1', 'LZ-2'],
    launchOutcome: 'success',
    ...changes
  };
}

test('counts a mission once and groups outcomes by the UTC day', () => {
  const first = launch('a');
  const second = launch('b', { date_utc: '2024-03-01T00:20:00+02:00', launchOutcome: 'failure' });
  const third = launch('c', { launchOutcome: 'unknown' });
  const index = buildHeatmapIndex([
    first, second, third, first, launch('upcoming', { upcoming: true }), launch('invalid', { date_utc: 'TBD' })
  ]);
  const { days, totals } = aggregateHeatmap(index);
  expect([...days.keys()]).toEqual(['2024-02-29']);
  expect(days.get('2024-02-29')).toEqual({ success: 1, failure: 1, unknown: 1, launches: [first, second, third] });
  expect(totals.get(2024)).toBe(3);
});

test('uses any value within a filter and requires all selected dimensions', () => {
  const index = buildHeatmapIndex([
    launch('a'),
    launch('b', { rocketModel: 'Falcon 9', recoverySites: ['LZ-2'] }),
    launch('c', { launchSite: '40' }),
    launch('d', { rocketModel: 'Falcon 9', recoverySites: ['ASOG'] })
  ]);
  const filters = { rocketModel: ['Falcon 9', 'Falcon Heavy'], launchSite: ['39A'], recoverySites: ['LZ-2', 'LZ-1'] };
  expect(aggregateHeatmap(index, filters).totals.get(2024)).toBe(2);
  expect(aggregateHeatmap(index, { ...filters, launchSite: [] }).days.size).toBe(0);
  expect(aggregateHeatmap(index, { ...filters, recoverySites: null }).totals.get(2024)).toBe(3);
});

test('filters the original vehicle variants as four families and preserves the unfiltered total', () => {
  const models = [
    'Falcon 1', 'Falcon 9 v1.0', 'Falcon 9 v1.1', 'Falcon 9 Full Thrust', 'Falcon 9 Block 4',
    'Falcon 9 Block 5', 'Falcon Heavy', 'Starship SN15', 'Starship Hopper', 'Starship', null,
  ];
  const index = buildHeatmapIndex(models.map((rocketModel, id) => launch(String(id), { rocketModel })));
  expect(index.options.rocketModel).toEqual(['Falcon 1', 'Falcon 9', 'Falcon Heavy', 'Starship']);
  expect(aggregateHeatmap(index).totals.get(2024)).toBe(models.length);
  expect(aggregateHeatmap(index, { rocketModel: [] }).days.size).toBe(0);
  const count = family => aggregateHeatmap(index, { rocketModel: [family] }).totals.get(2024);
  expect(index.options.rocketModel.map(count)).toEqual([1, 5, 1, 3]);
  const starshipDay = aggregateHeatmap(index, { rocketModel: ['Starship'] }).days.get('2024-02-29');
  expect(starshipDay.launches.map(item => item.rocketModel)).toEqual(['Starship SN15', 'Starship Hopper', 'Starship']);
});

test('keeps the full year range including empty years and supports unknown categories', () => {
  const index = buildHeatmapIndex([
    launch('old', { date_utc: '2022-01-01T00:00:00Z', launchSite: null, recoverySites: [] }), launch('new')
  ]);
  expect(index.years).toEqual([2024, 2023, 2022]);
  expect(index.options.recoverySites).toEqual(['LZ-1', 'LZ-2', 'Unknown']);
  const { totals } = aggregateHeatmap(index, { launchSite: ['Unknown'], recoverySites: ['Unknown'] });
  expect([...totals.entries()]).toEqual([[2024, 0], [2023, 0], [2022, 1]]);
  expect(buildHeatmapIndex([]).years).toEqual([]);
});

test('creates complete Sunday-based years including leap days and a 54th week when needed', () => {
  const { weeks, months } = getYearCalendar(2024);
  const dates = weeks.flat().filter(Boolean);
  expect(weeks[0][0]).toBeNull();
  expect(weeks[0][1]).toBe('2024-01-01');
  expect(dates).toHaveLength(366);
  expect(new Set(dates).size).toBe(366);
  expect(dates).toContain('2024-02-29');
  expect(dates[365]).toBe('2024-12-31');
  expect(months).toHaveLength(12);
  expect(months[1]).toEqual({ month: 1, week: 4 });
  const leapSaturday = getYearCalendar(2000);
  expect(leapSaturday.weeks).toHaveLength(54);
  expect(leapSaturday.weeks[53][0]).toBe('2000-12-31');
});
