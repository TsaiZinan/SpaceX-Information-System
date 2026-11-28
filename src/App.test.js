import { render, screen } from '@testing-library/react';
import App from './App';
import { loadLaunchRecords } from './launchFeed';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  window.history.replaceState(null, '', '/');
});

test('an unknown page offers a return to Summary', () => {
  window.history.replaceState(null, '', '/missing-page');
  global.fetch = jest.fn(() => new Promise(() => {}));
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Return to Summary' })).toHaveAttribute('href', '/');
});

test('a failed CDN request retries the same feed from the repository and skips invalid and duplicate records', async () => {
  const launch = { id: 'mission-a', net: '2026-04-10T00:00:00Z' };
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ ok: false, status: 503 })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ launches: [null, launch, { id: 'missing-date' }, launch] }) });
  await expect(loadLaunchRecords(new AbortController().signal, '')).resolves.toEqual([launch]);
  expect(global.fetch.mock.calls.map(call => new URL(call[0]).hostname)).toEqual(['cdn.jsdelivr.net', 'raw.githubusercontent.com']);
});

test('a configured feed reports a bad response without switching datasets', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  await expect(loadLaunchRecords(new AbortController().signal, '/test-feed.json')).rejects.toThrow('no list of launches');
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
