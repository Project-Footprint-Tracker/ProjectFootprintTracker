import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';
import BaseCollection from '../base/BaseCollection';

class EvVehicleCollection extends BaseCollection {
  constructor() {
    super('EvVehicles', new SimpleSchema({
      Year: Number,
      Make: String,
      Model: String,
      Mpge: Number,
    }));
  }

  define({ Year, Make, Model, Mpge }) {
    const docID = this._collection.insert({
      Year,
      Make,
      Model,
      Mpge,
    });
    return docID;
  }

  update(docID, { Year, Make, Model, Mpge }) {
    const updateData = {};
    if (_.isNumber(Year)) {
      updateData.Year = Year;
    }
    if (Make) {
      updateData.Make = Make;
    }
    if (Model) {
      updateData.Make = Model;
    }
    if (_.isNumber(Mpge)) {
      updateData.Mpge = Mpge;
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
