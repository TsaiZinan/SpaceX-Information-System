import React from 'react'
import { Link } from 'react-router-dom'

const LaunchDetailPage = (props) => {
  const launchesData = props.launches;
  const coresData = props.cores;
  const number = props.match.params.number - 1;
  console.log(number)

  return (
    <div>
      <Link to='/launches'>
        <button>Back</button>
      </Link>
      <div>
        {launchesData[number].name}
      </div>

    </div>
  )
}

export default LaunchDetailPage
