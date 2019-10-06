import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';
import { makeStyles } from '@material-ui/core';
import moment from 'moment';
import { ChartData } from './types';

const useStyles = makeStyles(theme => ({
  chartContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '75%',
    [theme.breakpoints.down('xs')]: {
      flexBasis: '100%',
      width: '100%'
    }
  },
  analyticChart: {
    background: 'whitesmoke',
    borderRadius: '8px'
  }
}));

interface AnalyticChartProps {
  chartData: ChartData[];
}

// Plots Dates vs Views on a Chart.js Chart
export default function AnalyticChart(props: AnalyticChartProps) {
  const classes = useStyles({});
  const analyticChartRef = useRef<HTMLCanvasElement>(null);

  // Component did mount, mount the Chart onto canvas
  useEffect(() => {
    // Setup the Chart
    let myChartRef;
    if (analyticChartRef.current) {
      myChartRef = analyticChartRef.current.getContext('2d');
    }

    // Labels and Data
    let dateLabels: string[] = [];
    let dateData: number[] = [];

    // Sort our dates
    let sortedDates = props.chartData.sort((a, b) => {
      return +new Date(a.date) - +new Date(b.date);
    });

    // Populate Date Labels
    sortedDates.forEach(entry => {
      let tempDate = moment(entry.date).format('MMM Do YY');
      dateLabels.push(tempDate);
    });

    // Populate Date Labels
    sortedDates.forEach(entry => {
      dateData.push(entry.visits);
    });

    if (dateLabels.length === 1) {
      dateLabels.unshift('');
      dateData.unshift(dateData[0]);
    }

    // Create our chart
    new Chart(myChartRef as any, {
      type: 'line',
      data: {
        //Bring in data
        labels: dateLabels,
        datasets: [
          {
            label: 'Total Views',
            data: dateData,
            fill: false,
            lineTension: 0,
            borderColor: '#0b1736',
            backgroundColor: '#55bae7',
            pointBackgroundColor: '#55bae7',
            pointBorderColor: '#55bae7',
            pointHoverBackgroundColor: '#55bae7',
            pointHoverBorderColor: '#55bae7'
          }
        ]
      },
      options: {
        //Customize chart options
        responsive: true
      }
    });
  }, []);

  return (
    <div className={classes.chartContainer}>
      <canvas id="analyticChart" ref={analyticChartRef} className={classes.analyticChart} />
    </div>
  );
}
