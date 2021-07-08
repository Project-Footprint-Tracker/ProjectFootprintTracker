import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';

const GroupUpdateForm = ({ id, handleCancel, handleUpdate, itemTitle, collection }) => {
  const model = id ? collection.findDoc(id) : undefined;
  const schema = new SimpleSchema({
    name: { type: String, optional: true },
    description: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <Segment padded>
      <Header dividing>
        Update {collection.getType()}: {itemTitle(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={model}>
        <TextField name="name" />
        <LongTextField name="description" />
        <BoolField name="retired" />
        <ErrorsField />
        <SubmitField className="mini basic teal" value="Update" />
        <Button onClick={handleCancel} basic color="teal" size="mini">Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

GroupUpdateForm.propTypes = {
  id: PropTypes.string.isRequired,
  handleCancel: PropTypes.func,
  handleUpdate: PropTypes.func,
  itemTitle: PropTypes.func,
  collection: PropTypes.object.isRequired,
};

export default GroupUpdateForm;
