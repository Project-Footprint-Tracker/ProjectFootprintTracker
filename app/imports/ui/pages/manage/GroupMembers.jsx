import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Confirm, Dimmer, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { GroupMembers } from '../../../api/group/GroupMemberCollection';
import ListCollection from '../../components/manage/ListCollection';
import {
  handleCancelWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
} from '../../components/manage/utilities';

import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Groups } from '../../../api/group/GroupCollection';
import GroupMemberUpdateForm from '../../components/manage/GroupMemberUpdateForm';
import { Users } from '../../../api/user/UserCollection';
import GroupMemberAddForm from '../../components/manage/GroupMemberAddForm';

const ManageGroupMembers = ({ items, ready, users, groups }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleConfirmDelete = () => {
    const item = items.filter(i => i._id === idState)[0];
    const group = item.group;
    const oldMembers = item.members;
    const collectionName = GroupMembers.getCollectionName();
    oldMembers.forEach(m => {
      const instance = GroupMembers.find({ group, member: m }).fetch()[0];
      removeItMethod.callPromise({ collectionName, instance })
        .catch(error => swal('Error removing old members', error.message, 'error'));
    });
    setId('');
    setShowUpdateForm(false);
    setConfirmOpen(false);
  };

  const descriptionPairs = (item) => [
    { label: 'Name', value: item.group },
    { label: 'Members', value: item.members.join(', ') },
  ];

  const itemTitle = (item) => (<React.Fragment>
    <Icon nam="dropdown" />
    {item.group}
  </React.Fragment>);

  const handleUpdate = () => {
    setShowUpdateForm(false);
  };
  const item = items.filter(i => i._id === idState)[0];
  return (ready ? <Segment>
    <Header dividing>Manage Group Members</Header>
    {showUpdateForm ? <GroupMemberUpdateForm item={item} collection={GroupMembers} users={users} handleUpdate={handleUpdate} handleCancel={handleCancel} /> : <GroupMemberAddForm groups={groups} users={users} />}
    <ListCollection items={items} descriptionPairs={descriptionPairs} handleDelete={handleDelete} handleOpenUpdate={handleOpenUpdate} itemTitle={itemTitle} collection={GroupMembers} />
    <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Group Members?" />

  </Segment> : (<Dimmer active>
    <Loader>Loading Data</Loader>
  </Dimmer>));
};

ManageGroupMembers.propTypes = {
  items: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const ready = GroupMembers.subscribe().ready() && Groups.subscribe().ready() && Users.subscribeUserAdmin().ready();
  const users = Users.find({}, { sort: { email: 1 } }).fetch();
  const pairs = GroupMembers.find({}, { sort: { group: 1 } }).fetch();
  const usedGroups = _.uniq(pairs.map(p => p.group));
  const items = [];
  usedGroups.forEach((group) => {
    const m = pairs.filter(p => p.group === group);
    const members = m.map((mem) => mem.member);
    const g = {
      _id: ready && Groups.findDoc(group)._id,
      group,
      members,
    };
    items.push(g);
  });
  const groups = Groups.find({}, { sort: { name: 1 } }).fetch();
  return {
    ready,
    items,
    users,
    groups,
  };
})(ManageGroupMembers);
