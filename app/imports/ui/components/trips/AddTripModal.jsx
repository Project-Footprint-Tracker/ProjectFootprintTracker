import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Button, Divider, Form, Modal } from 'semantic-ui-react';
import { AutoForm, BoolField, DateField, ErrorsField, SelectField, SubmitField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { getDateToday, getMilesTraveled } from '../../../api/utilities/CEData';
import { averageAutoMPG, tripModesArray } from '../../../api/utilities/constants';
import { Trips } from '../../../api/trip/TripCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const AddTripModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formExtend, setFormExtend] = useState(false);
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState('mi');

  const handleModalOpen = () => setModalOpen(true);

  const handleModalClose = () => {
    setModalOpen(false);
    setFormExtend(false);
    setDistance('');
    setUnit('mi');
  };

  const formSchema = new SimpleSchema({
    date: Date,
    mode: String,
    roundTrip: {
      type: Boolean,
      optional: true,
    },
  });

  const getSavedCommutes = () => {
    const choices = [];
    props.savedCommutes.forEach(function (savedCommute) {
      choices.push({
        key: choices.length + 1,
        text: savedCommute.name,
        value: savedCommute._id,
      });
    });

    choices.push({
      key: choices.length + 1,
      text: 'Other',
      value: 'other',
    });

    return choices;
  };

  const handleSavedCommute = (e, { value }) => {
    if (value !== 'other') {
      const savedCommute = props.savedCommutes.find(({ _id }) => _id === value);
      setDistance(savedCommute.distanceMiles);
    }
    setFormExtend(true);
  };

  const handleDistance = (e, { value }) => setDistance(value);

  const handleUnit = (e, { value }) => setUnit(value);

  const handleExtendForm = () => (formExtend ?
    <div>
      <Divider/>
      For &apos;<i>Telework</i>&apos;, key in the distance between home and workplace.
      <Form.Group inline>
        <Form.Input label='Distance (one-way)'
          value={distance}
          type='number'
          required
          onChange={handleDistance}
        />
        <Form.Radio label='mi'
          value='mi'
          checked={unit === 'mi'}
          onChange={handleUnit}
        />
        <Form.Radio label='km'
          value='km'
          checked={unit === 'km'}
          onChange={handleUnit}
        />
      </Form.Group>
    </div> :
    null
  );

  const bridge = new SimpleSchema2Bridge(formSchema);

  const handleSubmit = (data) => {
    const definitionData = {};
    definitionData.date = data.date;
    definitionData.milesTraveled = (unit === 'mi') ? distance :
      getMilesTraveled(distance);
    if (data.roundTrip) {
      definitionData.milesTraveled *= 2;
    }
    definitionData.mode = data.mode;
    definitionData.mpg = averageAutoMPG; // change when vehicles
    definitionData.owner = props.owner;
    // CAM we're going to add the ce produced and ce saved to the Trips collection.
    const collectionName = Trips.getCollectionName();
    defineMethod.callPromise({ collectionName, definitionData })
      .then(() => {
        swal('Success', 'Trip added successfully', 'success');
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
      trigger={<Button color='black'>Add Trip</Button>}
      style = {{ fontSize: '13px' }}
    >
      <Modal.Header>Add Trip</Modal.Header>
      <Modal.Content>
        <AutoForm
          schema={bridge}
          onSubmit={data => handleSubmit(data)}
        >
          <DateField
            name='date'
            max={getDateToday()}
          />
          <SelectField
            name='mode'
            allowedValues={tripModesArray}
          />
          <Form.Group inline>
            <Form.Select
              label='Destination'
              options={getSavedCommutes()}
              onChange={handleSavedCommute}
              placeholder='Destination'
              required
            />
            <BoolField name='roundTrip' label='roundtrip?'/>
          </Form.Group>
          {handleExtendForm()}
          <ErrorsField/>
          <SubmitField value='Submit'/>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

AddTripModal.propTypes = {
  owner: PropTypes.string.isRequired,
  savedCommutes: PropTypes.array.isRequired,
  metric: PropTypes.bool.isRequired,
};

export default AddTripModal;
