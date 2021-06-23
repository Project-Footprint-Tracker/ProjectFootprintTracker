import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { getTripCE } from '../../api/utilities/CEData';
import { tripModes } from '../../api/utilities/constants';

const TripHistoryRow = (props) => {
  const eImpact = getTripCE(props.trip.milesTraveled, props.trip.mpg);
  const numStyle = props.trip.mode === tripModes.GAS_CAR ?
    { color: 'red' } : { color: 'green' };

  return (
    <Table.Row>
      <Table.Cell>{props.trip.date.toLocaleDateString()}</Table.Cell>
      <Table.Cell>{props.trip.mode}</Table.Cell>
      <Table.Cell>{props.trip.milesTraveled.toFixed(2)}</Table.Cell>
      <Table.Cell>{props.trip.mpg.toFixed(2)}</Table.Cell>
      <Table.Cell style={numStyle}>{eImpact.cO2Reduced}</Table.Cell>
      <Table.Cell style={numStyle}>{eImpact.fuelSaved}</Table.Cell>
    </Table.Row>
  );
};

TripHistoryRow.propTypes = {
  trip: PropTypes.object.isRequired,
};

export default withRouter(TripHistoryRow);
