import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import swal from 'sweetalert';
import BaseCollection from '../base/BaseCollection';
import { tripModes } from '../utilities/constants';

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
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const SavedTrips = new SavedTripCollection();
