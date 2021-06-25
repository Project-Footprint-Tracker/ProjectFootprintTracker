import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';

export const savedCommutePublications = {
  savedCommute: 'SavedCommute',
  savedCommuteCommunity: 'SavedCommuteCommunity',
};

class SavedCommuteCollection extends BaseCollection {
  constructor() {
    super('SavedCommute', new SimpleSchema({
      name: String,
      distanceMiles: Number,
      mode: String,
      mpg: Number,
      owner: String,
    }));
  }

  /**
   * Defines new SavedCommute item.
   * @param name (custom name) of the trip.
   * @param distanceMiles traveled.
   * @param mode of transportation.
   * @param mpg of user's vehicle
   * @param owner of the item.
   * @returns {String} the docID of the new document.
   */
  define({ name, distanceMiles, mode, mpg, owner }) {
    const docID = this._collection.insert({
      name,
      distanceMiles,
      mode,
      mpg,
      owner,
    });
    return docID;
  }

  defineWithMessage({ name, distanceMiles, mode, mpg, owner }) {
    const docID = this._collection.insert({
      name,
      distanceMiles,
      mode,
      mpg,
      owner,
    },
    (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'SavedTrip added successfully', 'success');
      }
    });
    return docID;
  }

  update(docID, { name, distanceMiles, mode, mpg }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (_.isNumber(distanceMiles) && distanceMiles > 0) {
      updateData.distanceMiles = distanceMiles;
    }
    if (mode) {
      updateData.mode = mode;
    }
    if (_.isNumber(mode)) {
      updateData.mpg = mpg;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns boolean
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    this._collection.remove(doc._id);
    return true;
  }

  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(savedCommutePublications.savedCommute, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      Meteor.publish(savedCommutePublications.savedCommuteCommunity, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  subscribeSavedCommute() {
    if (Meteor.isClient) {
      return Meteor.subscribe(savedCommutePublications.savedCommute);
    }
    return null;
  }

  subscribeSavedCommuteCommunity() {
    if (Meteor.isClient) {
      return Meteor.subscribe(savedCommutePublications.savedCommuteCommunity);
    }
    return null;
  }
}

export const SavedCommutes = new SavedCommuteCollection();
