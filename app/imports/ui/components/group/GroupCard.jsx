import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import {
  Accordion,
  Button,
  Card,
  Form,
  Header,
  Loader,
  Modal,
  Segment,
} from 'semantic-ui-react';
import swal from 'sweetalert';
import { GroupMembers } from '../../../api/group/GroupMemberCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Groups } from '../../../api/group/GroupCollection';

const GroupCard = ({
  userGroups,
  userGroupsNames,
  allGroups,
  owner,
  ready,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [groupChoice, setGroupChoice] = useState('');
  const [descriptionChoice, setDescriptionChoice] = useState('No selected group.');

  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newName, setNewName] = useState('');

  const handleDeleteModalClose = () => setDeleteModalOpen(false);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);

  const handleAddModalClose = () => setAddModalOpen(false);
  const handleAddModalOpen = () => {
    setAddModalOpen(true);
    setGroupChoice('');
    setDescriptionChoice('No selected group.');
    setShowNewGroupForm(false);
    setNewName('');
    setNewDescription('');
  };

  const groupsCollection = Groups.getCollectionName();
  const groupMembersCollection = GroupMembers.getCollectionName();

  const getGroupChoices = () => {
    const choices = [];
    allGroups.forEach(group => {
      if (!userGroupsNames.includes(group.name)) {
        choices.push({
          key: choices.length + 1,
          text: group.name,
          value: group._id,
        });
      }
    });

    choices.push({
      key: choices.length + 1,
      text: 'Other',
      value: 'other',
    });

    return choices;
  };

  const handleChange = (e, { name, value }) => {
    if (name === 'group') {
      if (value === 'other') {
        setGroupChoice(value);
        const otherDescription = allGroups.length === 0 ?
          'There are no existing groups yet. Be the first to create one!' :
          'Create your own group!';
        setDescriptionChoice(otherDescription);
        setShowNewGroupForm(true);
      } else {
        const group = allGroups.find(({ _id }) => _id === value);
        setGroupChoice(group.name);
        setDescriptionChoice(group.description);
      }
    } else if (name === 'name') {
      setNewName(value);
    } else if (name === 'description') {
      setNewDescription(value);
    }
  };

  const getNewGroupForm = () => (showNewGroupForm ?
    <div>
      <Form.Input
        name='name'
        label='Name of your group'
        value={newName}
        required
        onChange={handleChange}
      />
      <Form.TextArea
        name='description'
        label='Describe your group'
        value={newDescription}
        required
        onChange={handleChange}
      />
    </div> : null
  );

  const handleJoin = () => {
    let group = groupChoice;
    if (groupChoice === 'other') {
      const definitionData = {};
      definitionData.name = newName;
      group = newName;
      definitionData.description = newDescription;
      const collectionName = groupsCollection;
      defineMethod.callPromise({ collectionName, definitionData })
        .then(() => {
          swal('Success', 'Group created successfully', 'success');
        })
        .catch((error) => swal('Error', error.message, 'error'));
    }
    const definitionData = {};
    definitionData.group = group;
    definitionData.member = owner;
    const collectionName = groupMembersCollection;
    defineMethod.callPromise({ collectionName, definitionData })
      .then(() => {
        swal('Success', 'Group joined successfully', 'success');
        handleAddModalClose();
      })
      .catch((error) => swal('Error', error.message, 'error'));
  };

  const handleDelete = (id) => {
    const instance = id;
    const collectionName = groupMembersCollection;
    removeItMethod.callPromise({ collectionName, instance })
      .then(() => {
        swal('Success', 'You have been removed from group successfully', 'success');
        handleDeleteModalClose();
      })
      .catch(error => swal('Error', error.message, 'error'));
  };

  const panels = [];
  const getDescription = (groupName) => {
    const group = allGroups.find(({ name }) => name === groupName);
    return (group ? group.description : '');
  };
  userGroups.forEach(group => {
    panels.push({
      key: group.group,
      title: {
        content: group.group,
        style: { fontSize: '14px' },
      },
      content: {
        content: (
          <div style={{ paddingLeft: '2rem' }}>
            <b>Description</b>: {getDescription(group.group)}
            <br/>
            <br/>
            <Modal
              size='tiny'
              dimmer
              closeIcon
              open={deleteModalOpen}
              onClose={handleDeleteModalClose}
              onOpen={handleDeleteModalOpen}
              trigger={<Button compact color='black' size='tiny' content='Leave' />}
            >
              <Modal.Header>Leave Group</Modal.Header>
              <Modal.Content>Are you sure you want to be removed from group: {group.group}?</Modal.Content>
              <Modal.Actions>
                <Button
                  negative
                  onClick={() => handleDelete(group._id)}
                >
                  Leave
                </Button>
                <Button
                  labelPosition='right'
                >
                  Cancel
                </Button>
              </Modal.Actions>
            </Modal>
          </div>
        ),
      },
    });
  });

  return (ready ?
    <Card fluid style={{ height: 370 }} >
      <Card.Content textAlign='center' style={{ maxHeight: 45 }}>
        <Card.Header>My Groups</Card.Header>
      </Card.Content>
      <Card.Content style={{ maxHeight: 272, overflow: 'auto' }}>
        {userGroups.length !== 0 ?
          <Accordion
            fluid
            panels={panels}
          /> :
          <Header
            as='h3'
            content={'No group content to show.'}
            subheader={'Please join a group.'}
            textAlign={'center'}/>
        }
      </Card.Content>
      <Card.Content extra>
        <Modal
          size='tiny'
          closeIcon
          open={addModalOpen}
          onClose={handleAddModalClose}
          onOpen={handleAddModalOpen}
          trigger={ <Button size='tiny' color='black'>Join Group</Button>}
          style = {{ fontSize: '12px' }}
        >
          <Modal.Header>Join Group</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Select
                name='group'
                label='Choose a group'
                options={getGroupChoices()}
                onChange={handleChange}
                placeholder='Select'
                required
              />
              <Segment basic>
                <b>Description</b>: {descriptionChoice}
              </Segment>
              {getNewGroupForm()}
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color='black'
              size='tiny'
              onClick={() => handleJoin()}
            >
              Join
            </Button>
          </Modal.Actions>
        </Modal>
      </Card.Content>
    </Card> : <Loader active>Getting Group Data</Loader>);
};

GroupCard.propTypes = {
  userGroups: PropTypes.array.isRequired,
  userGroupsNames: PropTypes.array.isRequired,
  allGroups: PropTypes.array.isRequired,
  owner: PropTypes.string,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const ready = Groups.subscribe().ready();
  const allGroups = Groups.find({}, { sort: { name: 1 } }).fetch();
  return {
    allGroups,
    ready,
  };
})(GroupCard);
