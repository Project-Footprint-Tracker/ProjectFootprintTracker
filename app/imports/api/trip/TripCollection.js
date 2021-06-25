import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';
import { tripModes, tripModesArray } from '../utilities/constants';
import { ROLE } from '../role/Role';

export const tripPublications = {
  trip: 'Trip',
  tripCommunity: 'TripCommunity',
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
    const docID = this._collection.insert({
      date,
      milesTraveled,
      mode,
      mpg,
      owner,
    });
    return docID;
  }

  defineWithMessage({ date, milesTraveled, mode, mpg, owner }) {
    const docID = this._collection.insert({
      date,
      milesTraveled,
      mode,
      mpg,
      owner,
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
    const updateData = {};
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
