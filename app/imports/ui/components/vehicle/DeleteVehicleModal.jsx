import React, { useState } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { UserVehicles } from '../../../api/vehicle/UserVehicleCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';

const DeleteVehicleModal = ({ vehicle }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleDelete = () => {
    const collectionName = UserVehicles.getCollectionName();
    const instance = vehicle._id;
    removeItMethod.callPromise({ collectionName, instance })
      .then(() => {
        swal('Success', 'Vehicle deleted successfully', 'success');
        handleModalClose();
        // eslint-disable-next-line no-undef
        window.location.reload();
      })
      .catch(error => swal('Error', error.message, 'error'));
  };

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
      <Modal.Header>Delete Modal</Modal.Header>
      <Modal.Content>Are you sure you want to delete the vehicle: {vehicle.name}?</Modal.Content>
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

DeleteVehicleModal.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default DeleteVehicleModal;
