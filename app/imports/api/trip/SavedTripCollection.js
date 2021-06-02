import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import swal from 'sweetalert';
import BaseCollection from '../base/BaseCollection';
import { tripModes } from './TripCollection';

export const savedTripPublications = {
  savedTrip: 'SavedTrip',
  savedTripCommunity: 'SavedTripCommunity',
};

class SavedTripCollection extends BaseCollection {
  constructor() {
    super('SavedTripCollection', new SimpleSchema({
      description: {
        type: String,
        defaultValue: `Saved Trip ${new Date()}`,
      },
      distance: Number,
      mode: {
        type: String,
        allowedValues: tripModes,
        defaultValue: 'Gas Car',
      },
      passenger: {
        type: Number,
        defaultValue: 0,
      },
      mpg: Number,
      owner: String,
      county: String,
    }));
  }

  /**
   * Defines a new Trip item.
   * @param date of trip.
   * @param distance traveled.
   * @param mode of transportation.
   * @param mpg of vehicle.
   * @param owner the owner of the item.
   * @param county the county of the owner.
   * @return {String} the docID of the new document.
   */
  define({ description, distance, mode, passenger, mpg, owner, county }) {
    const docID = this._collection.insert({
      description,
      distance,
      mode,
      passenger,
      mpg,
      owner,
      county,
    });
    return docID;
  }

