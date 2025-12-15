import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

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




// add the existing month object to empty month object because the existing month object miss the monthes which have no launch
const combineMonth = (latestMon, valueMon) => {
  // generate an empty month object
    const generateMonth = (latestMonth) => {
      const start = '2006-03';
      const emptyObject = {};
      const currentYear = new Date().getFullYear();
      for (let y = 2006; y <= currentYear + 1; y++) {
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
    Object.keys(src).forEach(function (key) { obj[key] = src[key]; });
    return obj;
  }

  var emptyMon = generateMonth(latestMon);
  return extend(emptyMon, valueMon);
}

const LaunchChart = (props) => {

  // console.log(props.data)

  const launchesData = props.data;
  // const latestMonth = props.latest.date_utc.substring(0, 7);
  const latestMonth = launchesData[launchesData.length - 1].date_utc.substring(0, 7);
  // console.log(latestMonth)

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






  const yearLineData = {
    labels: yearLable,
    datasets: [
      {
        label: '# of Launches',
        data: yearValue,
        fill: false,
        backgroundColor: 'rgb(124, 169, 192, 1)',
        borderColor: 'rgba(124, 169, 192, 0.5)',
        tension: 0.2,
        pointStyle: 'circle',
      },
    ],
  };

  const monthLineData = {
    // labels: ['1', '2', '3', '4', '5', '6'],
    labels: Object.keys(monthArray),
    datasets: [
      {
        label: '# of Launches',
        // data: [12, 19, 3, 5, 2, 3],
        data: Object.values(monthArray),
        fill: false,
        backgroundColor: 'rgb(231, 125, 50, 1)',
        borderColor: 'rgb(231, 125, 50, 0.3)',
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          lineWidth: 0
        },
        // lineWidth: 2
        // tickColor: 'rgba(235, 229, 217, 1)'
      },
      x: {
        grid: {
          lineWidth: 0
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  const yearBardata = {
    labels: yearLable,
    datasets: [
      {
        label: '# of Launches',
        data: yearValue,
        backgroundColor: [
          'rgba(246, 177, 161, 1)',
        ],
        borderColor: [
          'rgba(246, 177, 161, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthBardata = {
    labels: Object.keys(monthArray),
    datasets: [
      {
        label: '# of Launches',
        data: Object.values(monthArray),
        backgroundColor: [
          'rgba(40, 166, 145, 1)',
        ],
        borderColor: [
          'rgba(40, 166, 145, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      x: {
        grid: {
          lineWidth: 0
        },
      },

    },
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  if (props.type === 'month') {
    return (
      <div className='chart-node'>
        <Bar data={monthBardata} options={barOptions} />
      </div>
    )
  } else if (props.type === 'year') {
    return (
      <div className='chart-node'>
        <Bar data={yearBardata} options={barOptions} />
      </div>
    )
  }



  // return (
  //   <div className='single-chart'>
  //     {/* <div className='chart-node'>
  //       <Line data={yearLineData} options={lineOptions} />
  //     </div>
  //     <div className='chart-node'>
  //       <Line data={monthLineData} options={lineOptions} />
  //     </div> */}

      





  //     <div className='chart-node'>
  //       <Bar data={yearBardata} options={barOptions} />
  //     </div>
  //     <div className='chart-node'>
  //       <Bar data={monthBardata} options={barOptions} />
  //     </div>

  //     {/* <Line data={yearLineData} options={lineOptions} />
  //     <Line data={monthLineData} options={lineOptions} />
  //     <Bar data={yearBardata} options={barOptions} />
  //     <Bar data={monthBardata} options={barOptions} /> */}
  //   </div>
  // )
}

export default LaunchChart
