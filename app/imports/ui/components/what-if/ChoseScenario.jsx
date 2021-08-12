import { _ } from 'lodash';
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
    userMpg,
    ceProducedTotal,
    test,
  },
) {

  const defaultData = useRef(true);

  const isEventSelected = useRef(false);

  // change to useState()
  const nMilesSavedPerDay = useRef(_.map(milesSavedPerDay.mode, (mode, i) => ({
    date: milesSavedPerDay.date[i],
    distance: milesSavedPerDay.distance[i],
    mode: mode,
  })));

  const nModesOfTransport = useRef(_.map(modesOfTransport.label, (mode, i) => ({
    label: mode,
    value: modesOfTransport.value[i],
  })));

  const nDetailedTrips = useRef(_.map(detailedTrips, (trip) => trip));
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
  const [events, setEvents] = useState(() => _.map(allTrips.date, function (date, i) {
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
  }));

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

    // Adjust month and day to have 2 numbers if necessary
    if (month.length < 2) {
      month = `0${month}`;
    }
    if (day.length < 2) {
      day = `0${day}`;
    }

    // update state selectEvent with event user selected on fullcalendar
    setSelectedEvent(() => ({
      id: info.event.id,
      title: info.event.title,
      date: [year, month, day].join('-'),
      oldDateFormat: info.event.start,
      utcHours: info.event.start.setUTCHours(0, 0, 0, 0),
    }));

    defaultData.current = false;
    isEventSelected.current = true;
  };

  // on clicking submit button, updates state events with new info
  const handleSubmit = (evt) => {
    evt.preventDefault();
    // let ceReduced = 0;
    const modesOTV = [];
    const modesOTL = [];
    let modesOT = {};
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

    // check that event is selected to change
    if (isEventSelected.current === true) {
      // store event state in array
      const eventArr = [...events];
      // update array with new event info
      eventArr[selectedEvent.id] = { id: eventArr[selectedEvent.id].id, title: transport, date: selectedEvent.date, color: colorType(transport) };
      // update state events with array
      setEvents(eventArr);

      // Changing MODES OF TRANSPORT (PIE GRAPH CHANGES).
      // get index of original mode
      const indexOfOldTransport = nModesOfTransport.current.findIndex(({ label }) => label === selectedEvent.title);
      // decrement value of original mode
      nModesOfTransport.current[indexOfOldTransport] = { label: nModesOfTransport.current[indexOfOldTransport].label, value: nModesOfTransport.current[indexOfOldTransport].value - 1 };
      // get index of what if mode
      const indexOfNewTransport = nModesOfTransport.current.findIndex(({ label }) => label === transport);
      if (indexOfNewTransport === -1) {
        nModesOfTransport.current.push({ label: transport, value: 1 });
      } else {
        // increment index of what if mode
        nModesOfTransport.current[indexOfNewTransport] = {
          label: transport,
          value: nModesOfTransport.current[indexOfNewTransport].value + 1,
        };
      }
      // Code from TripCollection.js, lines 185-194 used to reformat the data for the charts.
      _.forEach(nModesOfTransport.current, function (objects) {
        modesOTV.push(objects.value);
        modesOTL.push(objects.label);
      });
      modesOT = { value: modesOTV, label: modesOTL };
      // FINISHED MODES OF TRANSPORT CHANGES.
      // MILES SAVED & CE PRODUCED
      // update nCEProducedTotal
      // ! check for if user doesn't have autoMPG registered
      // Get date of original selected event.

      console.log(nDetailedTrips);
      console.log(transport);
      const indexDetailedTrip = _.findIndex(nDetailedTrips.current, function (trip) {
        const selectedEventDate = getDate(selectedEvent.oldDateFormat);
        const nDetailedTripDate = getDate(trip.date);

        console.log(trip.mode);
        return (selectedEventDate === nDetailedTripDate) && (trip.mode === selectedEvent.title);
      });

      console.log(indexDetailedTrip);

      const currentDetailedTrip = nDetailedTrips.current[indexDetailedTrip];
      const fuel = currentDetailedTrip.milesTraveled / currentDetailedTrip.mpg;
      const ce = fuel * cePerGallonFuel;

      // if user changes trip to carpool, assume that the passenger is 1.
      if (transport === tripModes.CARPOOL) {
        nDetailedTrips.current[indexDetailedTrip] = {
          ceProduced: ce / 2,
          ceSaved: ce - (ce / 2),
          date: selectedEvent.oldDateFormat,
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
          date: selectedEvent.oldDateFormat,
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
          date: selectedEvent.oldDateFormat,
          fuelSaved: fuel,
          fuelSpent: 0,
          milesTraveled: currentDetailedTrip.milesTraveled,
          mode: transport,
          mpg: currentDetailedTrip.mpg,
          passengers: 0,
        };
      }

      tripsWI = _.map(nDetailedTrips, (trip) => trip);

      console.log(tripsWI);
      const indexOfOldMiles = _.findIndex(nMilesSavedPerDay.current, function (object) {
        const selectedEventDate = getDate(selectedEvent.oldDateFormat);
        const nMilesSavedDate = getDate(object.date);

        return selectedEventDate === nMilesSavedDate;
      });

      // Get the new modes in the date.
      const selectedEventModes = nMilesSavedPerDay.current[indexOfOldMiles].mode;
      const splitModes = selectedEventModes.split(', ');

      const newTransport = [];
      if (selectedEventModes.indexOf(',') !== -1) {
        const indexOfMode = _.findIndex(splitModes, (o) => o === selectedEvent.title);

        _.forEach(splitModes, function (mode, index) {
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

        _.forEach(splitOriginalModes, function (mode, index) {

          // find the index to access the distance of that particular trip
          const tripIndex = _.findIndex(allTrips.collection, function (trip) {
            return mode === trip.mode && getDate(selectedEvent.oldDateFormat) === getDate(trip.date);
          });

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
        date: selectedEvent.oldDateFormat,
        distance: newDistanceTotal,
        mode: newTransport.length > 0 ? newTransport.join(', ') : transport,
      };

      _.forEach(nMilesSavedPerDay.current, function (objects) {
        milesSPDDate.push(objects.date);
        milesSPDDistance.push(objects.distance);
        milesSPDM.push(objects.mode);
      });
      milesSPD = { date: milesSPDDate, distance: milesSPDDistance, mode: milesSPDM };

      // If event produced miles & ce
      _.forEach(nMilesSavedPerDay.current, function (objects) {

        if (objects.mode === tripModes.GAS_CAR || objects.mode === tripModes.CARPOOL) {
          ceProduced += ((objects.distance / userMpg) * cePerGallonFuel);
          ceRPDD.push(objects.date);
          ceRPDG.push(0);
          fuelSPDD.push(objects.date);
          fuelSPDF.push(0);
          fuelSPDP.push(((objects.distance / userMpg) * fuelCost).toFixed(2));
        } else {
          ceRPDD.push(objects.date);
          ceRPDG.push(((objects.distance / userMpg) * cePerGallonFuel).toFixed(2));
          fuelSPDD.push(objects.date);
          fuelSPDF.push((objects.distance / userMpg).toFixed(2));
          fuelSPDP.push(((objects.distance / userMpg) * fuelCost).toFixed(2));
        }
      });
      // If event reduced miles & ce
      ceRPD = { date: ceRPDD, ce: ceRPDG };
      fuelSPD = { date: fuelSPDD, fuel: fuelSPDF, price: fuelSPDP };
      nCeProducedTotal.current = ceProduced;
      // sets the selected event to the change in case of additional changes before selecting a new event.
      setSelectedEvent(() => ({ id: selectedEvent.id, title: transport, date: selectedEvent.date, oldDateFormat: selectedEvent.oldDateFormat }));
    } else {
      swal('Pick a date');
    }
    test(tripsWI[0], milesSPD, modesOT, ceRPD, fuelSPD);
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
      <Form id='calendar-form' onSubmit={handleSubmit}>
        <Form.Field>
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
          <Form.Button content='Submit'/>
        </Form.Field>
      </Form>

      <Button id='defaultButton' onClick={defaultEvents}>Default</Button>
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
