import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Form, Icon, Modal } from 'semantic-ui-react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  ErrorsField,
  NumField,
  RadioField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import { imperialUnits, metricUnits, tripModesArray } from '../../../api/utilities/constants';
import { getMilesTraveled } from '../../../api/utilities/Utilities';
import { SavedCommutes } from '../../../api/saved-commute/SavedCommuteCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

const EditSavedCommuteModal = (props) => {
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

  const handleSubmit = (data) => {
    const updateData = {};
    updateData.id = props.savedCommute._id;
    updateData.name = data.name;
    updateData.distanceMiles = (data.unit === imperialUnits) ?
      data.distanceMiles :
      getMilesTraveled(data.distanceMiles);
    updateData.mode = data.mode;
    updateData.mpg = data.mpg;
    const collectionName = SavedCommutes.getCollectionName();
    updateMethod.callPromise({ collectionName, updateData })
      .then(() => {
        swal('Success', 'Commute updated successfully', 'success');
        handleModalClose();
      })
      .catch((error) => swal('Error', error.message, 'error'));
  };

  return (
    <Modal
      size='mini'
      closeIcon
      open={modalOpen}
      onClose={handleModalClose}
      onOpen={handleModalOpen}
      trigger={<Icon style={{ cursor: 'pointer' }} name='edit outline'/>}
      style = {{ fontSize: '13px' }}
    >
      <Modal.Header>Edit Trip</Modal.Header>
      <Modal.Content>
        <AutoForm
          schema={bridge}
          onSubmit={data => handleSubmit(data)}
          model={props.savedCommute}
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

EditSavedCommuteModal.propTypes = {
  savedCommute: PropTypes.object.isRequired,
};

export default EditSavedCommuteModal;
