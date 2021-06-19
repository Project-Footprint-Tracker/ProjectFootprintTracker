import React, { useState, useEffect } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Menu, Button, Table, Grid, Loader, Icon, Statistic } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import SideBar from '../../components/e-impact/SideBar';
import { Trips, tripPublications } from '../../../api/trip/TripCollection';
import { Users } from '../../../api/user/UserCollection1';
import TripItem from '../../components/e-impact/TripItem';

/* global document */

const Daily = (props) => {
  const monthString = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const today = new Date();
  const [currentMonthYr, setCurrentMonthYr] = useState([today.getMonth(), today.getFullYear()]);
  const monthTrips = _.filter(props.trips, (trip) => trip.date.getMonth() === currentMonthYr[0] && trip.date.getFullYear() === currentMonthYr[1]).sort((a, b) => ((a.date < b.date) ? 1 : -1));
  let monthlySum = 0;
  for (let i = 0; i < monthTrips.length; i++) {
    const tripMpg = monthTrips[i].mpg > 0 ? monthTrips[i].mpg : 25;
    const add = (monthTrips[i].distance / tripMpg) * 19.6;
    if (!Number.isNaN(add) && Number.isFinite(add)) {
      if (monthTrips[i].mode === 'Gas Car' || monthTrips[i].mode === 'Carpool') {
        monthlySum += add;
      } else {
        monthlySum -= add;
      }
    }
  }
  const monthlySumColor = monthlySum > 0 ? 'red' : 'green';

  function handleClickNext() {
    const m = (currentMonthYr[0] + 1) % 12;
    let y = currentMonthYr[1];
    if (m === 0) {
      y = currentMonthYr[1] + 1;
    }
    setCurrentMonthYr([m, y]);
  }

  function handleClickPrev() {
    const m = (currentMonthYr[0] + 11) % 12;
    let y = currentMonthYr[1];
    if (m === 11) {
      y -= 1;
    }
    setCurrentMonthYr([m, y]);
  }

  function handleClickToday() {
    setCurrentMonthYr([today.getMonth(), today.getFullYear()]);
  }

  function abs(val) {
    if (val < 0) {
      return -1 * val;
    }
    return val;
  }

  function monthlySumText() {
    if (monthlySum === 0) {
      return '';
    }
    return monthlySum > 0 ? 'lbs CE Produced' : 'lbs CE Reduced';
  }

  useEffect(() => {
    if (props.userReady && (document.getElementById('daily-container'))) {
      const dailyArrows = document.getElementsByClassName('daily-arrow-button');
      const dailyTableHeader = document.getElementsByClassName('daily-table-header');
      const dailyTable = document.getElementsByClassName('daily-table');
      if (props.userProfile.theme === 'dark') {
        document.getElementById('daily-top').classList.add('dark-daily-top');
        document.getElementById('daily-date-button').classList.add('dark-daily');
        document.getElementById('daily-date-button').classList.remove('light-daily');
        for (let i = 0; i < dailyArrows.length; i++) {
          dailyArrows[i].classList.add('dark-daily');
          dailyArrows[i].classList.remove('light-daily');
        }
        for (let i = 0; i < dailyTableHeader.length; i++) {
          dailyTableHeader[i].classList.add('dark-daily-table-header');
          dailyTableHeader[i].classList.remove('light-daily-table-header');
        }
        for (let i = 0; i < dailyTable.length; i++) {
          dailyTable[i].classList.add('dark-daily-table');
          dailyTable[i].classList.remove('light-daily-table');
        }
      } else {
        document.getElementById('daily-date-button').classList.add('light-daily');
        document.getElementById('daily-top').classList.remove('dark-daily-top');
        document.getElementById('daily-date-button').classList.remove('dark-daily');
        for (let i = 0; i < dailyArrows.length; i++) {
          dailyArrows[i].classList.add('light-daily');
          dailyArrows[i].classList.remove('dark-daily');
        }
        for (let i = 0; i < dailyTableHeader.length; i++) {
          dailyTableHeader[i].classList.add('light-daily-table-header');
          dailyTableHeader[i].classList.remove('dark-daily-table-header');
        }
        for (let i = 0; i < dailyTable.length; i++) {
          dailyTable[i].classList.add('light-daily-table');
          dailyTable[i].classList.remove('dark-daily-table');
        }
      }
    }
  }, [props]);

  return (!props.ready || !props.userReady) ? <Loader active>Loading data</Loader> :
    (
      <div id='daily-container'>
        <SideBar
          userReady={props.userReady}
          userProfile={props.userProfile}
          theme={props.userProfile.theme}
        />
        <Menu borderless
          id="daily-top">
          <Grid className={'middle aligned'} style={{ width: '100%', marginLeft: '25px' }}>
            <Grid.Column width={1} verticalAlign='middle'>
              <Button className='daily-arrow-button' circular animated={'fade'} onClick={handleClickPrev}>
                <Button.Content visible><Icon size='large' className='angle left'/></Button.Content>
                <Button.Content hidden>
                      Prev
                </Button.Content>
              </Button>
            </Grid.Column>
            <Grid.Column width={3} verticalAlign='middle'>
              <Button size='massive' id={'daily-date-button'} animated={'fade'} onClick={handleClickToday}
                fluid>
                <Button.Content visible
                  style={{ fontSize: '30px' }}>{`${monthString[currentMonthYr[0]]} ${currentMonthYr[1]}`}</Button.Content>
                <Button.Content hidden>
                      Go to current month
                </Button.Content>
              </Button>
            </Grid.Column>
            <Grid.Column width={1} verticalAlign='middle' floated='left'>
              <Button className='daily-arrow-button' circular animated={'fade'} onClick={handleClickNext}>
                <Button.Content visible><Icon size='large' className='angle right'/></Button.Content>
                <Button.Content hidden>
                      Next
                </Button.Content>
              </Button>
            </Grid.Column>
            <Grid.Column width={4} textAlign='center'>
              <Statistic size='small' color={monthlySumColor}>
                <Statistic.Value><Icon name='cloud'/>{abs(monthlySum).toFixed(2)}</Statistic.Value>
                <Statistic.Label id='daily-statistic-label'>
                  {monthlySumText()}</Statistic.Label>
              </Statistic>
            </Grid.Column>
            <Menu.Item position={'right'} style={{ marginRight: '100px' }}>
              <Button id='daily-add-button' href={'#/addTrip'}>Add</Button>
            </Menu.Item>
          </Grid>
        </Menu>
        <Table fixed
          className='daily-table'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className='daily-table-header'>Date</Table.HeaderCell>
              <Table.HeaderCell className='daily-table-header'>Mode of Transportation</Table.HeaderCell>
              <Table.HeaderCell className='daily-table-header'>Distance</Table.HeaderCell>
              <Table.HeaderCell className='daily-table-header'>mpg</Table.HeaderCell>
              <Table.HeaderCell className='daily-table-header'>Net Gallons</Table.HeaderCell>
              <Table.HeaderCell className='daily-table-header'>Net CE</Table.HeaderCell>
              <Table.HeaderCell className='daily-table-header'>Delete</Table.HeaderCell>
              <Table.HeaderCell className='daily-table-header'>Save</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className='daily-table'>
            {monthTrips.map((trip) => <TripItem key={trip._id} trip={trip}/>)}
            <Table.Row>
              <Table.Cell>{`${monthTrips.length > 0 ? monthTrips.length : 'No'} Trips listed`}</Table.Cell></Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
};

Daily.propTypes = {
  ready: PropTypes.bool.isRequired,
  trips: PropTypes.array.isRequired,
  username: PropTypes.string,
  userReady: PropTypes.bool.isRequired,
  userProfile: PropTypes.object,
};

export default withTracker(({ match }) => {
  const userSubscribe = Users.subscribeUser();
  const username = match.params._id;
  const ready = Meteor.subscribe(tripPublications.trip).ready() && username !== undefined;
  const trips = Trips.find({}).fetch();
  const userProfile = Users.getUserProfile(username);
  return {
    userReady: userSubscribe.ready(),
    ready,
    trips,
    username,
    userProfile,
  };
})(Daily);
