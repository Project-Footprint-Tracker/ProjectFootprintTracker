import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SubmitField, ErrorsField, NumField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';

const UserUpdateForm = ({ id, handleCancel, handleUpdate, itemTitle, collection }) => {
  const model = id ? collection.findDoc(id) : undefined;
  const schema = new SimpleSchema({
    email: { type: String, optional: true },
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
    zipCode: { type: Number, optional: true },
    goal: { type: String, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <Segment padded>
      <Header dividing>
        Update {collection.getType()}: {itemTitle(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={model}>
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
        <SubmitField className="mini basic teal" value="Update" />
        <Button onClick={handleCancel} basic color="teal" size="mini">Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

UserUpdateForm.propTypes = {
  id: PropTypes.string.isRequired,
  handleCancel: PropTypes.func,
  handleUpdate: PropTypes.func,
  itemTitle: PropTypes.func,
  collection: PropTypes.object.isRequired,
};

export default UserUpdateForm;
