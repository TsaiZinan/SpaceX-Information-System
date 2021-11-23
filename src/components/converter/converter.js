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

export const launchConverter = (id, data, mode) => {
  let number = '';
  let name = '';
  let img = '';
  let date_local = '';
  let upcoming = true;
  let landing_attempt = true;
  let landing_success = true;
  let landing_type = '';
  // console.log(upcoming)

  // console.log(data);
  data.map(launch => {

    if (launch.id === id) {
      number = launch.flight_number;
      name = launch.name;
      img = launch.links.patch.small;
      date_local = launch.date_local;
      upcoming = launch.upcoming;
      landing_attempt = launch.cores[0].landing_attempt;
      landing_success = launch.cores[0].landing_success;
      landing_type = launch.cores[0].landing_type;
    }
  })

  switch (mode) {
    case 0:
      return number
      break;

    case 1:
      return name
      break;

    case 2:
      return upcoming
      break;

    case 3:
      return landing_attempt
      break;

    case 4:
      return landing_success
      break;

    case 5:
      return landing_type
      break;

    case 6:
      return img
      break;

    case 7:
      return date_local
      break;

    default: return number
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

export const countNumberInData = (id, data, condition) => {
  let location = 'singleData' + id
  let count = 0;
  data.forEach((singleData) => {
    // if (singleData.success === true) {
    if (eval(location) === condition) {
      count = count + 1
    }
  })
  return count;
}

export const testConverter = (id, data, condition) => {
  let location = 'singleData' + id;
  // console.log(data)
  let count = 0;
  data.forEach((singleData) => {
    if (eval(location) === condition) {

      count = count + 1
    }
  })
  return count;
}