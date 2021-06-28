import React, { useState } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Trips } from '../../../api/trip/TripCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { getMetricData } from '../../../api/utilities/CEData';

const DeleteTripModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleDelete = () => {
    const collectionName = Trips.getCollectionName();
    const instance = props.trip._id;
    removeItMethod.callPromise({ collectionName, instance })
      .then(() => handleModalClose())
      .catch(error => swal('Error', error.message, 'error'));
  };
  let distance;
  if (props.metric) {
    const metricData = getMetricData(props.trip.milesTraveled, props.trip.mpg, 0, 0);
    distance = metricData.distance;
  } else {
    distance = props.trip.milesTraveled;
  }
  const label = props.metric ? 'km' : 'mi';

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
      <Modal.Content>Are you sure want to delete the {`${distance} ${label} ${props.trip.mode}`} trip?</Modal.Content>
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
  trip: PropTypes.object.isRequired,
  metric: PropTypes.bool,
};

export default DeleteTripModal;
