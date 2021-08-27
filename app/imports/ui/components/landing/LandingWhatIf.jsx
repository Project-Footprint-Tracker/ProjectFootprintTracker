import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Statistic } from 'semantic-ui-react';
import { getCEProducedData, getPotentialTrips, getStatistics } from './utilites';
import Chart from '../charts/Chart';

const LandingWhatIf = ({ monthTrips }) => {
  const original = getStatistics(monthTrips);
  const ceProducedCount = original.ceProducedCount;
  const noCEProducedCount = monthTrips.length - ceProducedCount;
  const noCEProducedPercent = 100 - original.ceProducedPercent;
  const [noCEProduced, setNoCEProduced] = useState(noCEProducedCount);
  const [sliderValue, setSliderValue] = useState(noCEProducedPercent);

  const handleSliderChange = (e) => {
    const value = e.target.value;
    const newIndex = Math.floor((value / 100) * monthTrips.length);
    setNoCEProduced(newIndex);
    setSliderValue(value);
  };

  const originalData = getCEProducedData(monthTrips);
  const maxCEProduced = (Math.ceil(Math.max(...originalData.ceProduced) / 10));
  const maxCESaved = (Math.ceil(Math.max(...original.ceSavedNumbers) / 10));
  const maxChartValue = (maxCEProduced + maxCESaved) * 10;

  const originalChartData = {
    x: originalData.date,
    y: originalData.ceProduced,
    name: 'Original',
    type: 'linear',
    marker: {
      color: '#7F7F7F',
    },
  };

  const newChartData = () => {
    const difference = noCEProduced - noCEProducedCount;
    const potentialData = getPotentialTrips(monthTrips, difference);

    return {
      x: potentialData.date,
      y: potentialData.ceProduced,
      name: 'Potential',
      type: 'linear',
      marker: {
        color: '#17BECF',
      },
    };
  };

  const chartData = [originalChartData, newChartData()];

  const chartLayout = {
    xaxis: {
      type: 'date',
      tickfont: {
        size: 10,
      },
    },
    yaxis: {
      title: 'CE Produced (lbs)',
      tickfont: {
        size: 10,
      },
      range: [0, maxChartValue],
    },
    showlegend: true,
    legend: {
      orientation: 'h',
    },
    margin: {
      t: 30,
      b: 0,
    },
    height: 350,
  };

  const getPotentialTotal = Number(newChartData().y
    .reduce((a, b) => a + b, 0)
    .toFixed(2));

  return (
    <Grid.Row columns={2} stretched style={{ padding: '30px' }}>
      <Grid.Column textAlign='center' verticalAlign='middle'>
        <Statistic
          label='CE Saved Last Month'
          value={`${original.ceSavedTotal} lbs`}
        />
        <Statistic
          size='small'
          label='CE Produced Last Month'
          value={`${original.ceProducedTotal} lbs`}
        />
        <Header as='h1' subheader={`Out of ${monthTrips.length} trips made last month, ${original.ceProducedPercent}% produced CE (including carpool trips).`}/>
      </Grid.Column>
      <Grid.Column textAlign='center'>
        <Header as='h3'>
            What if {sliderValue}% of all trips made last month used EV/Hybrid Vehicles (or alternative transportation)?
          <Header.Subheader>
            <br/>
            <input
              type='range'
              min={0}
              max={100}
              value={sliderValue}
              onChange={handleSliderChange}
              style={{ width: 300 }}
            />
          </Header.Subheader>
        </Header>
        <Chart chartData={chartData} chartLayout={chartLayout}/>
        <Header as='h1' subheader={`Potential CE Produced: ${getPotentialTotal} lbs`}/>
      </Grid.Column>
    </Grid.Row>
  );
};

LandingWhatIf.propTypes = {
  monthTrips: PropTypes.array.isRequired,
};

export default LandingWhatIf;
