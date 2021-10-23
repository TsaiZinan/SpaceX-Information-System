import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2';



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
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <Doughnut data={launchPadsData} />
    </div>
  )
}

export default PadChart
