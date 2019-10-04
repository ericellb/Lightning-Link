import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js';
import { makeStyles } from '@material-ui/core';
import moment from 'moment';
import { AnalyticData } from './types';

const useStyles = makeStyles(theme => ({
  chartContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));

interface AnalyticChartProps {
  analyticData: AnalyticData;
}

export default function AnalyticChart(props: AnalyticChartProps) {
  const classes = useStyles({});
  const analyticChartRef = useRef<HTMLCanvasElement>(null);

  // Component did mount, mount the Chart onto canvas
  useEffect(() => {
    let myChartRef;
    if (analyticChartRef.current) {
      myChartRef = analyticChartRef.current.getContext('2d');
    }

    // Labels and Data
    let dateLabels: any = [];
    let dateData: any = [];

    // Populate Date Labels
    props.analyticData.dates.forEach(date => {
      let tempDate = Object.keys(date)[0];
      tempDate = moment(tempDate).format('MMMM Do YYYY');
      dateLabels.push(tempDate);
    });

    // Populate Date Labels
    props.analyticData.dates.forEach(date => {
      dateData.push(Object.values(date));
    });

    console.log(dateLabels);

    // Create our chart
    new Chart(myChartRef as any, {
      type: 'line',
      data: {
        //Bring in data
        labels: dateLabels,
        datasets: [
          {
            label: 'Views',
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
      }
    });
  }, []);

  return (
    <div className={classes.chartContainer}>
      <canvas id="analyticChart" ref={analyticChartRef} />
    </div>
  );
}
