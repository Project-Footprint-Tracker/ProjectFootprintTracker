import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Trips } from '../../api/trip/TripCollection';
import TripItem from '../components/TripItem';
import NavBar from '../components/NavBar';

/** Renders a table containing all of the Trip documents. Use <TripItem> to render each row. */
class TripHistory extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
      <div>
        <NavBar/>
        <Container>
          <Header as="h2" textAlign="center">Trip History - Using to Test</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Distance Traveled (miles)</Table.HeaderCell>
                <Table.HeaderCell>Mode of Transportation</Table.HeaderCell>
                <Table.HeaderCell>Vehicle MPG</Table.HeaderCell>
                <Table.HeaderCell>VMT Saved (miles)</Table.HeaderCell>
                <Table.HeaderCell>Fuel Saved (gallons)</Table.HeaderCell>
                <Table.HeaderCell>CO2 Reduced (pounds)</Table.HeaderCell>
                <Table.HeaderCell>Owner</Table.HeaderCell>
                <Table.HeaderCell>County</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.trips.map((trip) => <TripItem key={trip._id} trip={trip} />)}
            </Table.Body>
          </Table>
        </Container>
      </div>
    );
  }
}

/** Require an array of Trip documents in the props. */
TripHistory.propTypes = {
  trips: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Trip documents.
  const subscription = Trips.subscribeTripCommunity();
  return {
    trips: Trips.find({}, {}).fetch(),
    ready: subscription.ready(),
  };
})(TripHistory);
