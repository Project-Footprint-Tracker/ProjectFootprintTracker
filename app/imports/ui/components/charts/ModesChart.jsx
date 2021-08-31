import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import Chart from './Chart';
import { tripModes, tripModesColors } from '../../../api/utilities/constants';

const ModesChart = (props) => {
  const colors = [];

  Object.keys(props.modesData).forEach(mode => {
    const modeKey = Object.keys(tripModes).find(key => tripModes[key] === mode);
    colors.push(tripModesColors[modeKey]);
  });

  const chartData = [{
    values: Object.values(props.modesData),
    labels: Object.keys(props.modesData),
    marker: {
      colors: colors,
    },
    hoverinfo: 'label+value',
    hole: 0.3,
    type: 'pie',
  }];

  const chartLayout = {
    title: props.chartStyle.title ? props.chartStyle.title : 'Modes of Transportation',
    legend: { orientation: 'h' },
    margin: {
      t: 40,
      b: 0,
      l: 0,
      r: 0,
    },
    height: 380,
  };

  return (
    <Card fluid>
      <Card.Content textAlign='center' style={props.chartStyle}>
        <Chart chartData={chartData} chartLayout={chartLayout}/>
      </Card.Content>
    </Card>);
};

ModesChart.propTypes = {
  modesData: PropTypes.object.isRequired,
  chartStyle: PropTypes.object,
};

export default ModesChart;
