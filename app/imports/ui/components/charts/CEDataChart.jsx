import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'semantic-ui-react';
import Chart from '../Chart';

const CEDataChart = (props) => {
  const [ceChart, setCEChart] = useState(true);
  const [buttonName, setButtonName] = useState('Fuel Chart');

  const ceChartData = [{
    x: props.ceSaved.date,
    y: props.ceSaved.ce,
    name: 'CE Saved',
    type: 'bar',
    marker: {
      color: '#17BECF',
    },
  }, {
    x: props.ceProduced.date,
    y: props.ceProduced.ceProduced,
    name: 'CE Produced',
    type: 'bar',
    marker: {
      color: '#7F7F7F',
    },
  }];

  const fuelSavedData = [{
    x: props.fuelSaved.date,
    y: props.fuelSaved.fuelSaved,
    name: 'Fuel Saved (gal)',
    type: 'linear',
  }, {
    x: props.fuelSaved.date,
    y: props.fuelSaved.price,
    name: 'Money Saved ($)',
    type: 'linear',
  }];

  const ceChartLayout = {
    title: props.chartStyle.title ? `${props.chartStyle.title} Carbon Emissions per Day (pounds)` : 'Carbon Emissions per Day (pounds)',
    xaxis: {
      type: 'date',
      tickfont: {
        size: 10,
      },
    },
    yaxis: {
      title: 'CE Saved/Produced',
      tickfont: {
        size: 10,
      },
    },
    showlegend: true,
    legend: {
      orientation: 'h',
    },
    barmode: 'group',
    margin: {
      t: 40,
      b: 0,
    },
    height: 340,
  };

  const fuelChartLayout = {
    title: props.chartStyle.title ? `${props.chartStyle.title} Fuel Consumption per Day (gallons)` : 'Fuel Consumption per Day (gallons)',
    xaxis: {
      type: 'date',
      tickfont: {
        range: [props.fuelSaved.date[0], props.fuelSaved.date[10]],
        size: 10,
      },
    },
    yaxis: {
      title: 'Fuel and Money Saved',
      tickfont: {
        size: 10,
      },
    },
    showlegend: true,
    legend: {
      orientation: 'h',
    },
    margin: {
      t: 40,
      b: 0,
    },
    height: 340,
  };

  const showChart = () => (ceChart ?
    <Chart chartData={ceChartData} chartLayout={ceChartLayout}/> :
    <Chart chartData={fuelSavedData} chartLayout={fuelChartLayout}/>
  );

  const handleButton = () => {
    if (ceChart) {
      setCEChart(false);
      setButtonName('CE Chart');
    } else {
      setCEChart(true);
      setButtonName('Fuel Chart');
    }
  };

  return (
    <Card fluid>
      <Card.Content textAlign='center' style={props.chartStyle}>
        {showChart()}
        <Button size='tiny' color='black' onClick={() => handleButton()}>
          {buttonName}
        </Button>
      </Card.Content>
    </Card>
  );
};

CEDataChart.propTypes = {
  ceSaved: PropTypes.object.isRequired,
  ceProduced: PropTypes.object.isRequired,
  fuelSaved: PropTypes.object.isRequired,
  chartStyle: PropTypes.object.isRequired,
};

export default CEDataChart;
