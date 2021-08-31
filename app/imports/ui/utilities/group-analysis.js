import { GroupMembers } from '../../api/group/GroupMemberCollection';
import { Trips } from '../../api/trip/TripCollection';
import { Users } from '../../api/user/UserCollection';
import { fuelCost } from '../../api/utilities/constants';
import { countyZipcodes } from '../../api/utilities/ZipCodes';

/**
 * Returns the number of trips per mode of transportation.
 * @param trips the trips to analyze.
 * @return {Dictionary<number>}
 */
export const getModeChartCounts = (trips) => {
  const modesOfTransport = trips.reduce((result, trip) => {
    const allModes = { ...result };
    if (trip.mode in allModes) {
      allModes[trip.mode]++;
    } else {
      allModes[trip.mode] = 1;
    }
    return allModes;
  }, {});

  return modesOfTransport;
};

export const getCESavedPerDay = (trips) => {
  const tripsSorted = trips.sort((a, b) => new Date(b.date) - new Date(a.date));
  const date = [];
  const ceSaved = [];

  tripsSorted.forEach((trip) => {
    const tripDate = trip.date;

    // check to see if there is an existing trip for that date.
    const dateIndex = date.findIndex((o) => o.getTime() === tripDate.getTime());

    if (dateIndex === -1) {
      date.push(tripDate);
      ceSaved.push(trip.ceSaved.toFixed(2));
    } else {
      const oldCE = Number(ceSaved[dateIndex]);
      ceSaved[dateIndex] = (oldCE + trip.ceSaved).toFixed(2);
    }
  });

  return { date, ceSaved };
};

export const getCEProducedPerDay = (trips) => {
  const tripsSorted = trips.sort((a, b) => new Date(b.date) - new Date(a.date));
  const date = [];
  const ceProduced = [];

  tripsSorted.forEach((trip) => {
    const tripDate = trip.date;

    // check to see if there is an existing trip for that date.
    const dateIndex = date.findIndex((o) => o.getTime() === tripDate.getTime());

    if (dateIndex === -1) {
      date.push(tripDate);
      ceProduced.push(trip.ceProduced.toFixed(2));
    } else {
      const oldCE = Number(ceProduced[dateIndex]);
      ceProduced[dateIndex] = (oldCE + trip.ceProduced).toFixed(2);
    }
  });

  return { date, ceProduced };
};

export const getFuelSavedPerDay = (trips) => {
  const tripsSorted = trips.sort((a, b) => new Date(b.date) - new Date(a.date));
  const date = [];
  const fuel = [];
  const price = [];

  tripsSorted.forEach(trip => {
    const fuelSaved = trip.fuelSaved;
    const priceSaved = Number(fuelSaved * fuelCost);
    const tripDate = trip.date;

    // check to see if there is an existing trip for that date.
    const dateIndex = date.findIndex((o) => o.getTime() === tripDate.getTime());

    if (dateIndex === -1) {
      date.push(new Date(tripDate));
      fuel.push(fuelSaved.toFixed(2));
      price.push(priceSaved.toFixed(2));
    } else {
      const oldFuel = Number(fuel[dateIndex]);
      fuel[dateIndex] = (oldFuel + fuelSaved).toFixed(2);

      const oldPrice = Number(price[dateIndex]);
      price[dateIndex] = (oldPrice + priceSaved).toFixed(2);
    }
  });

  return { date: date, fuel: fuel, price: price };
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
