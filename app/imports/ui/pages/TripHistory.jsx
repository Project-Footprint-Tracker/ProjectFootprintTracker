import React from 'react';
import { Container, Grid, Header, Loader, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Trips } from '../../api/trip/TripCollection';
import TripHistoryRow from '../components/TripHistoryRow';

const TripHistory = (props) => (props.ready ? (
  <Container style={{ margin: '2rem 1rem', width: 1000 }}>
    <Grid id='trip-history' container>
      <Grid.Row>
        <Grid.Column
          as={Header}
          size='huge'
          textAlign='center'
          style={{ marginTop: '10px' }}
          content='My Trip History'
        />
      </Grid.Row>
      <Grid.Row>
        <Table striped singleLine compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Mode of Transportation</Table.HeaderCell>
              <Table.HeaderCell>Distance Traveled (miles)</Table.HeaderCell>
              <Table.HeaderCell>CO2 Reduced (lbs)</Table.HeaderCell>
              <Table.HeaderCell>Fuel Saved (gal)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.trips.map((trip) => <TripHistoryRow
              key={trip._id}
              trip={trip}
            />)}
          </Table.Body>
        </Table>
      </Grid.Row>
    </Grid>
  </Container>
) :
  <Loader active>Getting Trip Data</Loader>);

TripHistory.propTypes = {
  trips: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to Trip documents.
  const ready = Trips.subscribeTrip().ready();
  const trips = Trips.find({}, { sort: { inputDate: -1 } }).fetch();
  return {
    trips,
    ready,
  };
})(TripHistory);
