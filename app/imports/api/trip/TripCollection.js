import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';
import { cePerGallonFuel, tripModes, tripModesArray } from '../utilities/constants';
import { ROLE } from '../role/Role';

export const tripPublications = {
  trip: 'Trip',
  tripCommunity: 'TripCommunity',
};

const calculateCarbonEmissions = (mode, miles, mpg, passengers = 0) => {
  const ce = (miles / mpg) * cePerGallonFuel;
  switch (mode) {
  case tripModes.GAS_CAR:
    return {
      ceProduced: ce,
      ceSaved: 0,
    };
  case tripModes.CARPOOL: {
    const ceProduced = ce / (passengers + 1); // CAM we might need to add passengers as an optional field to trip.
    const ceSaved = ce - ceProduced;
    return {
      ceProduced,
      ceSaved,
    };
  }
  default:
    return {
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
      milesTraveled: Number,
      mode: {
        type: String,
        allowedValues: tripModesArray,
        defaultValue: tripModes.GAS_CAR,
      },
      mpg: Number,
      owner: String,
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
   * @returns {String} the docID of the new document.
   */
  define({ date, milesTraveled, mode, mpg, owner }) {
    const { ceProduced, ceSaved } = calculateCarbonEmissions(mode, milesTraveled, mpg);
    const docID = this._collection.insert({
      date,
      milesTraveled,
      mode,
      mpg,
      owner,
      ceProduced,
      ceSaved,
    });
    return docID;
  }

  defineWithMessage({ date, milesTraveled, mode, mpg, owner }) {
    const { ceProduced, ceSaved } = calculateCarbonEmissions(mode, milesTraveled, mpg);
    const docID = this._collection.insert({
      date,
      milesTraveled,
      mode,
      mpg,
      owner,
      ceProduced,
      ceSaved,
    },
    (error) => ((error) ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Trip added successfully', 'success')));
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
  update(docID, { date, milesTraveled, mode, mpg }) {
    const trip = this.findDoc(docID);
    const updateData = {
      mpg: trip.mpg,
      milesTraveled: trip.milesTraveled,
      mode: trip.mode,
    };
    if (date) {
      updateData.date = date;
    }
    if (_.isNumber(milesTraveled) && milesTraveled > 0) {
      updateData.milesTraveled = milesTraveled;
    }
    if (mode) {
      updateData.mode = mode;
    }
    if (_.isNumber(mpg)) {
      updateData.mpg = mpg;
    }
    const { ceProduced, ceSaved } = calculateCarbonEmissions(updateData.mode, updateData.milesTraveled, updateData.mpg);
    updateData.ceProduced = ceProduced;
    updateData.ceSaved = ceSaved;
    this._collection.update(docID, { $set: updateData }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Data edited successfully', 'success')));
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param docID A document or docID in this collection.
   * @returns {boolean}
   */
  removeIt(docID) {
    const doc = this.findDoc(docID);
    this._collection.remove(doc._id, (error) => ((error) ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Trip added successfully', 'success')));
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

      Meteor.publish(tripPublications.tripCommunity, function publish() {
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
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Trips = new TripCollection();
