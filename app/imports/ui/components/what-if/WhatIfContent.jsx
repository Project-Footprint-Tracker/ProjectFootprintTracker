import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Statistic } from 'semantic-ui-react';
import Chart from '../Chart';
import { cePerGallonFuel } from '../../../api/utilities/constants';

// Contains the graphs that visualizes the user's data.
function WhatIfContent(
  {
    milesSavedTotal,
    trueMilesSavedTotal,
    milesSavedPerDay,
    modesOfTransport,
    userMpg,
    ceProducedTotal,
    ceReducedPerDay,
    fuelSavedPerDay,
    milesSavedPerDayWI,
    modesOfTransportWI,
    ceReducedPerDayWI,
    fuelSavedPerDayWI,
    newMilesTotal,
  },
) {

  const milesSavedTotalWI = newMilesTotal(milesSavedPerDayWI);
  const fuelSavedTotalWI = (milesSavedTotalWI / userMpg).toFixed(2);
  const ceProducedTotalWI = (((milesSavedTotal - milesSavedTotalWI) / userMpg) * cePerGallonFuel).toFixed(2);
  const ceReducedTotalWI = (fuelSavedTotalWI * cePerGallonFuel).toFixed(2);
  const fuelSavedTotal = (trueMilesSavedTotal / userMpg).toFixed(2);
  const ceReducedTotal = (fuelSavedTotal * cePerGallonFuel).toFixed(2);
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
  const ceReducedPerDayData = {
    x: ceReducedPerDay.date,
    y: ceReducedPerDay.ce,
    name: 'Original CE Reduced (pounds)',
    type: 'scatter',
    mode: 'lines+markers',
    hoverinfo: 'y',
    line: {
      color: 'rgb(44,160,44)',
      width: 4 },
  };
  const ceReducedPerDayDataWI = {
    x: ceReducedPerDayWI.date,
    y: ceReducedPerDayWI.ce,
    name: 'What If CE Reduced (pounds)',
    type: 'scatter',
    mode: 'lines+markers',
    hoverinfo: 'y',
    line: {
      color: 'rgb(0,229,0)',
      width: 3 },
  };

  const modesOfTransportData = [{
    values: modesOfTransport.value,
    labels: modesOfTransport.label,
    textposition: 'inside',
    type: 'pie',
    hole: 0.4,
    hoverinfo: 'label+percent',
    domain: { column: 0 },
  },
  {
    values: modesOfTransportWI.value,
    labels: modesOfTransportWI.label,
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
      gridcolor: chartGridColor,
    },
    yaxis: {
      title: 'Miles Saved (miles)',
      range: [Math.min(...milesSavedPerDay.distance) > 0 ? 0 : Math.min(...milesSavedPerDay.distance), Math.max(...milesSavedPerDay.distance)],
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
      range: [0, Math.max(...ceReducedPerDay.ce)],
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
              Vehicle Miles Traveled (VMT) Reduced
          </Card.Header>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{trueMilesSavedTotal}</Statistic.Value>
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
              <Statistic.Value className='whatif-statistic'>{fuelSavedTotal}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>gallons</Statistic.Label>
            </Statistic>
          </Card.Content>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{fuelSavedTotalWI}</Statistic.Value>
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
              <Statistic.Value className='whatif-statistic'>{ceProducedTotalWI}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>what if pounds</Statistic.Label>
            </Statistic>
          </Card.Content>
        </Card>
        <Card className='whatif-card'>
          <Card.Header className='card-header'>
              Carbon Emissions (CE) Reduced
          </Card.Header>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{ceReducedTotal}</Statistic.Value>
              <Statistic.Label className='whatif-statistic'>pounds</Statistic.Label>
            </Statistic>
          </Card.Content>
          <Card.Content textAlign='center'>
            <Statistic>
              <Statistic.Value className='whatif-statistic'>{ceReducedTotalWI}</Statistic.Value>
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
                Fuel Saved and CE Reduced per Day
            </Card.Header>
            <Card.Content>
              <Chart chartData={[fuelSavedPerDayData, ceReducedPerDayData, fuelSavedPerDayDataWI, ceReducedPerDayDataWI]} chartLayout={fuelAndCePerDayLayout}/>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </div>
  );
}

WhatIfContent.propTypes = {
  milesSavedTotal: PropTypes.number,
  trueMilesSavedTotal: PropTypes.number,
  milesSavedPerDay: PropTypes.object,
  modesOfTransport: PropTypes.object,
  userMpg: PropTypes.number,
  ceProducedTotal: PropTypes.string,
  ceReducedPerDay: PropTypes.object,
  fuelSavedPerDay: PropTypes.object,
  milesSavedPerDayWI: PropTypes.object,
  modesOfTransportWI: PropTypes.object,
  ceReducedPerDayWI: PropTypes.object,
  fuelSavedPerDayWI: PropTypes.object,
  newMilesTotal: PropTypes.func,
};

export default WhatIfContent;
