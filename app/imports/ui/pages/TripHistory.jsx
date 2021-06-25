import React, { useState } from 'react';
import { Container, Form, Grid, Header, Loader, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Trips } from '../../api/trip/TripCollection';
import TripHistoryRow from '../components/TripHistoryRow';
import { imperialUnits, metricUnits } from '../../api/utilities/constants';

const TripHistory = (props) => {
  const [metric, setMetric] = useState(false);

  const handleChangeUnit = (prevState) => setMetric(!prevState);

  const headerUnits = {};

  if (metric) {
    headerUnits.distance = metricUnits.distance;
    headerUnits.cO2Reduced = metricUnits.cO2Reduced;
    headerUnits.fuelSaved = metricUnits.fuelSaved;
  } else {
    headerUnits.distance = imperialUnits.distance;
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
      <Table fixed striped compact textAlign='center'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Mode of Transportation</Table.HeaderCell>
            <Table.HeaderCell>Distance Traveled ({headerUnits.distance})</Table.HeaderCell>
            <Table.HeaderCell>MPG</Table.HeaderCell>
            <Table.HeaderCell>CO2 Reduced ({headerUnits.cO2Reduced})</Table.HeaderCell>
            <Table.HeaderCell>Fuel Saved ({headerUnits.fuelSaved})</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.trips.map((trip) => <TripHistoryRow
            key={trip._id}
            trip={trip}
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
