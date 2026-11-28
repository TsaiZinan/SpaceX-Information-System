const cdnFeed = 'https://cdn.jsdelivr.net/gh/TsaiZinan/ll2-DATA@main/spacex/spacex-previous-launches-simple.json';
const repositoryFeed = 'https://raw.githubusercontent.com/TsaiZinan/ll2-DATA/main/spacex/spacex-previous-launches-simple.json';

export async function loadLaunchRecords(signal, customUrl = process.env.REACT_APP_LAUNCH_DATA_URL) {
  const sources = customUrl ? [customUrl] : [cdnFeed, repositoryFeed];
  let lastError;
  for (const source of sources) {
    try {
      const response = await fetch(source, { signal });
      if (!response.ok) throw new Error(`Launch feed returned HTTP ${response.status}`);
      const { launches } = await response.json();
      if (!Array.isArray(launches)) throw new Error('Launch feed has no list of launches');

      const seen = new Set();
      const valid = launches.filter(launch => {
        if (!launch?.id || !Number.isFinite(Date.parse(launch.net)) || seen.has(launch.id)) return false;
        seen.add(launch.id);
        return true;
      });
      if (launches.length && !valid.length) throw new Error('Launch feed has no valid records');
      return valid;
    } catch (error) {
      if (signal.aborted) throw error;
      lastError = error;
    }
  }
  throw lastError;
}
