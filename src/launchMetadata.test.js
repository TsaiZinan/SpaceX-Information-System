import { getLaunchMetadata, isStarshipLaunch } from './launchMetadata';

test('uses a configured rocket model and distinct recovery locations for a multi-core launch', () => {
  const landing = (name) => ({ landing: { attempt: true, landing_location: { name } } });
  const metadata = getLaunchMetadata({
    name: 'Vehicle | Demo',
    rocket: {
      configuration: { full_name: 'Falcon Heavy' },
      launcher_stage: [
        { landing: { attempt: false, landing_location: { name: 'Atlantic Ocean' } } },
        landing('Landing Zone 1'),
        landing('Landing Zone 2'),
        landing('Landing Zone 2'),
      ],
    },
    launch_pad: { name: 'Launch Complex 39A' },
    status: { id: 7 },
  });
  expect(metadata).toEqual({
    rocketModel: 'Falcon Heavy',
    launchSite: 'Launch Complex 39A',
    recoverySites: ['No recovery attempt', 'Landing Zone 1', 'Landing Zone 2'],
    launchOutcome: 'failure',
  });
});

test('uses the vehicle in old LL2 titles and keeps missing or unfinished data unknown', () => {
  expect(getLaunchMetadata({ name: 'Falcon 9 Block 5 | USSF-266', status: { abbrev: 'Success' } }))
    .toMatchObject({ rocketModel: 'Falcon 9 Block 5', launchOutcome: 'success' });
  expect(getLaunchMetadata({ name: 'Mission without a vehicle', status: { abbrev: 'TBD' } }))
    .toEqual({ rocketModel: 'Unknown', launchSite: 'Unknown', recoverySites: ['Unknown'], launchOutcome: 'unknown' });
});

test('identifies Starship without a stage and only falls back to its serial when the vehicle is unknown', () => {
  const rocket = { launcher_stage: [{ launcher: { serial_number: 'Booster 14' } }] };
  expect(isStarshipLaunch({ name: 'Starship | Flight 14' })).toBe(true);
  expect(isStarshipLaunch({ name: 'Unknown mission', rocket })).toBe(true);
  expect(isStarshipLaunch({ name: 'Falcon Heavy | Mission', rocket })).toBe(false);
  expect(isStarshipLaunch({ name: 'Unknown mission' })).toBe(false);
});
