import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { getMetricData } from '../../../api/utilities/Utilities';
import EditSavedCommuteModal from './EditSavedCommuteModal';
import DeleteSavedCommuteModal from './DeleteSavedCommuteModal';

const SavedCommutesRow = (props) => {
  const distanceMiles = props.savedCommute.distanceMiles;
  const mpg = props.savedCommute.mpg;

  let distance;
  let mpgKML;

  if (props.metric) {
    const metricData = getMetricData(distanceMiles, mpg, 0, 0);
    distance = metricData.distance;
    mpgKML = metricData.mpgKML;
  } else {
    distance = distanceMiles;
    mpgKML = mpg;
  }

  return (
    <Table.Row>
      <Table.Cell>{props.savedCommute.name}</Table.Cell>
      <Table.Cell>{props.savedCommute.mode}</Table.Cell>
      <Table.Cell>{distance.toFixed(2)}</Table.Cell>
      <Table.Cell>{mpgKML.toFixed(2)}</Table.Cell>
      <Table.Cell>
        <EditSavedCommuteModal savedCommute={props.savedCommute}/>
        <DeleteSavedCommuteModal savedCommute={props.savedCommute} metric={props.metric}/>
      </Table.Cell>
    </Table.Row>
  );
};

SavedCommutesRow.propTypes = {
  savedCommute: PropTypes.object.isRequired,
  metric: PropTypes.bool.isRequired,
};

export default SavedCommutesRow;
