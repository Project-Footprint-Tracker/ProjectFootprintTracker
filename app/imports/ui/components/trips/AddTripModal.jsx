import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Button, Divider, Form, Modal } from 'semantic-ui-react';
import { AutoForm, BoolField, DateField, ErrorsField, SelectField, SubmitField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { getDateToday, getMilesTraveled } from '../../../api/utilities/CEData';
import { averageAutoMPG, tripModesArray } from '../../../api/utilities/constants';
import { Trips } from '../../../api/trip/TripCollection';

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
    const inputData = {};
    inputData.date = data.date;
    inputData.milesTraveled = (unit === 'mi') ? distance :
      getMilesTraveled(distance);
    if (data.roundTrip) {
      inputData.milesTraveled *= 2;
    }
    inputData.mode = data.mode;
    inputData.mpg = averageAutoMPG; // change when vehicles
    inputData.owner = props.owner;
    if (Trips.defineWithMessage(inputData)) {
      handleModalClose();
    }
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
