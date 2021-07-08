import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SubmitField, SelectField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';

const GroupMemberUpdateForm = ({ item, handleCancel, handleUpdate, collection, users }) => {
  const model = item;
  const memberEmails = users.map(u => u.email);
  const schema = new SimpleSchema({
    members: Array,
    'members.$': { type: String, allowedValues: memberEmails },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const handleSubmit = (doc) => {
    // console.log('handleSubmit', doc);
    const oldMembers = collection.find({ group: doc.group }).fetch();
    const collectionName = collection.getCollectionName();
    oldMembers.forEach(m => {
      const instance = m._id;
      removeItMethod.callPromise({ collectionName, instance })
        .catch(error => swal('Error removing old members', error.message, 'error'));
    });
    const newMembers = doc.members;
    newMembers.forEach(m => {
      const definitionData = { group: doc.group, member: m };
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error adding new members', error.message, 'error'));
    });
    handleUpdate();
  };
  return (
    <Segment padded>
      <Header dividing>
        Update {collection.getType()}: {model.group}
      </Header>
      <AutoForm schema={formSchema} model={model} onSubmit={handleSubmit}>
        <SelectField name="members" />
        <SubmitField className="mini basic teal" value="Update" />
        <Button onClick={handleCancel} basic color="teal" size="mini">Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

GroupMemberUpdateForm.propTypes = {
  item: PropTypes.object.isRequired,
  handleCancel: PropTypes.func,
  handleUpdate: PropTypes.func,
  collection: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};

export default GroupMemberUpdateForm;
