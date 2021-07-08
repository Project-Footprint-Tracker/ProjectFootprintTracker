import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  NumField, SelectField,
  SubmitField, TextField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { UserVehicles } from '../../../api/vehicle/UserVehicleCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const UserVehicleAddForm = ({ users }) => {
  const userEmails = users.map(u => u.email);
  const schema = new SimpleSchema({
    make: String,
    model: String,
    year: Number,
    owner: {
      type: String,
      allowedValues: userEmails,
    },
    name: { type: String },
    price: Number,
    MPG: Number,
    fuelSpending: Number,
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  let formRef;
  const handleAdd = (doc) => {
    const collectionName = UserVehicles.getCollectionName();
    const definitionData = doc;
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error adding vehicle', error.message, 'error'))
      .then(() => {
        swal('Success', 'Added vehicle', 'success');
        formRef.reset();
      });
  };

  return (
    <Segment padded>
      <Header dividing>Add User Vehicle</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <Form.Group widths="equal">
          <TextField name="make" />
          <TextField name="model" />
          <NumField name="year" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="owner" />
          <TextField name="name" />
        </Form.Group>
        <Form.Group widths="equal">
          <NumField name="price" />
          <NumField name="MPG" />
          <NumField name="fuelSpending" />
        </Form.Group>
        <ErrorsField />
        <SubmitField className="mini basic teal" value="Add" />
      </AutoForm>
    </Segment>
  );
};

UserVehicleAddForm.propTypes = {
  users: PropTypes.array.isRequired,
};

export default UserVehicleAddForm;
