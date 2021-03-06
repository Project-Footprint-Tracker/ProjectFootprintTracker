import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { fuelCost, avgMpge, cePerGallonFuel, tripModes, tripModesArray } from '../utilities/constants';
import { ROLE } from '../role/Role';
import { getDateToday, getTotalArray } from '../utilities/Utilities';

export const tripPublications = {
  trip: 'Trip',
  tripCommunity: 'TripCommunity',
};

const calculateFuelAndCe = (mode, miles, mpg, passengers) => {
  const fuel = (miles / mpg);
  const ce = fuel * cePerGallonFuel;
  switch (mode) {
  case tripModes.GAS_CAR:
    return {
      fuelSpent: fuel,
      fuelSaved: 0,
      ceProduced: ce,
      ceSaved: 0,
    };
  case tripModes.CARPOOL: {
    const totalPassengers = passengers + 1;
    const ceProduced = (ce / totalPassengers);
    const ceSaved = ce - ceProduced;
    const fuelSaved = fuel * passengers;
    return {
      fuelSpent: fuel,
      fuelSaved,
      ceProduced,
      ceSaved,
    };
  }
  default:
    return {
      fuelSpent: 0,
      fuelSaved: fuel,
      ceProduced: 0,
      ceSaved: ce,
    };
  }
};

class TripCollection extends BaseCollection {
  constructor() {
    super('Trip', new SimpleSchema({
      date: {
        type: Date,
        defaultValue: new Date(),
      },
      milesTraveled: {
        type: Number,
        min: 0.1,
      },
      mode: {
        type: String,
        allowedValues: tripModesArray,
        defaultValue: tripModes.GAS_CAR,
      },
      mpg: Number,
      owner: String,
      fuelSpent: Number,
      fuelSaved: Number,
      ceProduced: Number,
      ceSaved: Number,
      passengers: {
        type: Number,
        defaultValue: 0,
        optional: true,
      },
    }));
  }

  /**
   * Defines a new Trip item/document.
   * @param date of trip.
   * @param milesTraveled.
   * @param mode of transportation.
   * @param mpg of vehicle.
   * @param owner of the document.
   * @param passengers the number of passengers on the trip. Defaults to 0.
   * @returns {String} the docID of the new document.
   */
  define({ date, milesTraveled, mode, mpg, owner, passengers = 0 }) {
    const { fuelSpent, fuelSaved, ceProduced, ceSaved } = calculateFuelAndCe(mode, milesTraveled, mpg, passengers);
    const docID = this._collection.insert({
      date,
      milesTraveled,
      mode,
      mpg,
      owner,
      fuelSpent,
      fuelSaved,
      ceProduced,
      ceSaved,
      passengers,
    });
    return docID;
  }

