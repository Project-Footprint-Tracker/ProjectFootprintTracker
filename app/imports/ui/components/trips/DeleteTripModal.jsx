import React, { useState } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Trips } from '../../../api/trip/TripCollection';

const DeleteTripModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleDelete = () => {
    if (Trips.removeIt(props.tripID)) {
      handleModalClose();
    }
  };

  return (
    <Modal
      size='tiny'
      dimmer
      closeIcon
      open={modalOpen}
      onClose={handleModalClose}
      onOpen={handleModalOpen}
      trigger={<Icon style={{ cursor: 'pointer' }} name='trash alternate outline'/>}
    >
      <Modal.Header>Delete Trip</Modal.Header>
      <Modal.Content>Are you sure want to delete selected data?</Modal.Content>
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

DeleteTripModal.propTypes = {
  tripID: PropTypes.string,
};

export default DeleteTripModal;
