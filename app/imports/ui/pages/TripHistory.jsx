import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Form, Grid, Header, Loader, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Trips } from '../../api/trip/TripCollection';
import TripHistoryRow from '../components/trips/TripHistoryRow';
import { imperialUnits, metricUnits } from '../../api/utilities/constants';
import SavedCommutesModal from '../components/trips/SavedCommutesModal';
import { SavedCommutes } from '../../api/saved-commute/SavedCommute';
import AddTripModal from '../components/trips/AddTripModal';

const TripHistory = (props) => {
  const [metric, setMetric] = useState(false);

  const handleChangeUnit = (prevState) => setMetric(!prevState);

  const headerUnits = {};

  if (metric) {
    headerUnits.distance = metricUnits.distance;
    headerUnits.mpgKMLUnit = metricUnits.mpgKML;
    headerUnits.cO2Reduced = metricUnits.cO2Reduced;
    headerUnits.fuelSaved = metricUnits.fuelSaved;
  } else {
    headerUnits.distance = imperialUnits.distance;
    headerUnits.mpgKMLUnit = imperialUnits.mpgKML;
    headerUnits.cO2Reduced = imperialUnits.cO2Reduced;
    headerUnits.fuelSaved = imperialUnits.fuelSaved;
  }

  return (props.ready ? (
    <Container style={{ margin: '2rem 1rem', width: 1000 }}>
      <Header as='h1' textAlign='center'>
          MY TRIP HISTORY
        <Header.Subheader>
          <Grid.Column as={Form.Radio}
            toggle
            label='Convert to metric'
            checked={metric}
            onChange={() => handleChangeUnit(metric)}
          />
        </Header.Subheader>
      </Header>
      <Grid.Row>
        <Grid.Column>
          <AddTripModal
            owner={props.owner}
            savedCommutes={props.savedCommutes}
            metric={metric}
          />
          <SavedCommutesModal
            owner={props.owner}
            savedCommutes={props.savedCommutes}
            metric={metric}
          />
        </Grid.Column>
      </Grid.Row>
      <Table fixed striped compact textAlign='center'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={2}>Date</Table.HeaderCell>
            <Table.HeaderCell width={3}>Mode of Transportation</Table.HeaderCell>
            <Table.HeaderCell width={2}>Distance Traveled ({headerUnits.distance})</Table.HeaderCell>
            <Table.HeaderCell width={2}>{headerUnits.mpgKMLUnit}</Table.HeaderCell>
            <Table.HeaderCell width={2}>CO2 Reduced ({headerUnits.cO2Reduced})</Table.HeaderCell>
            <Table.HeaderCell width={2}>Fuel Saved ({headerUnits.fuelSaved})</Table.HeaderCell>
            <Table.HeaderCell width={2}/>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.trips.map((trip) => <TripHistoryRow
            key={trip._id}
            trip={trip}
            savedCommutes={props.savedCommutes}
            metric={metric}
          />)}
        </Table.Body>
      </Table>
    </Container>
  ) :
    <Loader active>Getting Trip Data</Loader>);
};

TripHistory.propTypes = {
  trips: PropTypes.array.isRequired,
  savedCommutes: PropTypes.array.isRequired,
  owner: PropTypes.string,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to Trip documents.
  const owner = Meteor.user()?.username;
  const ready = Trips.subscribeTrip().ready() && SavedCommutes.subscribeSavedCommute().ready() && owner !== undefined;
  const trips = Trips.find({ owner }, { sort: { inputDate: -1 } }).fetch();
  const savedCommutes = SavedCommutes.find({}, { sort: { name: 'asc' } }).fetch();
  return {
    trips,
    savedCommutes,
    owner,
    ready,
  };
})(TripHistory);
