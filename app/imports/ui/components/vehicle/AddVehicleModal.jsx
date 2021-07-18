import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Button, Divider, Form, Modal } from 'semantic-ui-react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, NumField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { UserVehicles } from '../../../api/vehicle/UserVehicleCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const AddVehicleModal = ({ owner }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const formSchema = new SimpleSchema({
    year: Number,
    make: String,
    model: String,
    MPG: Number,
    name: {
      type: String,
      optional: true,
    },
    price: {
      type: Number,
      optional: true,
    },
    fuelSpending: {
      type: Number,
      optional: true,
    },
  });

  const bridge = new SimpleSchema2Bridge(formSchema);

  const handleSubmit = (data) => {
    const definitionData = data;
    definitionData.owner = owner;
    const collectionName = UserVehicles.getCollectionName();
    defineMethod.callPromise({ collectionName, definitionData })
      .then(() => {
        swal('Success', 'Vehicle added successfully', 'success');
        handleModalClose();
      })
      .catch((error) => swal('Error', error.message, 'error'));
  };

  return (
    <Modal
      size='tiny'
      closeIcon
      open={modalOpen}
      onClose={handleModalClose}
      onOpen={handleModalOpen}
      trigger={<Button size='tiny' color='black'>Add Vehicle</Button>}
      style = {{ fontSize: '12px' }}
    >
      <Modal.Header>Add Vehicle</Modal.Header>
      <Modal.Content>
        <AutoForm
          schema={bridge}
          onSubmit={data => handleSubmit(data)}
        >
          <Form.Group widths='equal'>
            <TextField name='make'/>
            <TextField name='model'/>
          </Form.Group>
          <Form.Group widths='equal'>
            <NumField name='year'/>
            <NumField name='MPG' label='MPG (for &apos;EV/Hybrid&apos;, key in 0)'/>
          </Form.Group>
          <Divider horizontal>Optional</Divider>
          <TextField name='name'/>
          <Form.Group widths='equal'>
            <NumField name='price' label='Purchase Price'/>
            <NumField name='fuelSpending' label='Yearly Fuel Spending'/>
          </Form.Group>
          <ErrorsField/>
          <SubmitField value='Submit'/>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

AddVehicleModal.propTypes = {
  owner: PropTypes.string.isRequired,
};

export default AddVehicleModal;
