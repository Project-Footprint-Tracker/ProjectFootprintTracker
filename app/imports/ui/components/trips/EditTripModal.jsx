import React, { useState } from 'react';
import { Divider, Form, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, DateField, ErrorsField, SubmitField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Trips } from '../../../api/trip/TripCollection';
import { getDateToday, getMilesTraveled } from '../../../api/utilities/Utilities';
import { imperialUnits, tripModes, tripModesArray } from '../../../api/utilities/constants';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

const EditTripModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(props.trip.mode);
  const [passengers, setPassengers] = useState(props.trip.passengers);
  const [distance, setDistance] = useState(props.trip.milesTraveled);
  const [unit, setUnit] = useState(imperialUnits.distance);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setDistance(props.trip.milesTraveled);
    setMode(props.trip.mode);
    setPassengers(props.trip.passengers);
    setUnit(imperialUnits.distance);
    setModalOpen(false);
  };

  const formSchema = new SimpleSchema({
    date: Date,
    roundTrip: {
      type: Boolean,
      optional: true,
    },
  });

  const getModesOfTransportation = () => {
    const choices = [];
    tripModesArray.forEach(function (tripMode) {
      choices.push({
        key: choices.length + 1,
        text: tripMode,
        value: tripMode,
      });
    });

    return choices;
  };

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

  const handleChange = (e, { name, value }) => {
    if (name === 'savedCommute') {
      if (value !== 'other') {
        const savedCommute = props.savedCommutes.find(({ _id }) => _id === value);
        setMode(savedCommute.mode);
        setDistance(savedCommute.distanceMiles);
      } else {
        setMode(props.trip.mode);
      }
    } else if (name === 'mode') {
      setMode(value);
    } else if (name === 'passengers') {
      setPassengers(value);
    } else if (name === 'distance') {
      setDistance(value);
    } else if (name === 'unit') {
      setUnit(value);
    }
  };

  const passengerField = () => (mode === tripModes.CARPOOL ?
    <Form.Input
      name='passengers'
      label='Number of Passengers'
      value={passengers}
      type='number'
      required
      onChange={handleChange}
    /> : null
  );

  const bridge = new SimpleSchema2Bridge(formSchema);

  const handleSubmit = (data) => {
    const updateData = {};
    updateData.id = props.trip._id;
    updateData.date = data.date;
    updateData.milesTraveled = (unit === imperialUnits.distance) ? Number(distance) :
      getMilesTraveled(distance);
    if (data.roundTrip) {
      updateData.milesTraveled *= 2;
    }
    updateData.mode = mode;
    updateData.passengers = Number(passengers);
    const collectionName = Trips.getCollectionName();
    updateMethod.callPromise({ collectionName, updateData })
      .then(() => {
        swal('Success', 'Trip updated successfully', 'success');
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
          <Form.Group inline>
            <Form.Select
              name='savedCommute'
              label='Destination'
              defaultValue='other'
              options={getSavedCommutes()}
              onChange={handleChange}
              required
              width={12}
            />
            <BoolField name='roundTrip' label='roundtrip?'/>
          </Form.Group>
          <Form.Select
            name='mode'
            label='Mode of Transportation'
            options={getModesOfTransportation()}
            onChange={handleChange}
            value={mode}
            required
          />
          {passengerField()}
          <Divider/>
          For &apos;<i>Telework</i>&apos;, key in the distance between home and workplace.
          <Form.Group inline>
            <Form.Input
              name='distance'
              label='Distance (one-way)'
              value={distance}
              type='number'
              required
              onChange={handleChange}
              width={12}
            />
            <Form.Radio
              name='unit'
              label='mi'
              value='mi'
              checked={unit === 'mi'}
              onChange={handleChange}
            />
            <Form.Radio
              name='unit'
              label='km'
              value='km'
              checked={unit === 'km'}
              onChange={handleChange}
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
