function rocketModel(launch) {
  const configuration = launch.rocket?.configuration;
  if (configuration?.full_name || configuration?.name) {
    return configuration.full_name || configuration.name;
  }

  // Older simple feeds expose the model only in LL2's "Vehicle | Mission" title.
  const title = launch.name || '';
  const separator = title.indexOf('|');
  return separator > 0 ? title.slice(0, separator).trim() || 'Unknown' : 'Unknown';
}

function launchOutcome(status) {
  if (status?.id === 3 || status?.abbrev === 'Success' || status?.name === 'Launch Successful') {
    return 'success';
  }
  if (status?.id === 4 || status?.id === 7 || status?.abbrev === 'Failure' ||
      status?.abbrev === 'Partial Failure' || status?.name === 'Launch Failure' ||
      status?.name === 'Launch was a Partial Failure') {
    return 'failure';
  }
  return 'unknown';
}

function recoverySite(landing) {
  if (landing?.attempt === false) return 'No recovery attempt';
  return landing?.landing_location?.name || landing?.landing_location?.abbrev || 'Unknown';
}

export function getLaunchMetadata(launch) {
  const stages = launch.rocket?.launcher_stage;
  const sites = stages?.length
    ? stages.map(stage => recoverySite(stage.landing))
    : [recoverySite(launch.first_stage_landing)];

  return {
    rocketModel: rocketModel(launch),
    launchSite: launch.launch_pad?.name || launch.pad?.name || 'Unknown',
    recoverySites: [...new Set(sites)],
    launchOutcome: launchOutcome(launch.status),
  };
}
