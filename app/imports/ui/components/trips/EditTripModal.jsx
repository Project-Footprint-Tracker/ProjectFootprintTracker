import React, { useState } from 'react';
import { Divider, Form, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, DateField, ErrorsField, SelectField, SubmitField } from 'uniforms-semantic';
import { Trips } from '../../../api/trip/TripCollection';
import { getDateToday, getMilesTraveled } from '../../../api/utilities/CEData';
import { averageAutoMPG, tripModesArray } from '../../../api/utilities/constants';

const EditTripModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [distance, setDistance] = useState(props.trip.milesTraveled);
  const [unit, setUnit] = useState('mi');

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setDistance(props.trip.milesTraveled);
    setUnit('mi');
    setModalOpen(false);
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
  };

  const handleDistance = (e, { value }) => setDistance(value);

  const handleUnit = (e, { value }) => setUnit(value);

  const bridge = new SimpleSchema2Bridge(formSchema);

  const handleSubmit = (data) => {
    const updateData = {};
    updateData.date = data.date;
    updateData.milesTraveled = (unit === 'mi') ? Number(distance) :
      getMilesTraveled(distance);
    if (data.roundTrip) {
      updateData.milesTraveled *= 2;
    }
    updateData.mode = data.mode;
    updateData.mpg = averageAutoMPG; // change when vehicles
    if (Trips.update(props.trip._id, updateData)) {
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
      trigger={<Icon style={{ cursor: 'pointer' }} name='edit outline'/>}
      style = {{ fontSize: '13px' }}
    >
      <Modal.Header>Edit Trip</Modal.Header>
      <Modal.Content>
        <AutoForm
          schema={bridge}
          onSubmit={data => handleSubmit(data)}
          model={props.trip}
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
              defaultValue='other'
              options={getSavedCommutes()}
              onChange={handleSavedCommute}
              required
            />
            <BoolField name='roundTrip' label='roundtrip?'/>
          </Form.Group>
          <Divider/>
          For &apos;<i>Telework</i>&apos;, key in the distance between home and workplace.
          <Form.Group inline>
            <Form.Input label='Distance traveled'
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
          <ErrorsField/>
          <SubmitField value='Submit'/>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

EditTripModal.propTypes = {
  trip: PropTypes.object.isRequired,
  savedCommutes: PropTypes.array.isRequired,
};

export default EditTripModal;
