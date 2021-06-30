import React from 'react';
import PropTypes from 'prop-types';
import Chart from '../Chart';

const ModesChart = (props) => {
  const chartData = [{
    values: props.modesData.value,
    labels: props.modesData.label,
    hoverinfo: 'label+value+percent',
    hole: 0.3,
    type: 'pie',
  }];

  const chartLayout = {
    title: 'Modes of Transportation',
    legend: {
      orientation: 'h',
      xanchor: 'center',
    },
    margin: {
      t: 80,
      b: 20,
    },
  };

  return <Chart chartData={chartData} chartLayout={chartLayout} chartStyle={props.chartStyle}/>;
};

ModesChart.propTypes = {
  modesData: PropTypes.object.isRequired,
  chartStyle: PropTypes.object.isRequired,
};

export default ModesChart;