  /**
   * Updates the existing Trip item/document.
   * @param docID the id of the document to update.
   * @param date the new date.
   * @param milesTraveled the new distance.
   * @param mode the new mode.
   * @param mpg the new mpg.
   */
  update(docID, { date, milesTraveled, mode, mpg, passengers }) {
    const trip = this.findDoc(docID);
    const updateData = {
      mpg: trip.mpg,
      milesTraveled: trip.milesTraveled,
      mode: trip.mode,
      passengers: trip.passengers,
    };
    if (date) {
      updateData.date = date;
    }
    if (!Number.isNaN(milesTraveled) && milesTraveled > 0) {
      updateData.milesTraveled = milesTraveled;
    }
    if (mode) {
      updateData.mode = mode;
    }
    if (!Number.isNaN(mpg)) {
      updateData.mpg = mpg;
    }
    if (!Number.isNaN(passengers)) {
      updateData.passengers = passengers;
    }
    const { ceProduced, ceSaved, fuelSpent, fuelSaved } = calculateFuelAndCe(updateData.mode, updateData.milesTraveled,
      updateData.mpg, updateData.passengers);
    updateData.ceProduced = ceProduced;
    updateData.ceSaved = ceSaved;
    updateData.fuelSpent = fuelSpent;
    updateData.fuelSaved = fuelSaved;
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param docID A document or docID in this collection.
   * @returns {boolean}
   */
  removeIt(docID) {
    const doc = this.findDoc(docID);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the trip associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(tripPublications.trip, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      Meteor.publish(tripPublications.tripCommunity, () => instance._collection.find());
    }
  }

  /**
   * Subscription method for trip owned by the current user.
   */
  subscribeTrip() {
    if (Meteor.isClient) {
      return Meteor.subscribe(tripPublications.trip);
    }
    return null;
  }

  /**
   * Subscription method.
   * It subscribes to the entire collection.
   */
  subscribeTripCommunity() {
    if (Meteor.isClient) {
      return Meteor.subscribe(tripPublications.tripCommunity);
    }
    return null;
  }

  /**
   * Gets all the detailed trip a user has.
   * @param username the username of the user (ex: admin@foo.com)
   * @returns {Array} of all the trips
   */
  getDetailedTrips(username) {
    return this._collection.find({ owner: username }).fetch();
  }

  /**
   * Gets all the detailed trip a user has.
   * @param username the username of the user (ex: admin@foo.com)
   * @returns {Array} of all the trips
   */
  getTripsSortedByDate(username) {
    return this._collection.find({ owner: username }, { sort: { date: -1 } }).fetch();
  }

  /**
   * Gets all the detailed trip a user has for a given month.
   * @param username the username of the user (ex: admin@foo.com)
   * @param monthNum the month specified (0-11, January to December)
   * @returns {Array} of all the trips of the given month
   */
  getTripsOnMonth(username, monthNum) {
    const trips = username ?
      this._collection.find({ owner: username }, { sort: [['date', 'asc']] }).fetch() :
      this._collection.find({}, { sort: [['date', 'asc']] }).fetch();
    const today = getDateToday();
    const month = monthNum || today.getMonth();
    return trips.filter(({ date }) => date.getMonth() === month);
  }

  /**
   * Gets only the dates, distances/miles traveled, and modes of transportation of each trips a user has.
   * @param username the username of the user (ex: admin@foo.com)
   * @returns {{date: *[], mode: *[], distance: *[]}}
   */
  getTripsDateDistanceMode(username) {
    const userTrips = this.getDetailedTrips(username);

    const date = [];
    const distance = [];
    const mode = [];

    userTrips.forEach(trip => {

      if (trip.mode === tripModes.GAS_CAR) {
        distance.push(-trip.milesTraveled);
      } else if (trip.mode === tripModes.GAS_CAR) {
        distance.push((trip.milesTraveled * (trip.passengers - 1)));
      } else {
        distance.push(trip.milesTraveled);
      }

      date.push(trip.date);
      mode.push(trip.mode);
    });

    return { date, distance, mode };
  }

  /**
   * Gets the number of times a user has used each mode of transportation.
   * @param username the username of the user (ex: admin@foo.com)
   * @returns {Object} an object wherein the keys are the different modes of transportation and the values are the number of times the each mode has been used.
   */
  getModesOfTransport(username) {
    const userTrips = this.getDetailedTrips(username);

    const modesOfTransport = userTrips.reduce((result, trip) => {
      const allModes = { ...result };
      if (trip.mode in allModes) {
        allModes[trip.mode]++;
      } else {
        allModes[trip.mode] = 1;
      }
      return allModes;
    }, {});

    return modesOfTransport;
  }

  /**
   * Gets the number of miles a user has traveled using each mode of transportation.
   * @param username the username of the user (ex: admin@foo.com)
   * @returns {Object} an object wherein the keys are the different modes of transportation and the values are the miles traveled using each mode.
   */
  getMilesPerMode(username) {
    const userTrips = this.getDetailedTrips(username);
    const modesMiles = {};

    tripModesArray.forEach(tripMode => {
      const filteredTrips = userTrips.filter(({ mode }) => tripMode === mode);
      modesMiles[tripMode] = filteredTrips.reduce((prev, trip) => prev + Number(trip.milesTraveled), 0);
    });

    return modesMiles;
  }

  /**
   * Returns the miles that the user has saved per day.
   * @param username the username of the user.
   * @returns {{date: [], mode: [], distance: []}}
   * An object that contains an array dates for each trip, an array of modes used for each of those trips and the
   * distance of the trip for respective date.
   */
  getMilesSavedPerDay(username) {
    const userTrips = this.getTripsSortedByDate(username);
    const date = [];
    const distance = [];
    const mode = [];

    userTrips.forEach((objects) => {

      const tripDate = objects.date;
      const tripDistance = objects.milesTraveled;
      const tripMode = objects.mode;

      // check to see if there is an existing trip for that date.
      const dateIndex = date.findIndex((o) => o.getTime() === tripDate.getTime());

      if (dateIndex !== -1) {
        if (tripMode === tripModes.GAS_CAR) {
          distance[dateIndex] -= tripDistance;
        } else {
          distance[dateIndex] += tripDistance;
        }
        mode[dateIndex] = mode[dateIndex].concat(`, ${tripMode}`);

      } else {
        if (tripMode === tripModes.GAS_CAR) {
          distance.push(-tripDistance);
        } else {
          distance.push(tripDistance);
        }
        date.push(tripDate);
        mode.push(tripMode);
      }
    });

    return { date: date, distance: distance, mode: mode };
  }

  /**
   * Gets the number of miles traveled using green modes of transport and miles traveled using gas car.
   * @param username the username of the user.
   * @returns {{milesAdded: number, milesSaved: number, milesTotal: number}} milesAdded is the miles traveled using
   * gas car, miles saved is the number
   * of miles using green modes of transport, milesTotal is the total of both.
   */
  getVehicleMilesTraveled(username) {
    const userTrips = this.getDetailedTrips(username);

    let milesSaved = 0;
    let milesAdded = 0;

    userTrips.forEach((trip) => {
      if (trip.mode === tripModes.GAS_CAR) {
        milesAdded += trip.milesTraveled;
      } else if (trip.mode === tripModes.CARPOOL) {
        milesAdded += trip.milesTraveled;
        milesSaved += (trip.milesTraveled * trip.passengers);
      } else {
        milesSaved += trip.milesTraveled;
      }
    });

    return { milesSaved: milesSaved, milesAdded: milesAdded, milesTotal: milesSaved + milesAdded };
  }

  /**
   * Returns the average vehicle miles traveled and vehicle miles saved yearly, monthly, and daily.
   * It is highly recommended that this part of code be refactored.
   * @param username
   * @returns {{milesSavedAvg: {month: (string|number), year: (string|number), day: (string|number)},
   * milesTraveledAvg: {month: (string|number), year: (string|number), day: (string|number)}}}
   */
  getMilesAvg(username) {
    const userTrips = this.getTripsSortedByDate(username);

    let currentYear = '';
    let currentMonth = '';

    const milesSavedPerYear = [];
    const milesSavedPerMonth = [];

    const milesTraveledPerYear = [];
    const milesTraveledPerMonth = [];

    let yearMilesSaved = 0;
    let monthMilesSaved = 0;
    let dayMilesSaved = 0;

    let yearMilesTraveled = 0;
    let monthMilesTraveled = 0;
    let dayMilesTraveled = 0;

    let totalTrips = 0;

    userTrips.forEach((object) => {

      const date = new Date(object.date);
      const mode = object.mode;
      const distance = object.milesTraveled;
      const numOfPassenger = object.passengers;

      const year = date.getFullYear();
      const month = date.getMonth();

      if (currentYear === '') {
        currentYear = year;
      } else if (currentYear !== year) {
        milesSavedPerYear.push(yearMilesSaved);
        milesTraveledPerYear.push(yearMilesTraveled);

        currentYear = year;
        yearMilesSaved = 0;
        yearMilesTraveled = 0;
      }

      if (currentMonth === '') {
        currentMonth = month;
      } else if (currentMonth !== month) {
        milesSavedPerMonth.push(monthMilesSaved);
        milesTraveledPerMonth.push(monthMilesTraveled);

        currentMonth = month;
        monthMilesSaved = 0;
        monthMilesTraveled = 0;
      }

      if (mode === tripModes.GAS_CAR) {
        yearMilesTraveled += distance;
        monthMilesTraveled += distance;
        dayMilesTraveled += distance;
      } else if (mode === tripModes.CARPOOL) {
        yearMilesTraveled += distance;
        yearMilesSaved += (distance * numOfPassenger);

        monthMilesTraveled += distance;
        monthMilesSaved += (distance * numOfPassenger);

        dayMilesTraveled += distance;
        dayMilesSaved += (distance * numOfPassenger);
      } else {
        yearMilesSaved += distance;
        monthMilesSaved += distance;
        dayMilesSaved += distance;
      }

      totalTrips += 1;

      // push if on the last trip
      if (totalTrips === userTrips.length) {
        milesSavedPerYear.push(yearMilesSaved);
        milesSavedPerMonth.push(monthMilesSaved);
        milesTraveledPerYear.push(yearMilesTraveled);
        milesTraveledPerMonth.push(monthMilesTraveled);
      }
    });

    // calculate average miles saved per time
    const yearMilesSavedAvg = (milesSavedPerYear.reduce((sum, n) => sum + n, 0)) / milesSavedPerYear.length;

    const monthMilesSavedAvg = (milesSavedPerMonth.reduce((sum, n) => sum + n, 0)) / milesSavedPerMonth.length;

    const dayMilesSavedAvg = dayMilesSaved / totalTrips;

    // calculate average miles traveled per time
    const yearMilesTraveledAvg = (milesTraveledPerYear.reduce((sum, n) => sum + n, 0)) / milesTraveledPerYear.length;

    const monthMilesTraveledAvg = (milesTraveledPerMonth.reduce((sum, n) => sum + n, 0)) / milesTraveledPerMonth.length;

    const dayMilesTraveledAvg = dayMilesTraveled / totalTrips;

    return {
      milesSavedAvg: {
        year: (yearMilesSavedAvg) ? yearMilesSavedAvg.toFixed(2) : 0,
        month: (monthMilesSavedAvg) ? monthMilesSavedAvg.toFixed(2) : 0,
        day: (dayMilesSavedAvg) ? dayMilesSavedAvg.toFixed(2) : 0,
      },
      milesTraveledAvg: {
        year: (yearMilesTraveledAvg) ? yearMilesTraveledAvg.toFixed(2) : 0,
        month: (monthMilesTraveledAvg) ? monthMilesTraveledAvg.toFixed(2) : 0,
        day: (dayMilesTraveledAvg) ? dayMilesTraveledAvg.toFixed(2) : 0,
      },
    };
  }

  /**
   * Gets the miles traveled and saved per day, used for chart.
   * It is highly recommended that this part of code be refactored.
   * @param username
   * @returns {{milesAdded: {date: *[], mode: *[], distance: *[]}, milesSaved: {date: *[], mode: *[], distance: *[]}}}
   */
  getMilesTraveledPerDay(username) {
    const userTrips = this.getTripsSortedByDate(username);

    const date = [];

    const saved = [];
    const savedMode = [];

    const added = [];
    const addedMode = [];

    let prevDate = new Date();

    userTrips.forEach((object) => {

      const tripDate = object.date;
      const tripDistance = object.milesTraveled;
      const tripMode = object.mode;

      if (prevDate.getTime() === tripDate.getTime()) {
        if (tripMode === tripModes.GAS_CAR) {
          if (added.length < date.length) {
            addedMode.push(tripMode);
            added.push(-tripDistance);
          } else {
            addedMode[added.length - 1] = tripMode;
            added[added.length - 1] -= tripDistance;
          }
        }

        if (tripMode !== tripModes.GAS_CAR) {
          if (saved.length < date.length) {
            savedMode.push(tripMode);
            saved.push(tripDistance);
          } else {
            savedMode[savedMode.length - 1] = savedMode[savedMode.length - 1].concat(`, ${tripMode}`);
            saved[saved.length - 1] += tripDistance;
          }
        }
      } else {
        date.push(tripDate);
        prevDate = tripDate;

        if (tripMode === tripModes.GAS_CAR) {
          addedMode.push(tripMode);
          added.push(-tripDistance);
        } else {
          savedMode.push(tripMode);
          saved.push(tripDistance);

          addedMode.push('');
          added.push(0);
        }
      }
    });

    return {
      milesSaved: { date: date, distance: saved, mode: savedMode },
      milesAdded: { date: date, distance: added, mode: addedMode },
    };
  }

  /**
   * Returns the total CE produced/saved by the user. CE is produced whenever the user uses the Carpool and Gas Car modes.
   * @param username the username of the user.
   * @returns {string} the amount of CE that the user produced. It is a string because the function does a .toFixed(2)
   * to round the number to two decimal places.
   */
  getCEProducedTotal(username) {
    const trips = username ?
      this._collection.find({ owner: username }).fetch() :
      this._collection.find({}).fetch();
    return Number(getTotalArray(trips.map(trip => trip.ceProduced)).toFixed(2));
  }

  getCESavedTotal(username) {
    const trips = username ?
      this._collection.find({ owner: username }).fetch() :
      this._collection.find({}).fetch();
    return Number(getTotalArray(trips.map(trip => trip.ceSaved)).toFixed(2));
  }

  /**
   * Gets the CE that the user has saved per day.
   * @param username the username of the user.
   * @returns {{date: [], ceSaved: []}}
   * An object that contains an array of dates for the trips and an array of CE saved for each of the respective date.
   */
  getCESavedPerDay(username) {
    const userTrips = this.getTripsSortedByDate(username);

    const date = [];
    const ceSaved = [];

    userTrips.forEach((trip) => {

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
  }

  /**
   * Gets the CE produced by the user per day.
   * @param username of the user
   * @returns {{date: *[], ceProduced: *[]}}
   */
  getCEProducedPerDay(username) {
    const userTrips = this.getTripsSortedByDate(username);

    const date = [];
    const ceProduced = [];

    userTrips.forEach((trip) => {

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
  }

  /**
   * Returns the average CE Saved, CE Produced, and the equivalent CE Produced had the user used EV Vehicles yearly,
   * monthly, and daily.
   * It is highly recommended that this part of code be refactored.
   * @param username
   * @returns {{ceSavedAvg: {ceSavedAvgPerDay: string, ceSavedAvgPerYear: string, ceSavedAvgPerMonth: string},
   * ceProducedAvg: {ceProducedAvgPerMonth: string, ceProducedAvgPerYear: string, ceProducedAvgPerDay: string},
   * evCeProducedAvg: {evCeProducedAvgPerDay: (string|string), evCeProducedAvgPerMonth: (string|string),
   *                  evCeProducedAvgPerYear: (string|string)}}}
   */
  getCEAvg(username) {
    const userTrips = this.getDetailedTrips(username);

    let currentYear = '';
    let currentMonth = '';

    let yearEvFuel = 0;
    let numOfYear = 0;

    let monthEvFuel = 0;
    let numOfMonth = 0;

    let dayEvFuel = 0;
    let numOfDay = 0;

    userTrips.forEach((object) => {

      const date = new Date(object.date);
      const mode = object.mode;
      const distance = object.milesTraveled;

      const year = date.getFullYear();
      const month = date.getMonth();

      if (currentYear !== year) {
        currentYear = year;
        numOfYear += 1;
      }

      if (currentMonth !== month) {
        currentMonth = month;
        numOfMonth += 1;
      }

      numOfDay += 1;

      if (mode === tripModes.GAS_CAR || mode === tripModes.CARPOOL) {
        yearEvFuel += (distance / avgMpge);
        monthEvFuel += (distance / avgMpge);
        dayEvFuel += (distance / avgMpge);
      }
    });

    const yearEvCeAvg = (yearEvFuel / numOfYear) * cePerGallonFuel;
    const monthEvCeAvg = (monthEvFuel / numOfMonth) * cePerGallonFuel;
    const dayEvCeAvg = (dayEvFuel / numOfDay) * cePerGallonFuel;

    const fuelAvg = this.getFuelAvg(username);

    const fuelSavedAvg = fuelAvg.fuelSavedAvg;
    const yearceSavedAvg = (fuelSavedAvg.year * cePerGallonFuel).toFixed(2);
    const monthceSavedAvg = (fuelSavedAvg.month * cePerGallonFuel).toFixed(2);
    const dayceSavedAvg = (fuelSavedAvg.day * cePerGallonFuel).toFixed(2);

    const fuelSpentAvg = fuelAvg.fuelSpentAvg;
    const yearCeProducedAvg = (fuelSpentAvg.year * cePerGallonFuel).toFixed(2);
    const monthCeProducedAvg = (fuelSpentAvg.month * cePerGallonFuel).toFixed(2);
    const dayCeProducedAvg = (fuelSpentAvg.day * cePerGallonFuel).toFixed(2);

    return {
      ceSavedAvg: {
        ceSavedAvgPerYear: yearceSavedAvg,
        ceSavedAvgPerMonth: monthceSavedAvg,
        ceSavedAvgPerDay: dayceSavedAvg,
      },
      ceProducedAvg: {
        ceProducedAvgPerYear: yearCeProducedAvg,
        ceProducedAvgPerMonth: monthCeProducedAvg,
        ceProducedAvgPerDay: dayCeProducedAvg,
      },
      evCeProducedAvg: {
        evCeProducedAvgPerYear: yearEvCeAvg ? yearEvCeAvg.toFixed(2) : '0.00',
        evCeProducedAvgPerMonth: monthEvCeAvg ? monthEvCeAvg.toFixed(2) : '0.00',
        evCeProducedAvgPerDay: dayEvCeAvg ? dayEvCeAvg.toFixed(2) : '0.00',
      },
    };
  }

  /**
   * Returns the total Fuel spent/saved by the user.
   * @param username the username of the user.
   * @returns {string} the amount of CE that the user produced. It is a string because the function does a .toFixed(2)
   * to round the number to two decimal places.
   */
  getFuelSpentTotal(username) {
    const trips = username ?
      this._collection.find({ owner: username }).fetch() :
      this._collection.find({}).fetch();
    return Number(getTotalArray(trips.map(trip => trip.fuelSpent)).toFixed(2));
  }

  getFuelSavedTotal(username) {
    const trips = username ?
      this._collection.find({ owner: username }).fetch() :
      this._collection.find({}).fetch();
    return Number(getTotalArray(trips.map(trip => trip.fuelSaved)).toFixed(2));
  }

  /**
   * Gets the fuel that the user saved per day as well as the dollar saved.
   * @param username the username of the user.
   * @returns {{date: [], fuel: [], price: []}}
   * An object that contains an array of dates and an array of fuel and dollar saved for the respective date.
   */
  getFuelSavedPerDay(username) {
    const userTrips = this.getTripsSortedByDate(username);

    const date = [];
    const fuel = [];
    const price = [];

    userTrips.forEach(trip => {
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
  }

  /**
   * Returns the average Fuel spent and fuel saved yearly, monthly, and daily.
   * It is highly recommended that this part of code be refactored.
   * @param username
   * @returns {{fuelSpentAvg: {month: (string|number), year: (string|number), day: (string|number)},
   * fuelSavedAvg: {month: (string|number), year: (string|number), day: (string|number)}}}
   */
  getFuelAvg(username) {
    const userTrips = this.getTripsSortedByDate(username);

    let currentYear = '';
    let currentMonth = '';

    const fuelSavedPerYear = [];
    const fuelSavedPerMonth = [];

    const fuelSpentPerYear = [];
    const fuelSpentPerMonth = [];

    let yearFuelSaved = 0;
    let monthFuelSaved = 0;
    let dayFuelSaved = 0;

    let yearFuelSpent = 0;
    let monthFuelSpent = 0;
    let dayFuelSpent = 0;

    let totalTrips = 0;

    userTrips.forEach((object) => {

      const date = new Date(object.date);

      const year = date.getFullYear();
      const month = date.getMonth();

      if (currentYear === '') {
        currentYear = year;
      } else if (currentYear !== year) {
        fuelSavedPerYear.push(yearFuelSaved);
        fuelSpentPerYear.push(yearFuelSpent);

        currentYear = year;
        yearFuelSaved = 0;
        yearFuelSpent = 0;
      }

      if (currentMonth === '') {
        currentMonth = month;
      } else if (currentMonth !== month) {
        fuelSavedPerMonth.push(monthFuelSaved);
        fuelSpentPerMonth.push(monthFuelSpent);

        currentMonth = month;
        monthFuelSaved = 0;
        monthFuelSpent = 0;
      }

      yearFuelSpent += object.fuelSpent;
      monthFuelSpent += object.fuelSpent;
      dayFuelSpent += object.fuelSpent;

      yearFuelSaved += object.fuelSaved;
      monthFuelSaved += object.fuelSaved;
      dayFuelSaved += object.fuelSaved;

      totalTrips += 1;

      // push if on the last trip
      if (totalTrips === userTrips.length) {
        fuelSavedPerYear.push(yearFuelSaved);
        fuelSavedPerMonth.push(monthFuelSaved);
        fuelSpentPerYear.push(yearFuelSpent);
        fuelSpentPerMonth.push(monthFuelSpent);
      }
    });

    // calculate average fuel saved per time
    const yearFuelSavedAvg = (fuelSavedPerYear.reduce((sum, n) => sum + n, 0)) / fuelSavedPerYear.length;

    const monthFuelSavedAvg = (fuelSavedPerMonth.reduce((sum, n) => sum + n, 0)) / fuelSavedPerMonth.length;

    const dayFuelSavedAvg = dayFuelSaved / totalTrips;

    // calculate average fuel spent per time
    const yearFuelSpentAvg = (fuelSpentPerYear.reduce((sum, n) => sum + n, 0)) / fuelSpentPerYear.length;

    const monthFuelSpentAvg = (fuelSpentPerMonth.reduce((sum, n) => sum + n, 0)) / fuelSpentPerMonth.length;

    const dayFuelSpentAvg = dayFuelSpent / totalTrips;

    // return 0 if no data since it will return NaN otherwise
    return {
      fuelSavedAvg: {
        year: (yearFuelSavedAvg) ? yearFuelSavedAvg.toFixed(2) : 0,
        month: (monthFuelSavedAvg) ? monthFuelSavedAvg.toFixed(2) : 0,
        day: (dayFuelSavedAvg) ? dayFuelSavedAvg.toFixed(2) : 0,
      },
      fuelSpentAvg: {
        year: (yearFuelSpentAvg) ? yearFuelSpentAvg.toFixed(2) : 0,
        month: (monthFuelSpentAvg) ? monthFuelSpentAvg.toFixed(2) : 0,
        day: (dayFuelSpentAvg) ? dayFuelSpentAvg.toFixed(2) : 0,
      },
    };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Trips = new TripCollection();
