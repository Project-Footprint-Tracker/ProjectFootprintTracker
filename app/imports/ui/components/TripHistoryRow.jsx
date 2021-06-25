import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { getMetricData, getTripCE } from '../../api/utilities/CEData';
import { tripModes } from '../../api/utilities/constants';

const TripHistoryRow = (props) => {
  const milesTraveled = props.trip.milesTraveled;
  const { cO2ReducedLbs, fuelSavedGal } = getTripCE(props.trip.milesTraveled, props.trip.mpg);

  let distance;
  let cO2Reduced;
  let fuelSaved;

  if (props.metric) {
    const metricData = getMetricData(milesTraveled, cO2ReducedLbs, fuelSavedGal);
    distance = metricData.distance;
    cO2Reduced = metricData.cO2Reduced;
    fuelSaved = metricData.fuelSaved;
  } else {
    distance = milesTraveled;
    cO2Reduced = cO2ReducedLbs;
    fuelSaved = fuelSavedGal;
  }

  const numStyle = props.trip.mode === tripModes.GAS_CAR ?
    { color: 'red' } : { color: 'green' };

  return (
    <Table.Row>
      <Table.Cell>{props.trip.date.toLocaleDateString()}</Table.Cell>
      <Table.Cell>{props.trip.mode}</Table.Cell>
      <Table.Cell>{distance.toFixed(2)}</Table.Cell>
      <Table.Cell>{props.trip.mpg.toFixed(2)}</Table.Cell>
      <Table.Cell style={numStyle}>{cO2Reduced.toFixed(2)}</Table.Cell>
      <Table.Cell style={numStyle}>{fuelSaved.toFixed(2)}</Table.Cell>
    </Table.Row>
  );
};

TripHistoryRow.propTypes = {
  trip: PropTypes.object.isRequired,
  metric: PropTypes.bool.isRequired,
};

export default withRouter(TripHistoryRow);
