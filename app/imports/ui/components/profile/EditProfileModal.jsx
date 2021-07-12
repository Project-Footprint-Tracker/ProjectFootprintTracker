import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Button, Modal } from 'semantic-ui-react';
import { AutoForm, ErrorsField, HiddenField, NumField, SubmitField, TextField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import { Users } from '../../../api/user/UserCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

const EditProfileModal = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const formSchema = new SimpleSchema({
    email: String,
    firstName: String,
    lastName: String,
    zipCode: Number,
    goal: String,
    image: String,
  });

  const bridge = new SimpleSchema2Bridge(formSchema);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleSubmit = (data) => {
    const updateData = {};
    updateData.id = data._id;
    if (data.firstName) {
      updateData.firstName = data.firstName;
    }
    if (data.lastName) {
      updateData.lastName = data.lastName;
    }
    if (data.zipCode) {
      updateData.zipCode = data.zipCode;
    }
    if (data.goal) {
      updateData.goal = data.goal;
    }
    if (data.image) {
      updateData.image = data.image;
    }
    const collectionName = Users.getCollectionName();
    updateMethod.callPromise({ collectionName, updateData })
      .then(() => {
        swal('Success', 'Update Succeeded', 'success');
        handleModalClose();
      })
      .catch(error => swal('Error Updating', error.message, 'error'));
  };

  return (
    <Modal
      size='mini'
      closeIcon
      open={modalOpen}
      onClose={handleModalClose}
      onOpen={handleModalOpen}
      trigger={<Button size='tiny' content='Edit Profile'/>}
      style={{ fontSize: '13px' }}
    >
      <Modal.Header>Edit Profile</Modal.Header>
      <Modal.Content>
        <AutoForm
          schema={bridge}
          onSubmit={data => handleSubmit(data)}
          model={profile}
        >
          <HiddenField name='email'/>
          <TextField name='firstName'/>
          <TextField name='lastName'/>
          <NumField name='zipCode'/>
          <TextField name='image' label='Image Link'/>
          <TextField name='goal'/>
          <ErrorsField/>
          <SubmitField value='Submit'/>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

EditProfileModal.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default EditProfileModal;
