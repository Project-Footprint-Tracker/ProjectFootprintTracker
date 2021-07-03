import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, NumField, RadioField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import {
  averageAutoMPG,
  imperialUnits,
  metricUnits,
  tripModesArray,
} from '../../../api/utilities/constants';
import { getMilesTraveled } from '../../../api/utilities/CEData';
import { SavedCommutes } from '../../../api/saved-commute/SavedCommuteCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const AddSavedCommuteModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const formSchema = new SimpleSchema({
    name: String,
    distanceMiles: Number,
    mode: {
      type: String,
      allowedValues: tripModesArray,
    },
    unit: {
      type: String,
      allowedValues: [imperialUnits.distance, metricUnits.distance],
    },
  });

  const bridge = new SimpleSchema2Bridge(formSchema);

  const handleSubmit = (data, formRef) => {
    const definitionData = {};
    definitionData.name = data.name;
    definitionData.distanceMiles = (data.unit === imperialUnits.distance) ?
      data.distanceMiles :
      getMilesTraveled(data.distanceMiles);
    definitionData.mode = data.mode;
    definitionData.mpg = averageAutoMPG; // change when vehicles are done
    definitionData.owner = props.owner;
    const collectionName = SavedCommutes.getCollectionName();
    defineMethod.callPromise({ collectionName, definitionData })
      .then(() => {
        swal('Success', 'Commute added successfully', 'success');
        formRef.reset();
        handleModalClose();
      })
      .catch((error) => swal('Error', error.message, 'error'));
  };

  let fRef = null;

  return (
    <Modal
      size='mini'
      closeIcon
      open={modalOpen}
      onClose={handleModalClose}
      onOpen={handleModalOpen}
      trigger={<Button size='tiny' color='black'>Add Commute</Button>}
      style = {{ fontSize: '13px' }}
    >
      <Modal.Header>Add Saved Commute</Modal.Header>
      <Modal.Content>
        <AutoForm
          ref={ref => { fRef = ref; }}
          schema={bridge}
          onSubmit={data => handleSubmit(data, fRef)}
        >
          <TextField name='name'/>
          <SelectField name='mode' label='Mode of Transportation'/>
          <Form.Group inline>
            <NumField name='distanceMiles' label='Distance'/>
            <RadioField name='unit'/>
          </Form.Group>
          <SubmitField value='Submit'/>
          <ErrorsField/>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

AddSavedCommuteModal.propTypes = {
  owner: PropTypes.string.isRequired,
  metric: PropTypes.bool.isRequired,
};

export default AddSavedCommuteModal;
