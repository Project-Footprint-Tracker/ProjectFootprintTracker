import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Table } from 'semantic-ui-react';
import { imperialUnits, metricUnits } from '../../../api/utilities/constants';
import SavedCommutesRow from './SavedCommutesRow';

const SavedCommutesModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);

  const handleModalClose = () => setModalOpen(false);

  let distanceUnit;
  let mpgKMLUnit;

  if (props.metric) {
    distanceUnit = metricUnits.distance;
    mpgKMLUnit = metricUnits.mpgKML;
  } else {
    distanceUnit = imperialUnits.distance;
    mpgKMLUnit = imperialUnits.mpgKML;
  }

  return (
    <Modal
      size='small'
      closeIcon
      open={modalOpen}
      onClose={handleModalClose}
      onOpen={handleModalOpen}
      trigger={<Button size='tiny' color='black'>Saved Commutes</Button>}
    >
      <Modal.Header content='Saved Commutes'/>
      <Modal.Content>
        <Table fixed striped compact basic='very' textAlign='center'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Default Mode of Transportation</Table.HeaderCell>
              <Table.HeaderCell>Distance ({distanceUnit})</Table.HeaderCell>
              <Table.HeaderCell>{mpgKMLUnit}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.savedCommutes.map((savedCommute) => <SavedCommutesRow
              key={savedCommute._id}
              savedCommute={savedCommute}
              metric={props.metric}
            />)}
          </Table.Body>
        </Table>
      </Modal.Content>
    </Modal>
  );
};

SavedCommutesModal.propTypes = {
  owner: PropTypes.string.isRequired,
  savedCommutes: PropTypes.array.isRequired,
  metric: PropTypes.bool.isRequired,
};

export default SavedCommutesModal;
