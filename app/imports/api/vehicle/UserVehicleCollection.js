import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';
import { VehicleMakes } from './VehicleMakeCollection';
import { tripModes } from '../utilities/constants';

export const userVehiclePublications = {
  userVehicle: 'UserVehicle',
  userVehicleCumulative: 'UserVehicleCumulative',
};

class UserVehicleCollection extends BaseCollection {
  constructor() {
    super('UserVehicle', new SimpleSchema({
      Owner: String,
      Year: Number,
      Make: String,
      Model: String,
      Mpg: Number,
      Type: {
        type: String,
        allowedValues: [tripModes.GAS_CAR, tripModes.ELECTRIC_VEHICLE],
      },
    }));
  }

  define({ name, make, model, owner, price, year, MPG, fuelSpending }) {
    let logo = VehicleMakes.findOne({ make: make })?.logo;
    if (!logo) {
      logo = 'None';
    }
    const type = MPG < 0 ? tripModes.ELECTRIC_VEHICLE : tripModes.GAS_CAR;
    const docID = this._collection.insert({
      Owner,
      Year,
      Make,
      Model,
      Mpg,
      Type,
    });
    return docID;
  }

  update(docID, { Year, Make, Model, Mpg }) {
    const updateData = {};
    updateData.logo = VehicleMakes.findOne({ make: make })?.logo;
    updateData.type = MPG < 0 ? tripModes.ELECTRIC_VEHICLE : tripModes.GAS_CAR;
    if (name) {
      updateData.name = name;
    }
    if (Model) {
      updateData.Model = Model;
    }
    if (_.isNumber(Year)) {
      updateData.Year = Year;
    }
    if (_.isNumber(Mpg)) {
      updateData.Mpg = Mpg;
    }
    this._collection.update(docID, { $set: updateData });
  }

  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(userVehiclePublications.userVehicle, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ Owner: username });
        }
        return this.ready();
      });

      Meteor.publish(userVehiclePublications.userVehicleCumulative, () => instance._collection.find());
    }
  }

  subscribeUserVehicle() {
    if (Meteor.isClient) {
      return Meteor.subscribe(userVehiclePublications.userVehicle);
    }
    return null;
  }

  subscribeUserVehicleCumulative() {
    if (Meteor.isClient) {
      return Meteor.subscribe(userVehiclePublications.userVehicleCumulative);
    }
    return null;
  }
}

export const UserVehicles = new UserVehicleCollection();
