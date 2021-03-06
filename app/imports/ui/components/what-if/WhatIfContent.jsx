import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Statistic } from 'semantic-ui-react';
import { _ } from 'lodash';
import Chart from '../charts/Chart';
import { cePerGallonFuel, tripModes, tripModesColors } from '../../../api/utilities/constants';

// Contains the graphs that visualizes the user's data.
function WhatIfContent(
  {
    milesSavedTotal,
    milesSavedPerDay,
    modesOfTransport,
    userMpg,
    ceProducedTotal,
    ceSavedTotal,
    ceSavedPerDay,
    fuelSavedPerDay,
    fuelSavedTotal,
    detailedTripsWI,
    milesSavedPerDayWI,
    modesOfTransportWI,
    ceSavedPerDayWI,
    fuelSavedPerDayWI,
  },
) {

  const trueMilesTotal = (userTrips) => {

    let milesSavedTotalWI = 0;
    let milesAddedTotalWI = 0;

    _.forEach(userTrips.distance, function (distance, index) {

      if (userTrips.mode[index] === tripModes.GAS_CAR) {
        milesAddedTotalWI += -distance;
      } else if (userTrips.mode[index] === tripModes.CARPOOL) {
        milesAddedTotalWI += distance;
        milesSavedTotalWI += distance;
      } else {
        milesSavedTotalWI += distance;
      }
    });

    return { milesSavedTotalWI, milesAddedTotalWI };
  };

  const milesTotalWI = trueMilesTotal(milesSavedPerDayWI);
  const milesSavedTotalWI = milesTotalWI.milesSavedTotalWI;

  const calculateFuelAndCeWI = () => {

    let fuelSavedTotalWI = 0;
    let ceProducedTotalWI = 0;
    let ceSavedTotalWI = 0;

    _.forEach(detailedTripsWI, function (trip) {

      const fuel = trip.milesTraveled / userMpg;
      const ce = fuel * cePerGallonFuel;

      switch (trip.mode) {
      case tripModes.GAS_CAR:
        ceProducedTotalWI += ce;
        break;
      case tripModes.CARPOOL:
        ceProducedTotalWI += ce / (trip.passengers + 1);
        ceSavedTotalWI += (ce - ceProducedTotalWI);
        fuelSavedTotalWI += fuel * trip.passengers;
        break;
      default:
        fuelSavedTotalWI += fuel;
        ceSavedTotalWI += ce;
      }
    });

    return { fuelSavedTotalWI, ceSavedTotalWI, ceProducedTotalWI };
  };

  const { fuelSavedTotalWI, ceSavedTotalWI, ceProducedTotalWI } = calculateFuelAndCeWI();

  const milesSavedPerDayData = [{
    x: milesSavedPerDay.date,
    y: milesSavedPerDay.distance,
    type: 'bar',
    text: milesSavedPerDay.mode,
    name: 'Original',
  },
  {
    x: milesSavedPerDayWI.date,
    y: milesSavedPerDayWI.distance,
    type: 'bar',
    text: milesSavedPerDayWI.mode,
    name: 'What If',
    marker: { color: 'rgb(173,216,230)' },
  }];

  const fuelSavedPerDayData = {
    x: fuelSavedPerDay.date,
    y: fuelSavedPerDay.fuel,
    name: 'Original Fuel Saved (gallons)',
    type: 'scatter',
    mode: 'lines+markers',
    hoverinfo: 'y',
    line: {
      width: 4 },
  };
  const fuelSavedPerDayDataWI = {
    x: fuelSavedPerDayWI.date,
    y: fuelSavedPerDayWI.fuel,
    name: 'What If Fuel Saved (gallons)',
    type: 'scatter',
    mode: 'lines+markers',
    hoverinfo: 'y',
    line: {
      color: 'rgb(176,216,230)',
      width: 3 },
  };
  const ceSavedPerDayData = {
    x: ceSavedPerDay.date,
    y: ceSavedPerDay.ceSaved,
    name: 'Original CE Saved (pounds)',
    type: 'scatter',
    mode: 'lines+markers',
    hoverinfo: 'y',
    line: {
      color: 'rgb(44,160,44)',
      width: 4 },
  };
  const ceSavedPerDayDataWI = {
    x: ceSavedPerDayWI.date,
    y: ceSavedPerDayWI.ceSaved,
    name: 'What If CE Saved (pounds)',
    type: 'scatter',
    mode: 'lines+markers',
    hoverinfo: 'y',
    line: {
      color: 'rgb(0,229,0)',
      width: 3 },
  };

  const colors = [];

  Object.keys(modesOfTransport).forEach(mode => {
    const modeKey = Object.keys(tripModes).find(key => tripModes[key] === mode);
    colors.push(tripModesColors[modeKey]);
  });

  const modesOfTransportData = [{
    values: Object.values(modesOfTransport),
    labels: Object.keys(modesOfTransport),
    textposition: 'inside',
    marker: {
      colors: colors,
    },
    type: 'pie',
    hole: 0.4,
    hoverinfo: 'label+percent',
    domain: { column: 0 },
  },
  {
    values: Object.values(modesOfTransportWI),
    labels: Object.keys(modesOfTransportWI),
    textposition: 'inside',
    type: 'pie',
    hole: 0.4,
    hoverinfo: 'label+percent',
    domain: { column: 1 },
  }];

  /* Graph Layouts */
  let chartBgColor;
  let chartGridColor;
  let chartFontColor;
  const tMargin = '40';
  const bMargin = '10';

  const milesSavedPerDayLayout = {
    autosize: true,
    margin: {
      t: tMargin,
      b: bMargin,
    },
    barmode: 'group',
    xaxis: {
      range: [milesSavedPerDay.date[0], milesSavedPerDay.date[10]],
      rangeslider: { range: [milesSavedPerDay.date[0], milesSavedPerDay.date[milesSavedPerDay.length - 1]] },
      type: 'date',
      tickformat: '%B %d %Y',
      gridcolor: chartGridColor,
    },
    yaxis: {
      title: 'Miles Saved (miles)',
      range: [Math.min(...milesSavedPerDayWI.distance) > 0 ? 0 : Math.min(...milesSavedPerDayWI.distance), Math.max(...milesSavedPerDayWI.distance)],
      type: 'linear',
      gridcolor: chartGridColor,
    },
    paper_bgcolor: chartBgColor,
    plot_bgcolor: chartBgColor,
    font: {
      color: chartFontColor,
    },
  };

  const fuelAndCePerDayLayout = {
    autosize: true,
    margin: {
      t: tMargin,
      b: bMargin,
    },
    showlegend: true,
    xaxis: {
      range: [fuelSavedPerDay.date[0], fuelSavedPerDay.date[10]],
      rangeslider: { range: [fuelSavedPerDay.date[0], fuelSavedPerDay.date[fuelSavedPerDay.length - 1]] },
      type: 'date',
      gridcolor: chartGridColor,
    },
    yaxis: {
      title: 'Fuel and CE saved',
      range: [0, Math.max(...ceSavedPerDay.ceSaved)],
      type: 'linear',
      gridcolor: chartGridColor,
    },
    paper_bgcolor: chartBgColor,
    plot_bgcolor: chartBgColor,
    font: {
      color: chartFontColor,
    },
  };

  const defaultLayout = {
    autosize: true,
    showlegend: true,
    legend: { orientation: 'h' },
    annotations: [
      {
        font: { size: 15 },
        showarrow: false,
        text: 'Old',
        x: 0.20,
        y: 0.5,
      },
      {
        font: { size: 15 },
        showarrow: false,
        text: 'New',
        x: 0.80,
        y: 0.5,
      }],
    margin: { t: 0, b: 0, l: 0, r: 0 },
    grid: { rows: 1, columns: 2 },
    paper_bgcolor: chartBgColor,
    font: {
      color: chartFontColor,
    },
  };

  return (
    <div id='whatif-container'>
      <Card.Group centered stackable itemsPerRow={4}>
        <Card className='whatif-card'>
          <Card.Header className='card-header'>
              Vehicle Miles Traveled (VMT) Saved
          </Card.Header>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{milesSavedTotal}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>miles</Statistic.Label>
            </Statistic>
          </Card.Content>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{milesSavedTotalWI}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>what if miles</Statistic.Label>
            </Statistic>
          </Card.Content>
        </Card>
        <Card className='whatif-card'>
          <Card.Header className='card-header'>
              Gallons of Fuel Saved
          </Card.Header>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{fuelSavedTotal.toFixed(2)}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>gallons</Statistic.Label>
            </Statistic>
          </Card.Content>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{fuelSavedTotalWI.toFixed(2)}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>what if gallons</Statistic.Label>
            </Statistic>
          </Card.Content>
        </Card>
        <Card className='whatif-card'>
          <Card.Header className='card-header'>
              Carbon Emissions (CE) Produced
          </Card.Header>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{ceProducedTotal}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>pounds</Statistic.Label>
            </Statistic>
          </Card.Content>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{ceProducedTotalWI.toFixed(2)}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>what if pounds</Statistic.Label>
            </Statistic>
          </Card.Content>
        </Card>
        <Card className='whatif-card'>
          <Card.Header className='card-header'>
              Carbon Emissions (CE) Saved
          </Card.Header>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{ceSavedTotal.toFixed(2)}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>pounds</Statistic.Label>
            </Statistic>
          </Card.Content>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{ceSavedTotalWI.toFixed(2)}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>what if pounds</Statistic.Label>
            </Statistic>
          </Card.Content>
        </Card>
      </Card.Group>
      <Grid stackable style={{ marginTop: '10px' }}>
        <Grid.Row>
          <Grid.Column width={9}>
            <Card className='whatif-card' fluid>
              <Card.Header className='card-header'>
                  Miles Saved Per Day
              </Card.Header>
              <Card.Content>
                <Chart chartData={milesSavedPerDayData} chartLayout={milesSavedPerDayLayout}/>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={7}>
            <Card className='whatif-card' fluid>
              <Card.Header className='card-header'>
                  Modes of Transportation Used
              </Card.Header>
              <Card.Content>
                <Chart chartData={modesOfTransportData} chartLayout={defaultLayout}/>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid stackable columns='equal'>
        <Grid.Column>
          <Card className='whatif-card' fluid>
            <Card.Header className='card-header'>
                Fuel Saved and CE Saved per Day
            </Card.Header>
            <Card.Content>
              <Chart chartData={[fuelSavedPerDayData, ceSavedPerDayData, fuelSavedPerDayDataWI, ceSavedPerDayDataWI]} chartLayout={fuelAndCePerDayLayout}/>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </div>
  );
}

WhatIfContent.propTypes = {
  milesSavedTotal: PropTypes.number,
  milesSavedPerDay: PropTypes.object,
  modesOfTransport: PropTypes.object,
  userMpg: PropTypes.number,
  ceProducedTotal: PropTypes.number,
  ceSavedTotal: PropTypes.number,
  ceSavedPerDay: PropTypes.object,
  fuelSavedPerDay: PropTypes.object,
  fuelSavedTotal: PropTypes.number,
  detailedTripsWI: PropTypes.array,
  milesSavedPerDayWI: PropTypes.object,
  modesOfTransportWI: PropTypes.object,
  ceSavedPerDayWI: PropTypes.object,
  fuelSavedPerDayWI: PropTypes.object,
};

export default WhatIfContent;
