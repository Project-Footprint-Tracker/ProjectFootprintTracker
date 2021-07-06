import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  SubmitField,
  ErrorsField,
  NumField, TextField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';

const UserVehicleUpdateForm = ({ id, handleCancel, handleUpdate, itemTitle, collection }) => {
  const model = id ? collection.findDoc(id) : undefined;
  const schema = new SimpleSchema({
    make: String,
    model: String,
    year: Number,
    name: { type: String },
    price: Number,
    MPG: Number,
    fuelSpending: Number,
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>
        Update {collection.getType()}: {itemTitle(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={model}>
        <Form.Group widths="equal">
          <TextField name="make" />
          <TextField name="model" />
          <NumField name="year" />
          <TextField name="name" />
        </Form.Group>
        <Form.Group widths="equal">
          <NumField name="price" />
          <NumField name="MPG" />
          <NumField name="fuelSpending" />
        </Form.Group>
        <ErrorsField />
        <SubmitField className="mini basic teal" value="Update" />
        <Button onClick={handleCancel} basic color="teal" size="mini">Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

UserVehicleUpdateForm.propTypes = {
  id: PropTypes.string.isRequired,
  handleCancel: PropTypes.func,
  handleUpdate: PropTypes.func,
  itemTitle: PropTypes.func,
  collection: PropTypes.object.isRequired,
};

export default UserVehicleUpdateForm;
