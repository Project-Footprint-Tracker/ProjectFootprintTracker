import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Confirm, Dimmer, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import ListCollection from '../../components/manage/ListCollection';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
} from '../../components/manage/utilities';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import { UserVehicles } from '../../../api/vehicle/UserVehicleCollection';
import UserVehicleAddForm from '../../components/manage/UserVehicleAddForm';
import UserVehicleUpdateForm from '../../components/manage/UserVehicleUpdateForm';

const ManageUserVehicles = ({ items, ready, users }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(UserVehicles.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const descriptionPairs = (vehicle) => [
    { label: 'Owner', value: vehicle.owner },
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'Year', value: vehicle.year },
    { label: 'Name', value: vehicle.name },
    { label: 'Mpg', value: vehicle.MPG },
  ];

  const itemTitle = (userVehicle) => (<React.Fragment>
    {userVehicle.retired ? <Icon name="eye slash" /> : ''}
    <Icon nam="dropdown" />
    {`${userVehicle.owner} ${userVehicle.make} ${userVehicle.model} ${userVehicle.year} (${userVehicle.name})`}
  </React.Fragment>);

  const handleUpdate = (doc) => {
    // console.log('handleUpdate', doc);
    const collectionName = UserVehicles.getCollectionName();
    const updateData = {};
    updateData.id = doc._id;
    if (doc.name) {
      updateData.name = doc.name;
    }
    if (doc.make) {
      updateData.make = doc.make;
    }
    if (doc.model) {
      updateData.model = doc.model;
    }
    if (doc.year) {
      updateData.year = doc.year;
    }
    if (doc.price) {
      updateData.price = doc.price;
    }
    if (doc.MPG) {
      updateData.MPG = doc.MPG;
    }
    if (doc.fuelSpending) {
      updateData.fuelSpending = doc.fuelSpending;
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
      <Header dividing>Manage User Vehicles</Header>
      {showUpdateForm ? (<UserVehicleUpdateForm collection={UserVehicles} id={idState} handleUpdate={handleUpdate} itemTitle={itemTitle} handleCancel={handleCancel} />) : (<UserVehicleAddForm users={users} />) }
      <ListCollection items={items} descriptionPairs={descriptionPairs} handleDelete={handleDelete} handleOpenUpdate={handleOpenUpdate} itemTitle={itemTitle} collection={UserVehicles} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Vehicle?" />

    </Segment>
  ) : (<Dimmer active>
    <Loader>Loading Data</Loader>
  </Dimmer>));
};

ManageUserVehicles.propTypes = {
  items: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const ready = Users.subscribeUserAdmin().ready() && UserVehicles.subscribeUserVehicleCumulative().ready();
  const users = Users.find({}, { sort: { email: 1 } }).fetch();
  const items = UserVehicles.find({}, { sort: { owner: 1 } }).fetch();
  return {
    ready,
    items,
    users,
  };
})(ManageUserVehicles);
