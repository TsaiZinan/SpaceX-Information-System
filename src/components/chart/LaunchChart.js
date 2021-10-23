import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';

function count_duplicate(a) {
  let counts = {}

  for (let i = 0; i < a.length; i++) {
    if (counts[a[i]]) {
      counts[a[i]] += 1
    } else {
      counts[a[i]] = 1
    }
  }
  return counts;
}





const combineMonth = (latestMon, valueMon) => {
  // generate an empty month object
  const generateMonth = (latestMonth) => {
    const start = '2006-03';
    const emptyObject = {};
    for (let y = 2006; y < 2022; y++) {
      for (let m = 1; m < 13; m++) {
        var yearKey = y.toString()
        var monthKey = m.toString()
  
        if (m < 10) {
          monthKey = '0' + monthKey
        }
  
        var key = yearKey + '-' + monthKey
        emptyObject[key] = 0;
  
        if (key === latestMonth) { break; }
      }
    }
    return emptyObject;
  }

  // add the existing month object to empty month object because the existing month object miss the monthes which have no launch
  function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
  }

  var emptyMon = generateMonth(latestMon);
  return extend(emptyMon, valueMon);
}

const LaunchChart = (props) => {

  // console.log(props.data)

  const launchesData = props.data;
  const latestMonth = props.latest[0].date_utc.substring(0, 7);
  console.log(latestMonth)

  const [yearArray, setYearArray] = useState({})
  const [monthArray, setMonthArray] = useState({})

  useEffect(() => {
    
    const test = () => {
      var year = [];
      var month = [];
      
      launchesData.forEach(launch => {
        year.push(launch.date_utc.substring(0, 4));
        month.push(launch.date_utc.substring(0, 7));
      });
      
      setYearArray(count_duplicate(year))
      setMonthArray(combineMonth(latestMonth, count_duplicate(month)))
    }

    test();
  }, []);

  // add 2011 data into yearData cause there is no launch in 2011
  var yearLable = Object.keys(yearArray)
  var yearValue = Object.values(yearArray)
  yearLable.splice(5, 0, '2011');
  yearValue.splice(5, 0, 0);






  const yearData = {
    labels: yearLable,
    datasets: [
      {
        label: '# of Launches',
        data: yearValue,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const monthData = {
    // labels: ['1', '2', '3', '4', '5', '6'],
    labels: Object.keys(monthArray),
    datasets: [
      {
        label: '# of Launches',
        // data: [12, 19, 3, 5, 2, 3],
        data: Object.values(monthArray),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // console.log(yearArray)
  // console.log(monthArray)

  // console.log(Object.values(yearArray))
  // console.log(Object.keys(yearArray))

  return (
    <div className='single-chart'>
      <Line data={yearData} options={options} />
      <Line data={monthData} options={options} />
    </div>
  )
}

export default LaunchChart
