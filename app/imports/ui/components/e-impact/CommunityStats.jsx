import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Grid, Icon, Progress, Statistic } from 'semantic-ui-react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Trips } from '../../../api/trip/TripCollection';
import Chart from './Chart';
import { Users } from '../../../api/user/UserCollection1';
import { getCountyData } from '../../../api/utilities/Utilities';

/* global document */

function CommunityStats(props) {
  const county = props.county;
  const {
    totalUsers,
    totalMilesSaved,
    totalFuelUsed,
    totalFuelSaved,
    totalCeProduced,
    totalCeReduced,
    modeDistribution,
    vmtData,
    fuelData,
    ceData,
  } = getCountyData(county);

  const endDate = moment().format('YYYY-MM-DD');
  const startDate = moment().subtract(14, 'd').format('YYYY-MM-DD');

  /* Graph Layouts */
  let chartBgColor = '';
  let chartGridColor = '';
  let chartFontColor = '';
  const tMargin = '40';
  const bMargin = '40';

  if (props.userProfile.theme === 'dark') {
    chartBgColor = '#213c5c';
    chartGridColor = '#5c5c5c';
    chartFontColor = '#FFFFFF';
  } else {
    chartBgColor = '';
    chartGridColor = '';
    chartFontColor = '';
  }

  const modeLayout = {
    autosize: true,
    showlegend: true,
    paper_bgcolor: chartBgColor,
    font: {
      color: chartFontColor,
    },
  };
  const vmtLayout = {
    autosize: true,
    margin: {
      t: tMargin,
      b: bMargin,
    },
    xaxis: {
      range: [startDate, endDate],
      rangeslider: { range: ['2020-12-31', endDate] },
      type: 'date',
      gridcolor: chartGridColor,
    },
    yaxis: {
      title: 'Vehicle miles traveled',
      type: 'linear',
      gridcolor: chartGridColor,
    },
    paper_bgcolor: chartBgColor,
    plot_bgcolor: chartBgColor,
    font: {
      color: chartFontColor,
    },
  };
  const fuelLayout = {
    autosize: true,
    margin: {
      t: tMargin,
      b: bMargin,
    },
    xaxis: {
      range: [startDate, endDate],
      rangeslider: { range: ['2020-12-31', endDate] },
      type: 'date',
      gridcolor: chartGridColor,
    },
    yaxis: {
      title: 'Gallons of Gas',
      type: 'linear',
      gridcolor: chartGridColor,
    },
    paper_bgcolor: chartBgColor,
    plot_bgcolor: chartBgColor,
    font: {
      color: chartFontColor,
    },
  };
  const ceLayout = {
    autosize: true,
    margin: {
      t: tMargin,
      b: bMargin,
    },
    xaxis: {
      range: [startDate, endDate],
      rangeslider: { range: ['2020-12-31', endDate] },
      type: 'date',
      gridcolor: chartGridColor,
    },
    yaxis: {
      title: 'Pounds of CO2',
      type: 'linear',
      gridcolor: chartGridColor,
    },
    paper_bgcolor: chartBgColor,
    plot_bgcolor: chartBgColor,
    font: {
      color: chartFontColor,
    },
  };

  /* DOM Styling */
  useEffect(() => {
    const communityCard = document.getElementsByClassName('community-card');
    const cardHeader = document.getElementsByClassName('card-header');
    if (props.userProfile.theme === 'dark') {
      for (let i = 0; i < communityCard.length; i++) {
        communityCard[i].classList.add('dark-community-card');
      }
      for (let i = 0; i < cardHeader.length; i++) {
        cardHeader[i].classList.add('dark-card-header');
      }
    } else {
      for (let i = 0; i < communityCard.length; i++) {
        communityCard[i].classList.remove('dark-community-card');
      }
      for (let i = 0; i < cardHeader.length; i++) {
        cardHeader[i].classList.remove('dark-card-header');
      }
    }
  }, [props]);

  return (
    <Grid centered>
      <Grid.Row>
        <Grid.Column as="h2" textAlign='center'>{county} County</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={3} textAlign='center'>
          <Statistic>
            <Statistic.Value className='community-statistic'>
              <Icon name='users'/>{totalUsers}
            </Statistic.Value>
            <Statistic.Label className='community-statistic'>users</Statistic.Label>
          </Statistic>
        </Grid.Column>
        <Grid.Column width={5} textAlign='center'> <Statistic>
          <Statistic.Value className='community-statistic'><Icon name='car'/>{totalMilesSaved}</Statistic.Value>
          <Statistic.Label className='community-statistic'>vehicle miles traveled (VMT) reduced</Statistic.Label>
        </Statistic>
        </Grid.Column>
        <Grid.Column width={5}>
          <Progress value={totalMilesSaved} total='200000'
            label="2021 GOAL: 200,000 VMT REDUCED" color="blue"/></Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={3} textAlign='center'> <Statistic color="red">
          <Statistic.Value><Icon name='fire'/>{totalFuelUsed}</Statistic.Value>
          <Statistic.Label className='community-statistic'>gallons of gas used</Statistic.Label>
        </Statistic>
        </Grid.Column>
        <Grid.Column width={5} textAlign='center'> <Statistic>
          <Statistic.Value className='community-statistic'><Icon name='fire'/>{totalFuelSaved}</Statistic.Value>
          <Statistic.Label className='community-statistic'>gallons of gas saved</Statistic.Label>
        </Statistic>
        </Grid.Column>
        <Grid.Column width={5}>
          <Progress value={totalFuelSaved} total='8000'
            label="2021 GOAL: 8,000 GALLONS OF GAS SAVED" color="blue"/></Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={3} textAlign='center'> <Statistic color="red">
          <Statistic.Value><Icon name='cloud'/>{totalCeProduced}</Statistic.Value>
          <Statistic.Label className='community-statistic'>pounds of C02 produced</Statistic.Label>
        </Statistic>
        </Grid.Column>
        <Grid.Column width={5} textAlign='center'> <Statistic>
          <Statistic.Value className='community-statistic'><Icon name='cloud'/>{totalCeReduced}</Statistic.Value>
          <Statistic.Label className='community-statistic'>pounds of CO2 reduced</Statistic.Label>
        </Statistic>
        </Grid.Column>
        <Grid.Column width={5}>
          <Progress value={totalCeReduced} total='171000'
            label="2021 GOAL: 171,000 POUNDS OF CO2 REDUCED" color="blue"/></Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={7}>
          <Card fluid className='community-card'>
            <Card.Header className='card-header'>
                Modes of Transportation
            </Card.Header>
            <Card.Content>
              <Chart chartData={modeDistribution} chartLayout={modeLayout}/>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column width={7}>
          <Card className='community-card' fluid>
            <Card.Header className='card-header' textAlign='left'>
                VMT Data
            </Card.Header>
            <Card.Content>
              <Chart chartData={vmtData} chartLayout={vmtLayout}/>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={7}>
          <Card className='community-card' fluid>
            <Card.Header className='card-header'>
                Fuel Data
            </Card.Header>
            <Card.Content>
              <Chart chartData={fuelData} chartLayout={fuelLayout}/>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column width={7}>
          <Card className='community-card' fluid>
            <Card.Header className='card-header'>
                CE Data
            </Card.Header>
            <Card.Content>
              <Chart chartData={ceData} chartLayout={ceLayout}/>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>

  );
}

/** Require an array of Trip documents in the props. */
CommunityStats.propTypes = {
  trips: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  userProfile: PropTypes.object,
  county: PropTypes.string.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Trip documents.
  const subscription = Trips.subscribeTripCommunity();
  const userProfile = Users.getUserProfile(Meteor.user()?.username);
  const trips = Trips.find({}).fetch();
  const ready = subscription.ready();
  return {
    trips,
    ready,
    userProfile,
  };
})(CommunityStats);
