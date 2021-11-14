export const landingPadConverter = (id, data, mode) => {
  let abbr_name = 'NET';
  let full_name = 'NET';
  // console.log(data);
  data.map(site => {

    if (site.id === id) {
      abbr_name = site.name;
      full_name = site.full_name;
    }
  })

  switch (mode) {
    case 0:
      return abbr_name
      break;

    case 1:
      return full_name
      break;

    default: return abbr_name
      break;
  }
}

export const launchPadConverter = (id, data, mode) => {
  // console.log(id)
  let abbr_name = 'NET';
  let full_name = 'NET';
  // console.log(data);
  data.map(site => {

    if (site.id === id) {
      abbr_name = site.name;
      full_name = site.full_name;
    }
  })

  switch (mode) {
    case 0:
      return abbr_name
      break;

    case 1:
      return full_name
      break;

    default: return abbr_name
      break;
  }
}

export const coresConverter = (id, data, mode) => {
  let serialNumber = 'NET';
  let reuse_count = 0;
  // console.log(data);
  data.map(core => {
    // core.id === id ? serialNumber = core.serial : null
    if (core.id === id) {
      serialNumber = core.serial;
      reuse_count = core.reuse_count;
    }
  })

  switch (mode) {
    case 0:
      return serialNumber
      break;

    case 1:
      return reuse_count
      break;

    case 2:
      return serialNumber + '.' + reuse_count
      break;

    default: return serialNumber
      break;
  }
}

export const testConverter = (id) => {
  return '========='
}