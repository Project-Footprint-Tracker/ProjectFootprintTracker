import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import Chart from './Chart';

const ModesChart = (props) => {

  const chartData = [{
    values: Object.values(props.modesData),
    labels: Object.keys(props.modesData),
    hoverinfo: 'label+value',
    hole: 0.3,
    type: 'pie',
  }];

  const chartLayout = {
    title: props.chartStyle.title ? props.chartStyle.title : 'Modes of Transportation',
    legend: {
      orientation: 'h',
      xanchor: 'center',
    },
    margin: {
      t: 40,
      b: 0,
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
  chartStyle: PropTypes.object.isRequired,
};

export default ModesChart;
