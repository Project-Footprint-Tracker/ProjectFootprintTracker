import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';
import BaseCollection from '../base/BaseCollection';

class EvVehicleCollection extends BaseCollection {
  constructor() {
    super('EvVehicles', new SimpleSchema({
      year: Number,
      make: String,
      model: String,
      mpge: Number,
    }));
  }

  define({ year, make, model, mpge }) {
    const docID = this._collection.insert({
      year,
      make,
      model,
      mpge,
    });
    return docID;
  }

  update(docID, { year, make, model, mpge }) {
    const updateData = {};
    if (_.isNumber(year)) {
      updateData.Year = year;
    }
    if (make) {
      updateData.Make = make;
    }
    if (model) {
      updateData.Make = model;
    }
    if (_.isNumber(mpge)) {
      updateData.Mpge = mpge;
    }
    this._collection.update(docID, { $set: updateData });
  }

  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish('EvVehicles', function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  subscribeEvVehicle() {
    if (Meteor.isClient) {
      return Meteor.subscribe('EvVehicles');
    }
    return null;
  }

  getVehicles() {
    return this._collection.find({}).fetch();
  }
}

export const EvVehicles = new EvVehicleCollection();
