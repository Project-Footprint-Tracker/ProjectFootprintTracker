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
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
} from '../../components/manage/utilities';

import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Groups } from '../../../api/group/GroupCollection';

const ManageGroupMembers = ({ items, ready }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(GroupMembers.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const descriptionPairs = (item) => [
    { label: 'Name', value: item.group },
    { label: 'Members', value: item.members.join(', ') },
  ];

  const itemTitle = (item) => (<React.Fragment>
    <Icon nam="dropdown" />
    {item.group}
  </React.Fragment>);

  const handleUpdate = (doc) => {
    console.log('handleUpdate', doc);
  };

  return (ready ? <Segment>
    <Header dividing>Manage Group Members</Header>
    <ListCollection items={items} descriptionPairs={descriptionPairs} handleDelete={handleDelete} handleOpenUpdate={handleOpenUpdate} itemTitle={itemTitle} collection={GroupMembers} />

  </Segment> : (<Dimmer active>
    <Loader>Loading Data</Loader>
  </Dimmer>));
};

ManageGroupMembers.propTypes = {
  items: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const ready = GroupMembers.subscribe().ready() && Groups.subscribe().ready();
  const pairs = GroupMembers.find({}, { sort: { group: 1 } }).fetch();
  const groups = _.uniq(pairs.map(p => p.group));
  const items = [];
  groups.forEach((group) => {
    const m = pairs.filter(p => p.group === group);
    const members = m.map((mem) => mem.member);
    const g = {
      _id: ready && Groups.findDoc(group)._id,
      group,
      members,
    };
    items.push(g);
  });
  console.log(items, ready);
  return {
    ready,
    items,
  };
})(ManageGroupMembers);
