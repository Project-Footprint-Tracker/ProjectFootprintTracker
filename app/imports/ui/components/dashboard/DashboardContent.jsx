import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card } from 'semantic-ui-react';
import Chart from '../charts/Chart';
import DashboardMilesCard from './DashboardMilesCard';
import DashboardFuelCard from './DashboardFuelCard';
import DashboardCeCard from './DashboardCeCard';
import DashboardTreeCard from './DashboardTreeCard';
import { poundsOfCePerTree } from '../../../api/utilities/constants';
import DashboardLeafCard from './DashboardLeafCard';

// Contains the graphs that visualizes the user's data.
function DashboardContent(
  {
    vehicleMilesSaved,
    vehicleMilesAdded,
    milesSavedPerDay,
    milesAddedPerDay,
    modesOfTransport,
    milesPerMode,
    userProfile,
    ceProducedTotal,
    ceSavedTotal,
    ceReducedPerDay,
    fuelSpentTotal,
    fuelSavedTotal,
    fuelSavedPerDay,
    milesSavedAvg,
    milesTraveledAvg,
    fuelSavedAvg,
    fuelSpentAvg,
    ceReducedAvg,
    ceProducedAvg,
    evCeProducedAvg,
  },
) {

  const milesPerDayData = [
    {
      x: milesSavedPerDay.date,
      y: milesSavedPerDay.distance,
      type: 'bar',
      text: milesSavedPerDay.mode,
      name: 'Miles Saved',
      marker: {
        color: 'rgb(33, 186, 69)',
      },
    },
    {
      x: milesAddedPerDay.date,
      y: milesAddedPerDay.distance,
      type: 'bar',
      text: milesAddedPerDay.mode,
      name: 'Miles Traveled',
      marker: {
        color: 'rgb(219, 40, 40)',
      },
    },
  ];

  const fuelSavedPerDayData = {
    x: fuelSavedPerDay.date,
    y: fuelSavedPerDay.fuel,
    name: 'Fuel Saved (gallons)',
    type: 'scatter',
    mode: 'lines+markers',
  };

  const dollarSavedPerFuelData = {
    x: fuelSavedPerDay.date,
    y: fuelSavedPerDay.price,
    name: 'Money Saved per Fuel Saved (dollars)',
    type: 'scatter',
    mode: 'lines+markers',
  };

  const ceReducedPerDayData = {
    x: ceReducedPerDay.date,
    y: ceReducedPerDay.ce,
    name: 'CE Reduced (pounds)',
    type: 'bar',
  };

  // 100,000 trees = 2,400 tons of CO2 or 4,800,000 pounds of CO2
  // 1 tree = 48 pounds of CO2
  const treesPerCeProduced = Math.ceil(ceProducedTotal / poundsOfCePerTree);
  const treesPerCeReduced = Math.ceil(ceSavedTotal / poundsOfCePerTree);

  const modesOfTransportData = [{
    values: Object.values(modesOfTransport),
    labels: Object.keys(modesOfTransport),
    type: 'pie',
    hole: 0.4,
    hoverinfo: 'label+percent',
  }];

  /* Graph Layouts */
  const chartBgColor = '';
  const chartGridColor = '';
  const chartFontColor = '';
  const tMargin = '40';
  const bMargin = '10';

  const milesPerDayLayout = {
    autosize: true,
    height: '350',
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
      range: [Math.min(...milesAddedPerDay.distance), Math.max(...milesSavedPerDay.distance)],
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
    height: '350',
    margin: {
      t: tMargin,
      b: bMargin,
    },
    showlegend: true,
    paper_bgcolor: chartBgColor,
    font: {
      color: chartFontColor,
    },
  };

  const fuelAndDollarPerDayLayout = {
    autosize: true,
    height: '400',
    margin: {
      b: bMargin,
    },
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0,
      y: 1.3,
    },
    xaxis: {
      range: [fuelSavedPerDay.date[0], fuelSavedPerDay.date[10]],
      rangeslider: { range: [fuelSavedPerDay.date[0], fuelSavedPerDay.date[fuelSavedPerDay.length - 1]] },
      type: 'date',
      gridcolor: chartGridColor,
    },
    yaxis: {
      title: 'Fuel and Money saved',
      range: [0, Math.max(...fuelSavedPerDay.price)],
      type: 'linear',
      gridcolor: chartGridColor,
    },
    paper_bgcolor: chartBgColor,
    plot_bgcolor: chartBgColor,
    font: {
      color: chartFontColor,
    },
  };

  const ceReducedPerDayLayout = {
    autosize: true,
    height: '400',
    margin: {
      t: tMargin,
      b: bMargin,
    },
    xaxis: {
      range: [ceReducedPerDay.date[0], ceReducedPerDay.date[10]],
      rangeslider: { range: [ceReducedPerDay.date[0], ceReducedPerDay.date[ceReducedPerDay.length - 1]] },
      type: 'date',
      gridcolor: chartGridColor,
    },
    yaxis: {
      title: 'CE Reduced (pounds)',
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

  return (
    <div id='dashboard-container'>
      <Card.Group centered stackable itemsPerRow={5}>
        <DashboardMilesCard
          milesSaved={vehicleMilesSaved}
          milesAdded={vehicleMilesAdded}
          milesSavedAvgPerYear={milesSavedAvg.year}
          milesSavedAvgPerMonth={milesSavedAvg.month}
          milesSavedAvgPerDay={milesSavedAvg.day}
          milesTraveledAvgPerYear={milesTraveledAvg.year}
          milesTraveledAvgPerMonth={milesTraveledAvg.month}
          milesTraveledAvgPerDay={milesTraveledAvg.day}
          milesPerMode={milesPerMode}
          userProfile={userProfile}
        />
        <DashboardFuelCard
          fuelCostTotal={fuelSpentTotal.toFixed(2)}
          fuelSavedTotal={fuelSavedTotal.toFixed(2)}
          fuelSavedAvgPerYear={fuelSavedAvg.year}
          fuelSavedAvgPerMonth={fuelSavedAvg.month}
          fuelSavedAvgPerDay={fuelSavedAvg.day}
          fuelSpentAvgPerYear={fuelSpentAvg.year}
          fuelSpentAvgPerMonth={fuelSpentAvg.month}
          fuelSpentAvgPerDay={fuelSpentAvg.day}
          userProfile={userProfile}
        />
        <DashboardCeCard
          ceProducedTotal={ceProducedTotal}
          ceReducedTotal={ceSavedTotal.toFixed(2)}
          ceProducedAvg={ceProducedAvg}
          ceReducedAvg={ceReducedAvg}
          evCeProducedAvg={evCeProducedAvg}
          userProfile={userProfile}
        />
        <DashboardTreeCard
          treesPerCeProduced={treesPerCeProduced}
          treesPerCeReduced={treesPerCeReduced}
          userProfile={userProfile}
        />
        <DashboardLeafCard
          treesPerCeReduced={treesPerCeReduced}
          ceSavedTotal={ceSavedTotal}
        />
      </Card.Group>
      <Grid style={{ marginTop: '10px' }} stackable>
        <Grid.Row>
          <Grid.Column width={9}>
            <Card className='general-card' fluid>
              <Card.Header className='card-header'>
                  Miles Saved Per Day
              </Card.Header>
              <Card.Content>
                <Chart chartData={milesPerDayData} chartLayout={milesPerDayLayout}/>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={7}>
            <Card className='general-card' fluid>
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
      <Grid style={{ marginTop: '10px' }} stackable columns='equal'>
        <Grid.Column>
          <Card className='general-card' fluid>
            <Card.Header className='card-header'>
                Fuel Saved per Day
            </Card.Header>
            <Card.Content>
              <Chart chartData={[fuelSavedPerDayData, dollarSavedPerFuelData]}
                chartLayout={fuelAndDollarPerDayLayout}/>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column>
          <Card className='general-card' fluid>
            <Card.Header className='card-header'>
                CE Reduced per Day
            </Card.Header>
            <Card.Content>
              <Chart chartData={[ceReducedPerDayData]} chartLayout={ceReducedPerDayLayout}/>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </div>
  );
}

DashboardContent.propTypes = {
  vehicleMilesSaved: PropTypes.number,
  vehicleMilesAdded: PropTypes.number,
  milesSavedPerDay: PropTypes.object,
  milesAddedPerDay: PropTypes.object,
  modesOfTransport: PropTypes.object,
  milesPerMode: PropTypes.object,
  userProfile: PropTypes.object,
  userReady: PropTypes.bool,
  ceSavedTotal: PropTypes.number,
  ceProducedTotal: PropTypes.number,
  fuelSpentTotal: PropTypes.number,
  fuelSavedTotal: PropTypes.number,
  ceReducedPerDay: PropTypes.object,
  fuelSavedPerDay: PropTypes.object,
  milesSavedAvg: PropTypes.object,
  milesTraveledAvg: PropTypes.object,
  fuelSavedAvg: PropTypes.object,
  fuelSpentAvg: PropTypes.object,
  ceReducedAvg: PropTypes.object,
  ceProducedAvg: PropTypes.object,
  evCeProducedAvg: PropTypes.object,
  userMpg: PropTypes.number,
};

export default DashboardContent;
