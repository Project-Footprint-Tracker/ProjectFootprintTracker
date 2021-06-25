import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { getMetricData, getTripCE } from '../../../api/utilities/CEData';
import { tripModes } from '../../../api/utilities/constants';
import DeleteTripModal from './DeleteTripModal';
import EditTripModal from './EditTripModal';

const TripHistoryRow = (props) => {
  const milesTraveled = props.trip.milesTraveled;
  const mpg = props.trip.mpg;
  const { cO2ReducedLbs, fuelSavedGal } = getTripCE(props.trip.milesTraveled, props.trip.mpg);

  let distance;
  let mpgKML;
  let cO2Reduced;
  let fuelSaved;

  if (props.metric) {
    const metricData = getMetricData(milesTraveled, mpg, cO2ReducedLbs, fuelSavedGal);
    distance = metricData.distance;
    mpgKML = metricData.mpgKML;
    cO2Reduced = metricData.cO2Reduced;
    fuelSaved = metricData.fuelSaved;
  } else {
    distance = milesTraveled;
    mpgKML = mpg;
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
      <Table.Cell>{mpgKML.toFixed(2)}</Table.Cell>
      <Table.Cell style={numStyle}>{cO2Reduced.toFixed(2)}</Table.Cell>
      <Table.Cell style={numStyle}>{fuelSaved.toFixed(2)}</Table.Cell>
      <Table.Cell>
        <EditTripModal trip={props.trip} savedCommutes={props.savedCommutes}/>
        <DeleteTripModal tripID={props.trip._id}/>
      </Table.Cell>
    </Table.Row>
  );
};

TripHistoryRow.propTypes = {
  trip: PropTypes.object.isRequired,
  savedCommutes: PropTypes.array.isRequired,
  metric: PropTypes.bool.isRequired,
};

export default TripHistoryRow;
