import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Confirm, Dimmer, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import ListCollection from '../../components/manage/ListCollection';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
} from '../../components/manage/utilities';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { SavedCommutes } from '../../../api/saved-commute/SavedCommuteCollection';
import SavedCommuteAddForm from '../../components/manage/SavedCommuteAddForm';
import SavedCommuteUpdateForm from '../../components/manage/SavedCommuteUpdateForm';
import { Users } from '../../../api/user/UserCollection';

const ManageSavedCommutes = ({ items, ready, users }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(SavedCommutes.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const descriptionPairs = (commute) => [
    { label: 'Owner', value: commute.owner },
    { label: 'Name', value: commute.name },
    { label: 'Distance', value: commute.distanceMiles },
    { label: 'Mode', value: commute.mode },
    { label: 'Mpg', value: commute.mpg },
  ];

  const itemTitle = (commute) => (<React.Fragment>
    {commute.retired ? <Icon name="eye slash" /> : ''}
    <Icon nam="dropdown" />
    {commute.owner}: {commute.name}
  </React.Fragment>);

  const handleUpdate = (doc) => {
    const collectionName = SavedCommutes.getCollectionName();
    const updateData = {};
    updateData.id = doc._id;
    if (doc.owner) {
      updateData.owner = doc.owner;
    }
    if (doc.name) {
      updateData.name = doc.name;
    }
    if (doc.distanceMiles) {
      updateData.distanceMiles = doc.distanceMiles;
    }
    if (doc.mode) {
      updateData.mode = doc.mode;
    }
    if (_.isBoolean(doc.retired)) {
      updateData.retired = doc.retired;
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
      {showUpdateForm ? <SavedCommuteUpdateForm id={idState} handleCancel={handleCancel} itemTitle={itemTitle} collection={SavedCommutes} handleUpdate={handleUpdate} users={users}/> : (<SavedCommuteAddForm users={users} />)}
      <ListCollection items={items} descriptionPairs={descriptionPairs} handleDelete={handleDelete} handleOpenUpdate={handleOpenUpdate} itemTitle={itemTitle} collection={SavedCommutes} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Saved Commute?" />

    </Segment>
  ) : (<Dimmer active>
    <Loader>Loading Data</Loader>
  </Dimmer>));
};

ManageSavedCommutes.propTypes = {
  items: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const ready = SavedCommutes.subscribeSavedCommuteCommunity().ready() && Users.subscribeUserAdmin().ready();
  const items = SavedCommutes.find({}, { sort: { owner: 1 } }).fetch();
  const users = Users.find({}, { sort: { email: 1 } }).fetch();
  return {
    ready,
    items,
    users,
  };
})(ManageSavedCommutes);
