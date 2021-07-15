import _ from 'lodash';
import { GroupMembers } from '../../api/group/GroupMemberCollection';
import { Trips } from '../../api/trip/TripCollection';
import { Users } from '../../api/user/UserCollection';
import { fuelCost, tripModes } from '../../api/utilities/constants';

/**
 * Returns the number of trips per mode of transportation.
 * @param trips the trips to analyze.
 * @return {Dictionary<number>}
 */
export const getModeCounts = (trips) => _.countBy(trips, 'mode');

export const getModeChartCounts = (trips) => {
  const modesOfTransport = [
    { mode: tripModes.TELEWORK, value: 0 },
    { mode: tripModes.PUBLIC_TRANSPORTATION, value: 0 },
    { mode: tripModes.BIKE, value: 0 },
    { mode: tripModes.WALK, value: 0 },
    { mode: tripModes.CARPOOL, value: 0 },
    { mode: tripModes.ELECTRIC_VEHICLE, value: 0 },
    { mode: tripModes.GAS_CAR, value: 0 },
  ];
  trips.forEach((t) => {
    const mode = _.find(modesOfTransport, ['mode', t.mode]);
    mode.value += 1;
  });
  const modesOfTransportValue = [];
  const modesOfTransportLabel = [];
  // create the formatted data value and label for the charts.
  modesOfTransport.forEach((m) => {
    if (m.value !== 0) {
      modesOfTransportValue.push(m.value);
      modesOfTransportLabel.push(m.mode);
    }
  });
  return { value: modesOfTransportValue, label: modesOfTransportLabel };
};

/**
 * Returns the total carbon saved and the total carbon produced for the given trips.
 * @param trips the trips to analyze.
 * @return {{ceSaved: number, ceProduced: number}}
 */
export const getCeTotals = (trips) => {
  const ceProduced = _.reduce(trips, (sum, t) => sum + t.ceProduced, 0);
  const ceSaved = _.reduce(trips, (sum, t) => sum + t.ceSaved, 0);
  return {
    ceProduced,
    ceSaved,
  };
};

/**
 * Returns the average carbon saved and produced for the given trips.
 * @param trips the trips to analyze.
 * @return {{ceSaved: number, ceProduced: number}}
 */
export const getCeAverages = (trips) => {
  const numTrips = trips.length;
  const total = getCeTotals(trips);
  return {
    ceProduced: total.ceProduced / numTrips,
    ceSaved: total.ceSaved / numTrips,
  };
};

/**
 * Returns the trips associated with the given group.
 * @param group the group.
 * @return {trip[]}
 */
export const getGroupTrips = (group) => {
  const members = GroupMembers.find({ group }).fetch().map(doc => doc.member);
  let trips = [];
  members.forEach(member => {
    trips = trips.concat(Trips.find({ owner: member }).fetch());
  });
  return trips;
};

export const getGroupModeCounts = (group) => {
  const trips = getGroupTrips(group);
  return getModeCounts(trips);
};

export const getGroupCeTotals = (group) => {
  const trips = getGroupTrips(group);
  return getCeTotals(trips);
};

export const getGroupCeAverages = (group) => {
  const trips = getGroupTrips(group);
  return getCeAverages(trips);
};

const countyZipcodes = {
  Honolulu: [96701, 96706, 96707, 96709, 96712, 96717,
    96730, 96731, 96734, 96744, 96759, 96762, 96782,
    96786, 96789, 96791, 96792, 96795, 96797, 96801, 96802,
    96803, 96804, 96805, 96806, 96807, 96808, 96809, 96810,
    96811, 96912, 96813, 96814, 96815, 96816, 96817, 96819,
    96820, 96821, 96822, 96823, 96824, 96825, 96826, 96827,
    96828, 96830, 96835, 96836, 96837, 96838, 96839, 96850,
    96853, 96854, 96857, 96858, 96859, 96860, 96861, 96862,
    96863, 96898],
  Kauai: [96703, 96705, 96714, 96715, 96716, 96722, 96732,
    96733, 96741, 96746, 96747, 96751, 96752, 96754, 96756,
    96765, 96766, 96769, 96790, 96796],
  Maui: [96708, 96713, 96729, 96742, 96748, 96753, 96757,
    96761, 96763, 96767, 96768, 96770, 96779, 96784, 96788,
    96793],
  Hawaii: [96704, 96710, 96718, 96719, 96720, 96721,
    96725, 96726, 96727, 96728, 96737, 96738, 96739,
    96740, 96743, 96745, 96749, 96750, 96755, 967560,
    96764, 96771, 96772, 96773, 96774, 96776, 96777,
    96778, 96780, 96781, 96783, 96785],
};

export const counties = {
  Hawaii: 'Hawaii',
  Honolulu: 'Honolulu',
  Kauai: 'Kauai',
  Maui: 'Maui',
};

/**
 * Returns the trips for the given county.
 * @param county the county.
 * @return {trip[]}
 */
export const getCountyTrips = (county) => {
  const trips = Trips.find({}, {}).fetch();
  return trips.filter(t => {
    const ownerZip = Users.findDoc({ email: t.owner }).zipCode;
    return countyZipcodes[county].includes(ownerZip);
  });
};

export const getCEReducedPerDay = (trips) => {
  const date = [];
  const ce = [];

  trips.forEach((trip) => {
    const tripDate = trip.date.toISOString().split('T')[0];
    if (trip.ceSaved !== 0) {
      if (!date.includes(tripDate)) {
        date.push(tripDate);
        ce.push(trip.ceSaved.toFixed(2));
      } else {
        const oldCE = Number(ce[date.indexOf(tripDate)]);
        ce[date.indexOf(tripDate)] = (oldCE + trip.ceSaved).toFixed(2);
      }
    }
  });

  return { date, ce };
};

export const getCEProducedPerDay = (trips) => {
  const date = [];
  const ceProduced = [];

  trips.forEach((trip) => {
    const tripDate = trip.date.toISOString().split('T')[0];
    if (trip.ceProduced !== 0) {
      if (!date.includes(tripDate)) {
        date.push(tripDate);
        ceProduced.push(trip.ceProduced.toFixed(2));
      } else {
        const oldCE = Number(ceProduced[date.indexOf(tripDate)]);
        ceProduced[date.indexOf(tripDate)] = (oldCE + trip.ceProduced).toFixed(2);
      }
    }
  });

  return { date, ceProduced };
};

export const getFuelSavedPerDay = (trips) => {
  const date = [];
  const fuel = [];
  const price = [];

  trips.forEach(trip => {
    const tripDate = trip.date.toISOString().split('T')[0];
    const fuelSaved = Number(trip.milesTraveled / trip.mpg);
    const priceSaved = Number(fuelSaved * fuelCost);

    if (trip.ceSaved !== 0) {
      if (!date.includes(tripDate)) {
        date.push(tripDate);
        fuel[date.indexOf(tripDate)] = fuelSaved.toFixed(2);
        price[date.indexOf(tripDate)] = priceSaved.toFixed(2);
      } else {
        const oldFuel = Number(fuel[date.indexOf(tripDate)]);
        fuel[date.indexOf(tripDate)] = (oldFuel + fuelSaved).toFixed(2);

        const oldPrice = Number(price[date.indexOf(tripDate)]);
        price[date.indexOf(tripDate)] = (oldPrice + priceSaved).toFixed(2);
      }
    }
  });

  return { date: date, fuel: fuel, price: price };
};
