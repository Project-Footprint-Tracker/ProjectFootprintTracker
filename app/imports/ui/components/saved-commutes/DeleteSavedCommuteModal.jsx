import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { SavedCommutes } from '../../../api/saved-commute/SavedCommuteCollection';
import { getMetricData } from '../../../api/utilities/CEData';
import { imperialUnits, metricUnits } from '../../../api/utilities/constants';

const DeleteSavedCommuteModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleDelete = () => {
    const collectionName = SavedCommutes.getCollectionName();
    const instance = props.savedCommute._id;
    removeItMethod.callPromise({ collectionName, instance })
      .then(() => {
        swal('Success', 'Saved commute deleted successfully', 'success');
        handleModalClose();
      })
      .catch(error => swal('Error', error.message, 'error'));
  };

  let distance;
  if (props.metric) {
    const metricData = getMetricData(props.savedCommute.distanceMiles, 0, 0, 0);
    distance = metricData.distance;
  } else {
    distance = props.savedCommute.distanceMiles;
  }
  const label = props.metric ? metricUnits.distance : imperialUnits.distance;

  return (
    <Modal
      size='tiny'
      dimmer
      closeIcon
      open={modalOpen}
      onClose={handleModalClose}
      onOpen={handleModalOpen}
      trigger={<Icon style={{ cursor: 'pointer' }} name='trash alternate outline' />}
    >
      <Modal.Header>Delete Trip</Modal.Header>
      <Modal.Content>Are you sure want to delete the saved commute: {props.savedCommute.name}, {distance} {label}?</Modal.Content>
      <Modal.Actions>
        <Button
          icon
          negative
          labelPosition='right'
          onClick={() => handleDelete()}
        >
            Delete
          <Icon name='trash alternate outline'/>
        </Button>
        <Button
          icon
          labelPosition='right'
          onClick={handleModalClose}
        >
            Cancel
          <Icon name='x'/>
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

DeleteSavedCommuteModal.propTypes = {
  savedCommute: PropTypes.object.isRequired,
  metric: PropTypes.bool.isRequired,
};

export default DeleteSavedCommuteModal;
