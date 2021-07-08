import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Confirm, Dimmer, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { Groups } from '../../../api/group/GroupCollection';
import ListCollection from '../../components/manage/ListCollection';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
} from '../../components/manage/utilities';
import GroupAddForm from '../../components/manage/GroupAddForm';
import GroupUpdateForm from '../../components/manage/GroupUpdateForm';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

const ManageGroups = ({ items, ready }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(Groups.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const descriptionPairs = (group) => [
    { label: 'Name', value: group.name },
    { label: 'Description', value: group.description },
    { label: 'Retired', value: group.retired ? 'True' : 'False' },
  ];

  const itemTitle = (group) => (<React.Fragment>
    {group.retired ? <Icon name="eye slash" /> : ''}
    <Icon nam="dropdown" />
    {group.name}
  </React.Fragment>);

  const handleUpdate = (doc) => {
    const collectionName = Groups.getCollectionName();
    const updateData = {};
    updateData.id = doc._id;
    if (doc.name) {
      updateData.name = doc.name;
    }
    if (doc.description) {
      updateData.description = doc.description;
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
      <Header dividing>Manage Groups</Header>
      {showUpdateForm ? <GroupUpdateForm id={idState} handleCancel={handleCancel} itemTitle={itemTitle} collection={Groups} handleUpdate={handleUpdate} /> : <GroupAddForm />}
      <ListCollection items={items} descriptionPairs={descriptionPairs} handleDelete={handleDelete} handleOpenUpdate={handleOpenUpdate} itemTitle={itemTitle} collection={Groups} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Group?" />
    </Segment>
  ) : (<Dimmer active>
    <Loader>Loading Data</Loader>
  </Dimmer>));
};

ManageGroups.propTypes = {
  items: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const ready = Groups.subscribe().ready();
  const items = Groups.find({}, { sort: { name: 1 } }).fetch();
  // console.log(ready, items);
  return {
    ready,
    items,
  };
})(ManageGroups);
