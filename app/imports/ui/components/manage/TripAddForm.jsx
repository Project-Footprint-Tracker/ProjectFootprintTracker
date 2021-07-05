import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  DateField,
  ErrorsField,
  NumField, SelectField,
  SubmitField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { tripModesArray } from '../../../api/utilities/constants';
import { Trips } from '../../../api/trip/TripCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const TripAddForm = ({ users }) => {
  const userEmails = users.map(u => u.email);
  const schema = new SimpleSchema({
    date: {
      type: Date,
    },
    milesTraveled: {
      type: Number,
      min: 0.1,
    },
    mode: {
      type: String,
      allowedValues: tripModesArray,
    },
    mpg: Number,
    owner: { type: String, allowedValues: userEmails },
    passengers: {
      type: Number,
      optional: true,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  let formRef;
  const handleAdd = (doc) => {
    const collectionName = Trips.getCollectionName();
    const definitionData = doc;
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error adding trip', error.message, 'error'))
      .then(() => {
        swal('Success', 'Added trip', 'success');
        formRef.reset();
      });
  };
  return (
    <Segment padded>
      <Header dividing>Add Trip</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <Form.Group widths="equal">
          <DateField name="date" />
          <SelectField name="owner" />
        </Form.Group>
        <Form.Group widths="equal">
          <NumField name="milesTraveled" />
          <SelectField name="mode" />
        </Form.Group>
        <Form.Group widths="equal">
          <NumField name="mpg" />
          <NumField name="passengers" />
        </Form.Group>
        <ErrorsField />
        <SubmitField className="mini basic teal" value="Add" />
      </AutoForm>
    </Segment>
  );
};

TripAddForm.propTypes = {
  users: PropTypes.array.isRequired,
};

export default TripAddForm;
