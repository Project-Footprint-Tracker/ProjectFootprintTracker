import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  NumField,
  SubmitField, TextField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import { Users } from '../../../api/user/UserCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const UserAddForm = () => {
  const schema = new SimpleSchema({
    email: String,
    firstName: String,
    lastName: String,
    zipCode: Number,
    goal: String,
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  let formRef;
  const handleAdd = (doc) => {
    const collectionName = Users.getCollectionName();
    const definitionData = {
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      zipCode: doc.zipCode,
      goal: doc.goal,
    };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error adding user', error.message, 'error'))
      .then(() => {
        swal('Success', 'Added user', 'success');
        formRef.reset();
      });
  };
  return (
    <Segment padded>
      <Header dividing>Add User</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <Form.Group widths="equal">
          <TextField name="email" type="email" />
          <TextField name="firstName" />
          <TextField name="lastName" />
        </Form.Group>
        <Form.Group widths="equal">
          <NumField name="zipCode" />
          <TextField name="goal" />
        </Form.Group>
        <ErrorsField />
        <SubmitField className="mini basic teal" value="Add" />
      </AutoForm>
    </Segment>
  );
};

export default UserAddForm;
