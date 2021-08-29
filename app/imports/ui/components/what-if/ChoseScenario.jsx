import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import swal from 'sweetalert';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { cePerGallonFuel, tripModes, fuelCost } from '../../../api/utilities/constants';
import { getDate } from '../../../api/utilities/Utilities';

/* global window */

function ChoseScenario(
  {
    milesSavedPerDay,
    allTrips,
    detailedTrips,
    modesOfTransport,
    ceProducedTotal,
    test,
  },
) {

  const [disableSubmit, setDisableSubmit] = useState(true);
  const [disableDefault, setDisableDefault] = useState(true);
  const defaultData = useRef(true);

  const isEventSelected = useRef(false);

  // change to useState()
  const nMilesSavedPerDay = useRef(milesSavedPerDay.mode.map((mode, i) => ({
    date: milesSavedPerDay.date[i],
    distance: milesSavedPerDay.distance[i],
    mode: mode,
  })));

  const nModesOfTransport = { ...modesOfTransport };

  const nDetailedTrips = useRef(detailedTrips.map((trip) => trip));
  const nCeProducedTotal = useRef(ceProducedTotal);

  function colorType(type) {
    let color;
    if (type === tripModes.TELEWORK) {
      color = '#1f77b4';
    } else if (type === tripModes.CARPOOL) {
      color = '#ff7f0e';
    } else if (type === tripModes.BIKE) {
      color = '#2ca02c';
    } else if (type === tripModes.WALK) {
      color = '#e377c2';
    } else if (type === tripModes.ELECTRIC_VEHICLE) {
      color = '#d62728';
    } else if (type === tripModes.GAS_CAR) {
      color = '#9467bd';
    } else {
      color = '#8c564b';
    }
    return (color);
  }

  // state for events in fullcalendar
  const getInitialStateEvents = () => allTrips.date.map((date, i) => {
    const year = `${date.getFullYear()}`;
    let month = `${date.getMonth() + 1}`;
    let day = `${date.getDate()}`;

    // Adjust month and day to have 2 numbers if necessary
    if (month.length < 2) {
      month = `0${month}`;
    }
    if (day.length < 2) {
      day = `0${day}`;
    }

    return { id: i, title: allTrips.mode[i], date: [year, month, day].join('-'), color: colorType(allTrips.mode[i]) };
  });
  const [events, setEvents] = useState(getInitialStateEvents());

  // state for event user selected in fullcalendar
  const [selectedEvent, setSelectedEvent] = useState(() => ({ id: null, title: null, date: 'no date selected' }));

  // state for transport user selected in form
  const [transport, setTransport] = useState();

  // sets events back to user's original data
  function defaultEvents() {
    window.location.reload();
    return false;
  }

  // on clicking event, it stores event information in state selectedEvent
  const handleEventSelect = (info) => {
    const year = `${info.event.start.getFullYear()}`;
    let month = `${info.event.start.getMonth() + 1}`;
    let day = `${info.event.start.getDate()}`;
    let offsetDay = `${info.event.start.getDate() + 1}`;

    // Adjust month and day to have 2 numbers if necessary
    if (month.length < 2) {
      month = `0${month}`;
    }
    if (day.length < 2) {
      day = `0${day}`;
    }
    if (offsetDay.length < 2) {
      offsetDay = `0${offsetDay}`;
    }

    // update state selectEvent with event user selected on fullcalendar
    setSelectedEvent(() => ({
      id: info.event.id,
      title: info.event.title,
      date: [year, month, day].join('-'),
      oldDateFormat: info.event.start,
      offsetDate: [year, month, offsetDay].join('-'),
    }));

    defaultData.current = false;
    if (selectedEvent.title !== null) {
      setDisableSubmit(false);
      setTransport(selectedEvent.title);
    }
    isEventSelected.current = true;
  };

  // on clicking submit button, updates state events with new info
  const handleSubmit = (evt) => {
    evt.preventDefault();
    // let ceReduced = 0;
    let ceProduced = 0;
    const milesSPDDate = [];
    const milesSPDDistance = [];
    const milesSPDM = [];
    let milesSPD = {};
    const ceRPDD = [];
    const ceRPDG = [];
    let ceRPD = {};
    const fuelSPDD = [];
    const fuelSPDF = [];
    const fuelSPDP = [];
    let fuelSPD = {};
    let tripsWI = [];

    if (transport === selectedEvent.title) {
      swal('Error', 'Please select a different mode of transportation', 'error');
    } else {
      setDisableSubmit(true);
      setDisableDefault(false);
      // store event state in array
      const eventArr = [...events];
      // update array with new event info
      eventArr[selectedEvent.id] = { id: eventArr[selectedEvent.id].id, title: transport, date: selectedEvent.date, color: colorType(transport) };
      // update state events with array
      setEvents(eventArr);

      // Changing MODES OF TRANSPORT (PIE GRAPH CHANGES).
      // decrease value/count of the mode
      nModesOfTransport[selectedEvent.title] -= 1;
      if (transport in nModesOfTransport) {
        nModesOfTransport[transport]++;
      } else {
        nModesOfTransport[transport] = 1;
      }
      // FINISHED MODES OF TRANSPORT CHANGES.
      // MILES SAVED & CE PRODUCED
      // update nCEProducedTotal
      // ! check for if user doesn't have autoMPG registered
      // Get date of original selected event.

      const indexDetailedTrip = nDetailedTrips.current.findIndex((trip) => {
        const selectedEventDate = getDate(selectedEvent.oldDateFormat);
        const nDetailedTripDate = getDate(trip.date);

        return (selectedEventDate === nDetailedTripDate) && (trip.mode === selectedEvent.title);
      });

      const currentDetailedTrip = nDetailedTrips.current[indexDetailedTrip];
      const fuel = currentDetailedTrip.milesTraveled / currentDetailedTrip.mpg;
      const ce = fuel * cePerGallonFuel;

      // if user changes trip to carpool, assume that the passenger is 1.
      if (transport === tripModes.CARPOOL) {
        nDetailedTrips.current[indexDetailedTrip] = {
          ceProduced: ce / 2,
          ceSaved: ce - (ce / 2),
          date: new Date(selectedEvent.offsetDate),
          fuelSaved: fuel,
          fuelSpent: fuel,
          milesTraveled: currentDetailedTrip.milesTraveled,
          mode: tripModes.CARPOOL,
          mpg: currentDetailedTrip.mpg,
          passengers: 1,
        };
      } else if (transport === tripModes.GAS_CAR) {
        nDetailedTrips.current[indexDetailedTrip] = {
          ceProduced: ce,
          ceSaved: 0,
          date: new Date(selectedEvent.offsetDate),
          fuelSaved: 0,
          fuelSpent: fuel,
          milesTraveled: currentDetailedTrip.milesTraveled,
          mode: tripModes.GAS_CAR,
          mpg: currentDetailedTrip.mpg,
          passengers: 0,
        };
      } else {
        nDetailedTrips.current[indexDetailedTrip] = {
          ceProduced: 0,
          ceSaved: ce,
          date: new Date(selectedEvent.offsetDate),
          fuelSaved: fuel,
          fuelSpent: 0,
          milesTraveled: currentDetailedTrip.milesTraveled,
          mode: transport,
          mpg: currentDetailedTrip.mpg,
          passengers: 0,
        };
      }

      tripsWI = [...nDetailedTrips.current];

      const indexOfOldMiles = nMilesSavedPerDay.current.findIndex(object => {
        const selectedEventDate = getDate(selectedEvent.oldDateFormat);
        const nMilesSavedDate = getDate(object.date);

        return selectedEventDate === nMilesSavedDate;
      });

      // Get the new modes in the date.
      const selectedEventModes = nMilesSavedPerDay.current[indexOfOldMiles].mode;
      const splitModes = selectedEventModes.split(', ');

      const newTransport = [];
      if (selectedEventModes.indexOf(',') !== -1) {
        const indexOfMode = splitModes.findIndex((o) => o === selectedEvent.title);

        splitModes.forEach((mode, index) => {
          if (index !== indexOfMode) {
            newTransport.push(mode);
          } else {
            newTransport.push(transport);
          }
        });
      }

      // calculate the new distance with the new modes.
      const currentDistance = nMilesSavedPerDay.current[indexOfOldMiles].distance;

      let newDistanceTotal = 0;
      if (newTransport.length !== 0) {
        const originalModes = milesSavedPerDay.mode[indexOfOldMiles]; // use original modes as reference
        const splitOriginalModes = originalModes.split(', ');

        splitOriginalModes.forEach((mode, index) => {

          // find the index to access the distance of that particular trip
          const tripIndex = allTrips.collection.findIndex((trip) => mode === trip.mode && getDate(selectedEvent.oldDateFormat) === getDate(trip.date));

          // get the distance from the original list of trips.
          let newDistance = allTrips.distance[tripIndex];

          // if the new mode is a gas car but the old mode is not,then negate it.
          // else if the new mode is not a gas car but the old mode is, then negate it.
          // else just add it.
          if (newTransport[index] === tripModes.GAS_CAR && mode !== tripModes.GAS_CAR) {
            newDistance = -newDistance;
          } else if (newTransport[index] !== tripModes.GAS_CAR && mode === tripModes.GAS_CAR) {
            newDistance = -newDistance;
          }
          newDistanceTotal += newDistance;
        });
      } else if (transport === tripModes.GAS_CAR) {
        newDistanceTotal = -currentDistance;
      } else if (currentDistance < 0) {
        newDistanceTotal = -currentDistance;
      } else {
        newDistanceTotal = currentDistance;
      }

      // update nMilesSavedPerDay
      nMilesSavedPerDay.current[indexOfOldMiles] = {
        date: new Date(selectedEvent.offsetDate),
        distance: newDistanceTotal,
        mode: newTransport.length > 0 ? newTransport.join(', ') : transport,
      };

      nMilesSavedPerDay.current.forEach((objects) => {
        milesSPDDate.push(objects.date);
        milesSPDDistance.push(objects.distance);
        milesSPDM.push(objects.mode);
      });
      milesSPD = { date: milesSPDDate, distance: milesSPDDistance, mode: milesSPDM };

      // If event produced miles & ce
      tripsWI.forEach((objects) => {

        ceProduced += objects.ceProduced;
        ceRPDD.push(objects.date);
        ceRPDG.push((objects.ceSaved).toFixed(2));
        fuelSPDD.push(objects.date);
        fuelSPDF.push((objects.fuelSaved).toFixed(2));
        fuelSPDP.push((objects.fuelSaved * fuelCost).toFixed(2));
      });

      // If event reduced miles & ce
      ceRPD = { date: ceRPDD, ce: ceRPDG };
      fuelSPD = { date: fuelSPDD, fuel: fuelSPDF, price: fuelSPDP };
      nCeProducedTotal.current = ceProduced;
      // sets the selected event to the change in case of additional changes before selecting a new event.
      setSelectedEvent(() => ({ id: selectedEvent.id, title: transport, date: selectedEvent.date, oldDateFormat: selectedEvent.oldDateFormat }));
      test(tripsWI, milesSPD, nModesOfTransport, ceRPD, fuelSPD);
    }
  };

  // updates selected state transport
  const handleChange = (event, { value }) => setTransport(value);

  return (
    <div>
      {/* renders fullcalendar */}
      <div id='calendar-container'>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          contentHeight={400}
          selectable={true}
          eventClick={handleEventSelect}
          events={events}
        />
      </div>

      {/* render form to select mode of transportation */}
      <Form id='calendar-form'>
        <Form.Field required>
                    Selected date: {selectedEvent.date}
        </Form.Field>
        <Form.Group inline>
          <Form.Radio
            label={tripModes.BIKE}
            checked={transport === tripModes.BIKE}
            value={tripModes.BIKE}
            onClick={handleChange}
          />

          <Form.Radio
            label={tripModes.CARPOOL}
            checked={transport === tripModes.CARPOOL}
            value={tripModes.CARPOOL}
            onClick={handleChange}
          />
          <Form.Radio
            label={tripModes.ELECTRIC_VEHICLE}
            checked={transport === tripModes.ELECTRIC_VEHICLE}
            value={tripModes.ELECTRIC_VEHICLE}
            onClick={handleChange}
          />
          <Form.Radio
            label={tripModes.GAS_CAR}
            checked={transport === tripModes.GAS_CAR}
            value={tripModes.GAS_CAR}
            onClick={handleChange}
          />
          <Form.Radio
            label={tripModes.PUBLIC_TRANSPORTATION}
            checked={transport === tripModes.PUBLIC_TRANSPORTATION}
            value={tripModes.PUBLIC_TRANSPORTATION}
            onClick={handleChange}
          />
          <Form.Radio
            label={tripModes.TELEWORK}
            checked={transport === tripModes.TELEWORK}
            value={tripModes.TELEWORK}
            onClick={handleChange}
          />
          <Form.Radio
            label={tripModes.WALK}
            checked={transport === tripModes.WALK}
            value={tripModes.WALK}
            onClick={handleChange}
          />
        </Form.Group>

        <Form.Field>
          <Form.Button content='Submit' onClick={handleSubmit} disabled={disableSubmit}/>
        </Form.Field>
      </Form>
      <Button id='defaultButton' onClick={defaultEvents} disabled={disableDefault}>Reset</Button>
    </div>
  );
}

ChoseScenario.propTypes = {
  tripDate: PropTypes.instanceOf(Date),
  milesSavedTotal: PropTypes.number,
  milesSavedPerDay: PropTypes.object,
  allTrips: PropTypes.object,
  detailedTrips: PropTypes.array,
  modesOfTransport: PropTypes.object,
  userMpg: PropTypes.number,
  ceProducedTotal: PropTypes.string,
  ceReducedPerDay: PropTypes.object,
  fuelSavedPerDay: PropTypes.object,
  test: PropTypes.func,
};

export default ChoseScenario;
