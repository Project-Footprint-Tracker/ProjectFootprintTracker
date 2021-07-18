import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { getMetricData } from '../../../api/utilities/CEData';
import DeleteTripModal from './DeleteTripModal';
import EditTripModal from './EditTripModal';

const TripHistoryRow = (props) => {
  const milesTraveled = props.trip.milesTraveled;
  const mpg = props.trip.mpg;
  const ceSavedLbs = props.trip.ceSaved;
  const ceProducedLbs = props.trip.ceProduced;

  let distance;
  let mpgKML;
  let ceSaved;
  let ceProduced;

  if (props.metric) {
    const metricData = getMetricData(milesTraveled, mpg, ceSavedLbs, ceProducedLbs);
    distance = metricData.distance;
    mpgKML = metricData.mpgKML;
    ceSaved = metricData.ceSaved;
    ceProduced = metricData.ceProduced;
  } else {
    distance = milesTraveled;
    mpgKML = mpg;
    ceSaved = ceSavedLbs;
    ceProduced = ceProducedLbs;
  }

  ceSaved = ceSaved === 0 ? '' : ceSaved.toFixed(2);
  ceProduced = ceProduced === 0 ? '' : ceProduced.toFixed(2);

  return (
    <Table.Row>
      <Table.Cell>{props.trip.date.toLocaleDateString()}</Table.Cell>
      <Table.Cell>{props.trip.mode}</Table.Cell>
      <Table.Cell>{distance.toFixed(2)}</Table.Cell>
      <Table.Cell>{mpgKML.toFixed(2)}</Table.Cell>
      <Table.Cell style={{ color: 'green' }}>{ceSaved}</Table.Cell>
      <Table.Cell style={{ color: 'red' }}>{ceProduced}</Table.Cell>
      <Table.Cell>
        <EditTripModal trip={props.trip} savedCommutes={props.savedCommutes} />
        <DeleteTripModal trip={props.trip} metric={props.metric} />
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
