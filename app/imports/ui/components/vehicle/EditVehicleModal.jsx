import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Button, Divider, Form, Modal } from 'semantic-ui-react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, NumField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { UserVehicles } from '../../../api/vehicle/UserVehicleCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

const EditVehicleModal = ({ vehicle }) => {
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
    const updateData = data;
    updateData.id = data._id;
    const collectionName = UserVehicles.getCollectionName();
    updateMethod.callPromise({ collectionName, updateData })
      .then(() => {
        swal('Success', 'Update Succeeded', 'success');
        handleModalClose();
      })
      .catch(error => swal('Error Updating', error.message, 'error'));
  };

  return (
    <Modal
      size='tiny'
      closeIcon
      open={modalOpen}
      onClose={handleModalClose}
      onOpen={handleModalOpen}
      trigger={<Button size='tiny' color='black'>Edit Vehicle</Button>}
      style = {{ fontSize: '12px' }}
    >
      <Modal.Header>Add Vehicle</Modal.Header>
      <Modal.Content>
        <AutoForm
          schema={bridge}
          onSubmit={data => handleSubmit(data)}
          model={vehicle}
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

EditVehicleModal.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default EditVehicleModal;
