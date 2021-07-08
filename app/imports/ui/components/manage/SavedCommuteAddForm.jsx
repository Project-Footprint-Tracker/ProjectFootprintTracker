import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  NumField, SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { SavedCommutes } from '../../../api/saved-commute/SavedCommuteCollection';
import { tripModesArray } from '../../../api/utilities/constants';

const SavedCommuteAddForm = ({ users }) => {
  const usernames = users.map(u => u.email);
  const schema = new SimpleSchema({
    name: {
      type: String,
    },
    distanceMiles: {
      type: Number,
      min: 0.1,
    },
    mode: {
      type: String,
      allowedValues: tripModesArray,
    },
    mpg: Number,
    owner: { type: String, allowedValues: usernames },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  let formRef;
  const handleAdd = (doc) => {
    const collectionName = SavedCommutes.getCollectionName();
    const definitionData = doc;
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error adding saved commute', error.message, 'error'))
      .then(() => {
        swal('Success', 'Added saved commute', 'success');
        formRef.reset();
      });
  };
  return (
    <Segment padded>
      <Header dividing>Add Saved Commute</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={ref => formRef = ref} showInlineError>
        <TextField name="name"/>
        <NumField name="distanceMiles" />
        <SelectField name="mode" />
        <NumField name="mpg" />
        <SelectField name="owner" />
        <ErrorsField />
        <SubmitField className="mini basic teal" value="Add" />
      </AutoForm>
    </Segment>
  );
};

SavedCommuteAddForm.propTypes = {
  users: PropTypes.array.isRequired,
};

export default SavedCommuteAddForm;
