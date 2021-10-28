import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2';

const lightBlue = 'rgba(124, 169, 192, 1)'
const lightYellow = 'rgba(252, 210, 100, 1)'
const lightPink = 'rgba(246, 177, 161, 1)'
const lightGreen = 'rgba(184, 217, 206, 1)'
const lightWhite = 'rgba(224, 215, 196, 1)'
const backgroundColor = 'rgba(235, 229, 217, 1)'

const PadChart = (props) => {

  // array for Labels in launchPadsData
  const [siteAttemptsArray, setSiteAttemptsArray] = useState([])
  // array for data in launchPadsData
  const [siteNameArray, setSiteNameArray] = useState([])

  const LaunchPads = props.data;

  // extra Labels and data in datafile then put them in arrays
  useEffect(() => {
    const launchPadNumberArray = () => {
      var attemptsArray = [];
      var nameArray = [];

      LaunchPads.forEach(pad => {
        attemptsArray.push(pad.launch_attempts);
        nameArray.push(pad.name);
      });
      setSiteAttemptsArray(attemptsArray);
      setSiteNameArray(nameArray);
    }
    launchPadNumberArray();
  }, []);


  const launchPadsData = {
    // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    labels: siteNameArray,
    datasets: [
      {
        label: '# of Votes',
        data: siteAttemptsArray,
        // data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          lightWhite,
          lightGreen,
          'rgba(48, 95, 139, 1)',
          lightYellow,
          lightPink,
          lightBlue,
        ],
        borderColor: [
          backgroundColor,
        ],
        borderWidth: 2,
      },
    ],
  };

  const padOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className='single-chart'>
      <Doughnut data={launchPadsData} options={padOptions}/>
    </div>
  )
}

export default PadChart