  defineWithMessage({ description, distance, mode, passenger, mpg, owner, county }) {
    const docID = this._collection.insert({ description, distance, mode, passenger, mpg, owner, county },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'SavedTrip added successfully', 'success');
        }
      });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param date the new date.
   * @param distance the new distance (optional).
   * @param mode the new mode (optional).
   * @param mpg the new mpg (optional).
   */
  /* update(docID, { date, distance, mode, mpg }) {
    const updateData = {};
    // if (distance) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (date) {
      updateData.date = date;
    }
    if (_.isNumber(distance)) {
      updateData.distance = distance;
    }
    if (mode) {
      updateData.condition = mode;
    }
    if (_.isNumber(mpg)) {
      updateData.mpg = mpg;
    }
    this._collection.update(docID, { $set: updateData });
  } */

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns boolean
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    // check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the trip associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the TripCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(savedTripPublications.savedTrip, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          const county = Meteor.users.findOne(this.userId).profile.county;
          return instance._collection.find({ owner: username, county: county });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user. */
      Meteor.publish(savedTripPublications.savedTripCommunity, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for trip owned by the current user.
   */
  subscribeTrip() {
    if (Meteor.isClient) {
      return Meteor.subscribe(savedTripPublications.savedTrip);
    }
    return null;
  }

  /**
   * Subscription method.
   * It subscribes to the entire collection.
   */
  subscribeTripCommunity() {
    if (Meteor.isClient) {
      return Meteor.subscribe(savedTripPublications.savedTripCommunity);
    }
    return null;
  }

  /**
   * Gets the modes of transportation that the user has used. Only returning the ones that they used and ignoring the ones that they did not.
   * @param username the username of the user (ex: admin@foo.com)
   * @returns {{label: [], value: []}} an object with two keys, label which is an array of modes of transportation that they used, and value which is an array of count
   * for the respective mode.
   */
  // getModesOfTransport(username) {
  //   const userTrips = this._collection.find({ owner: username }).fetch();
  //   const modesOfTransport = [
  //     { mode: 'Telework', value: 0 },
  //     { mode: 'Public Transportation', value: 0 },
  //     { mode: 'Bike', value: 0 },
  //     { mode: 'Walk', value: 0 },
  //     { mode: 'Carpool', value: 0 },
  //     { mode: 'Electric Vehicle', value: 0 },
  //     { mode: 'Gas Car', value: 0 },
  //   ];
  //
  //   // iterate over user's trips and increment each value of mode they used.
  //   _.forEach(userTrips, function (objects) {
  //     const mode = _.find(modesOfTransport, ['mode', objects.mode]);
  //     mode.value += 1;
  //   });
  //
  //   const modesOfTransportValue = [];
  //   const modesOfTransportLabel = [];
  //
  //   // create the formatted data value and label for the charts.
  //   _.forEach(modesOfTransport, function (objects) {
  //     if (objects.value !== 0) {
  //       modesOfTransportValue.push(objects.value);
  //       modesOfTransportLabel.push(objects.mode);
  //     }
  //   });
  //
  //   return { value: modesOfTransportValue, label: modesOfTransportLabel };
  // }

  /**
   * Gets the number of miles traveled using green modes of transport and miles traveled using gas car.
   * @param username the username of the user.
   * @returns {{milesAdded: number, milesSaved: number}} milesAdded is the miles traveled using gas car and miles saved is the number
   * of miles using green modes of transport.
   */
  // getVehicleMilesTraveled(username) {
  //   const userTrips = this._collection.find({ owner: username }).fetch();
  //
  //   let milesSaved = 0;
  //   let milesAdded = 0;
  //
  //   _.forEach(userTrips, function (objects) {
  //     if (objects.mode === 'Gas Car') {
  //       milesAdded += objects.distance;
  //     } else if (objects.mode === 'Carpool') {
  //       milesAdded += (objects.distance * objects.passenger);
  //       milesSaved += objects.distance;
  //     } else {
  //       milesSaved += objects.distance;
  //     }
  //   });
  //
  //   return { milesSaved: milesSaved, milesAdded: milesAdded };
  // }

  /**
   * Returns the total miles that the user has traveled.
   * @param username the username of the user.
   * @returns {number} the total miles.
   */
  // getMilesTotal(username) {
  //   const userTrips = this._collection.find({ owner: username }).fetch();
  //
  //   let milesSaved = 0;
  //   _.forEach(userTrips, function (objects) {
  //     milesSaved += objects.distance;
  //   });
  //
  //   return milesSaved;
  // }

  /**
   * Returns the miles that the user has saved per day.
   * @param username the username of the user.
   * @returns {{date: [], mode: [], distance: []}}
   * An object that contains an array dates for each trip, an array of modes used for each of those trips and the distance of the trip for respective date.
   */
  // getMilesSavedPerDay(username) {
  //   const userTrips = this._collection.find({ owner: username }).fetch();
  //
  //   const date = [];
  //   const distance = [];
  //   const mode = [];
  //
  //   _.forEach(userTrips, function (objects) {
  //     date.push(objects.date);
  //     distance.push(objects.distance);
  //     mode.push(objects.mode);
  //   });
  //
  //   return { date: date, distance: distance, mode: mode };
  // }

  /**
   * Returns the GHG that the specified user produced. GHG is produced whenever the user uses the Carpool and Gas Car modes.
   * @param username the username of the user.
   * @param userMPG the MPG of the user
   * @returns {string} the amount of GHG that the user produced. It is a string because the function does a .toFixed(2) to round
   * the number to two decimal places.
   */
  // getGHGProducedTotal(username, userMPG) {
  //   const userTrips = this._collection.find({ owner: username }).fetch();
  //
  //   const ghgPerGallon = 19.6;
  //   let ghgProduced = 0;
  //
  //   _.forEach(userTrips, function (objects) {
  //     if (objects.mode === 'Gas Car' || objects.mode === 'Carpool') {
  //       ghgProduced += ((objects.distance / userMPG) * ghgPerGallon);
  //     }
  //   });
  //
  //   return ghgProduced.toFixed(2);
  // }

  /**
   * Gets the GHG that the user has reduced each day.
   * @param username the username of the user.
   * @param userMPG the MPG of the user.
   * @returns {{date: [], ghg: []}}
   * An object that contains an array of dates for the trips and an array of GHG that they saved for each of the respective date.
   */
  // getGHGReducedPerDay(username, userMPG) {
  //   const userTrips = this._collection.find({ owner: username }).fetch();
  //
  //   const date = [];
  //   const ghg = [];
  //
  //   const ghgPerGallon = 19.6;
  //
  //   _.forEach(userTrips, function (objects) {
  //     date.push(objects.date);
  //     ghg.push(((objects.distance / userMPG) * ghgPerGallon).toFixed(2));
  //   });
  //
  //   return { date: date, ghg: ghg };
  // }

  /**
   * Gets the fuel that the user saved per day as well as the dollar saved.
   * @param username the username of the user.
   * @param userMPG the MPG of the user.
   * @returns {{date: [], fuel: [], price: []}}
   * An object that contains an array of dates and an array of fuel and dollar saved for the respective date.
   */
//   getFuelSavedPerDay(username, userMPG) {
//     const userTrips = this._collection.find({ owner: username }).fetch();
//
//     const date = [];
//     const fuel = [];
//     const price = [];
//
//     _.forEach(userTrips, function (objects) {
//       date.push(objects.date);
//       fuel.push((objects.distance / userMPG).toFixed(2));
//       price.push(((objects.distance / userMPG) * 3.77).toFixed(2));
//     });
//
//     return { date: date, fuel: fuel, price: price };
//   }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const SavedTrips = new SavedTripCollection();
