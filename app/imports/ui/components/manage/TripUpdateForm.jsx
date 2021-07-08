import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  SubmitField,
  ErrorsField,
  DateField,
  SelectField, NumField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { tripModesArray } from '../../../api/utilities/constants';

const TripUpdateForm = ({ id, handleCancel, handleUpdate, itemTitle, collection, users }) => {
  const userEmails = users.map(u => u.email);
  const model = id ? collection.findDoc(id) : undefined;
  const schema = new SimpleSchema({
    date: { type: Date, optional: true },
    milesTraveled: { type: Number, min: 0.1, optional: true },
    mode: { type: String, allowedValues: tripModesArray, optional: true },
    mpg: { type: Number, optional: true },
    owner: { type: String, allowedValues: userEmails, optional: true },
    passengers: { type: Number, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <Segment padded>
      <Header dividing>
        Update {collection.getType()}: {itemTitle(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={model}>
        <Form.Group widths="equal">
          <DateField name="date" />
          <NumField name="milesTraveled" />
          <SelectField name="mode" />
        </Form.Group>
        <Form.Group widths="equal">
          <NumField name="mpg" />
          <NumField name="passengers" />
        </Form.Group>
        <ErrorsField />
        <SubmitField className="mini basic teal" value="Update" />
        <Button onClick={handleCancel} basic color="teal" size="mini">Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

TripUpdateForm.propTypes = {
  id: PropTypes.string.isRequired,
  handleCancel: PropTypes.func,
  handleUpdate: PropTypes.func,
  itemTitle: PropTypes.func,
  collection: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};

export default TripUpdateForm;
