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
import { Users } from '../../../api/user/UserCollection';

const ManageUsers = ({ items, ready }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(Users.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const descriptionPairs = (user) => [
    { label: 'Email', value: user.email },
    { label: 'First Name', value: user.firstName },
    { label: 'Last Name', value: user.lastName },
    { label: 'Zip code', value: user.zipCode },
    { label: 'Goal', value: user.goal },
  ];

  const itemTitle = (user) => (<React.Fragment>
    {user.retired ? <Icon name="eye slash" /> : ''}
    <Icon nam="dropdown" />
    {`${user.firstName} ${user.lastName} (${user.email})`}
  </React.Fragment>);

  const handleUpdate = (doc) => {
    console.log('handleUpdate', doc);
    const collectionName = Users.getCollectionName();
    const updateData = {};
    updateData.id = doc._id;
    if (doc.owner) {
      updateData.owner = doc.owner;
    }
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
      <Header dividing>Manage Saved Commutes</Header>
      <ListCollection items={items} descriptionPairs={descriptionPairs} handleDelete={handleDelete} handleOpenUpdate={handleOpenUpdate} itemTitle={itemTitle} collection={Users} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete User?" />

    </Segment>
  ) : (<Dimmer active>
    <Loader>Loading Data</Loader>
  </Dimmer>));
};

ManageUsers.propTypes = {
  items: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const ready = Users.subscribeUserAdmin().ready();
  const items = Users.find({}, { sort: { email: 1 } }).fetch();
  return {
    ready,
    items,
  };
})(ManageUsers);
