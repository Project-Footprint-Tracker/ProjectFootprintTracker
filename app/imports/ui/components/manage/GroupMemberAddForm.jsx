import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField, SelectField,
  SubmitField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { GroupMembers } from '../../../api/group/GroupMemberCollection';

const GroupMemberAddForm = ({ groups, users }) => {
  const groupNames = groups.map(g => g.name);
  const userEmails = users.map(u => u.email);
  const schema = new SimpleSchema({
    group: { type: String, allowedValues: groupNames },
    member: { type: String, allowedValues: userEmails },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  let formRef;
  const handleAdd = (doc) => {
    const collectionName = GroupMembers.getCollectionName();
    const definitionData = {
      group: doc.group,
      member: doc.member,
    };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error adding group member', error.message, 'error'))
      .then(() => {
        swal('Success', 'Added group member', 'success');
        formRef.reset();
      });
  };
  return (
    <Segment padded>
      <Header dividing>Add Group Member</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={ref => formRef = ref}>
        <SelectField name="group" />
        <SelectField name="member" />
        <ErrorsField />
        <SubmitField className="mini basic teal" value="Add" />
      </AutoForm>
    </Segment>
  );
};

GroupMemberAddForm.propTypes = {
  groups: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

export default GroupMemberAddForm;
