import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  TextField,
  SubmitField,
  ErrorsField,
  NumField,
  SelectField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { tripModesArray } from '../../../api/utilities/constants';

const SavedCommuteUpdateForm = ({ id, handleCancel, handleUpdate, itemTitle, collection, users }) => {
  const item = collection.findDoc(id);
  const usernames = users.map(u => u.email);
  const schema = new SimpleSchema({
    name: { type: String, optional: true },
    distanceMiles: { type: Number, min: 0.1, optional: true },
    mode: { type: String, allowedValues: tripModesArray, optional: true },
    mpg: { type: Number, optional: true },
    owner: { type: String, allowedValues: usernames, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>
        Update {collection.getType()}: {itemTitle(item)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={item}>
        <TextField name="name" />
        <NumField name="distanceMiles" />
        <SelectField name="mode" />
        <NumField name="mpg" />
        <SelectField name="owner" />
        <ErrorsField />
        <SubmitField className="mini basic teal" value="Update" />
        <Button onClick={handleCancel} basic color="teal" size="mini">Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

SavedCommuteUpdateForm.propTypes = {
  id: PropTypes.string.isRequired,
  handleCancel: PropTypes.func,
  handleUpdate: PropTypes.func,
  itemTitle: PropTypes.func,
  collection: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};

export default SavedCommuteUpdateForm;
