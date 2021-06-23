import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

const TripHistoryRow = (props) => (
  <Table.Row>
    <Table.Cell>{props.trip.date.toLocaleDateString()}</Table.Cell>
    <Table.Cell>{props.trip.mode}</Table.Cell>
    <Table.Cell>{props.trip.milesTraveled}</Table.Cell>
    <Table.Cell/>
    <Table.Cell/>
  </Table.Row>
);

TripHistoryRow.propTypes = {
  trip: PropTypes.object.isRequired,
};

export default withRouter(TripHistoryRow);
