import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Button, Divider, Form, Modal } from 'semantic-ui-react';
import { AutoForm, BoolField, DateField, ErrorsField, SubmitField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { getDateToday, getMilesTraveled } from '../../../api/utilities/Utilities';
import {
  imperialUnits,
  metricUnits,
  tripModes,
  tripModesArray,
} from '../../../api/utilities/constants';
import { Trips } from '../../../api/trip/TripCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const AddTripModal = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formExtend, setFormExtend] = useState(false);
  const [mode, setMode] = useState(tripModes.GAS_CAR);
  const [passengers, setPassengers] = useState(0);
  const [distance, setDistance] = useState(0);
  const [unit, setUnit] = useState(props.metric ? metricUnits.distance : imperialUnits.distance);

  const handleModalOpen = () => setModalOpen(true);

  const handleModalClose = () => {
    setModalOpen(false);
    setFormExtend(false);
    setMode(tripModes.GAS_CAR);
    setPassengers(0);
    setDistance(0);
    setUnit(props.metric ? metricUnits.distance : imperialUnits.distance);
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
        setMode(tripModes.GAS_CAR);
        setDistance(0);
      }
      setPassengers(0);
      setFormExtend(true);
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

  const handleExtendForm = () => (formExtend ?
    <div>
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
          label='Distance Traveled (one-way)'
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
    </div> :
    null
  );

  const bridge = new SimpleSchema2Bridge(formSchema);

  const handleSubmit = (data) => {
    const definitionData = {};
    definitionData.date = data.date.setUTCHours(0, 0, 0, 0);
    definitionData.milesTraveled = (unit === imperialUnits.distance) ? distance :
      getMilesTraveled(distance);
    if (data.roundTrip) {
      definitionData.milesTraveled *= 2;
    }
    definitionData.mode = mode;
    definitionData.passengers = Number(passengers);
    definitionData.mpg = props.userMPG; // change when vehicles are done
    definitionData.owner = props.owner;
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
      trigger={<Button size='tiny' color='black'>Add Trip</Button>}
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
          <Form.Group inline>
            <Form.Select
              name='savedCommute'
              label='Destination'
              options={getSavedCommutes()}
              onChange={handleChange}
              placeholder='Destination'
              required
              width={12}
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
  userMPG: PropTypes.number.isRequired,
};

export default AddTripModal;
