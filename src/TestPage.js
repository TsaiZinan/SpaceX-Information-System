import React from 'react'
import { Link } from 'react-router-dom'



const TestPage = () => {



  return (
    <div>
      <Link to='/style'>
        <button>Color Palette</button>

      </Link>
      <Link to='/chart'>
        <button>Chart</button>

      </Link>

      
      <Link to='/filter'>
        <button>Filter</button>
      </Link>

      <Link to='/timeline'>
        <button>Timeline</button>
      </Link>

      <Link to='/launches'>
        <button>Launches</button>
      </Link>

    </div>
  )
}

export default TestPage
