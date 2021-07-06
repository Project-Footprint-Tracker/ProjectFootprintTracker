import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Confirm, Dimmer, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import moment from 'moment';
import ListCollection from '../../components/manage/ListCollection';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
} from '../../components/manage/utilities';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Trips } from '../../../api/trip/TripCollection';
import TripAddForm from '../../components/manage/TripAddForm';
import TripUpdateForm from '../../components/manage/TripUpdateForm';
import { Users } from '../../../api/user/UserCollection';

const ManageTrips = ({ items, ready, users }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(Trips.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const descriptionPairs = (trip) => [
    { label: 'Date', value: moment(trip.date).format('MM/DD/YYYY') },
    { label: 'Owner', value: trip.owner },
    { label: 'Distance', value: trip.milesTraveled },
    { label: 'Mode', value: trip.mode },
    { label: 'Mpg', value: trip.mpg },
    { label: 'Passengers', value: trip.passengers },
    { label: 'CE Saved', value: Number(trip.ceSaved).toFixed(2) },
    { label: 'CE Produced', value: Number(trip.ceProduced).toFixed(2) },
  ];
  const itemTitle = (trip) => (<React.Fragment>
    {trip.retired ? <Icon name="eye slash" /> : ''}
    <Icon nam="dropdown" />
    {`${trip.owner}: ${moment(trip.date).format('MM/DD/YYYY')} ${trip.mode} ${trip.milesTraveled} miles`}
  </React.Fragment>);

  const handleUpdate = (doc) => {
    // console.log('handleUpdate', doc);
    const collectionName = Trips.getCollectionName();
    const updateData = {};
    updateData.id = doc._id;
    if (doc.date) {
      updateData.date = doc.date;
    }
    if (doc.milesTraveled) {
      updateData.milesTraveled = doc.milesTraveled;
    }
    if (doc.mode) {
      updateData.mode = doc.mode;
    }
    if (doc.mpg) {
      updateData.mpg = doc.mpg;
    }
    if (doc.passengers) {
      updateData.passengers = doc.passengers;
    }
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error Updating', error.message, 'error'))
      .then(() => {
        swal('Success', 'Update Succeeded', 'success');
        setShowUpdateForm(false);
        setId('');
      });
  };

  return (ready ? (
    <Segment>
      <Header dividing>Manage Trips</Header>
      {showUpdateForm ? <TripUpdateForm id={idState} handleCancel={handleCancel} users={users} collection={Trips} handleUpdate={handleUpdate} itemTitle={itemTitle} /> : <TripAddForm users={users} />}
      <ListCollection items={items} descriptionPairs={descriptionPairs} handleDelete={handleDelete} handleOpenUpdate={handleOpenUpdate} itemTitle={itemTitle} collection={Trips} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Trip?" />

    </Segment>
  ) : (<Dimmer active>
    <Loader>Loading Data</Loader>
  </Dimmer>));
};

ManageTrips.propTypes = {
  items: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const ready = Trips.subscribeTripCommunity().ready() && Users.subscribeUserAdmin().ready();
  const items = Trips.find({}, { sort: { owner: 1, date: 1 } }).fetch();
  const users = Users.find({}, { sort: { email: 1 } }).fetch();
  return {
    ready,
    items,
    users,
  };
})(ManageTrips);
