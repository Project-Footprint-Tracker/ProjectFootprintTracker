import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  BoolField,
  ErrorsField,
  LongTextField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import { Groups } from '../../../api/group/GroupCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const GroupAddForm = () => {
  const schema = new SimpleSchema({
    name: String,
    description: String,
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  let formRef;

  const handleAdd = (doc) => {
    const collectionName = Groups.getCollectionName();
    const definitionData = doc;
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error adding group', error.message, 'error'))
      .then(() => {
        swal('Success', 'Added group', 'success');
        formRef.reset();
      });
  };

  return (
    <Segment padded>
      <Header dividing>Add Group</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <TextField name="name" />
        <LongTextField name="description" />
        <BoolField name="retired" />
        <ErrorsField />
        <SubmitField className="mini basic teal" value="Add" />
      </AutoForm>
    </Segment>
  );
};

export default GroupAddForm;
