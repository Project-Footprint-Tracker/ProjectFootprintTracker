import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { averageAutoMPG } from '../utilities/constants';

class AllVehicleCollection extends BaseCollection {
  constructor() {
    super('AllVehicle', new SimpleSchema({
      Owner: String,
      Year: Number,
      Make: String,
      Model: String,
      Mpg: Number,
      Type: {
        type: String,
        allowedValues: ['Gas', 'EV/Hybrid'],
      },
    }));
  }

  define({ Owner, Year, Make, Model, Mpg }) {
    const Type = Mpg > 0 ? 'Gas' : 'EV/Hybrid';
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
    updateData.Type = Mpg > 0 ? 'Gas' : 'EV/Hybrid';
    if (_.isNumber(Year)) {
      updateData.Year = Year;
    }
    if (Make) {
      updateData.Make = Make;
    }
    if (Model) {
      updateData.Make = Model;
    }
    if (_.isNumber(Mpg)) {
      updateData.Mpg = Mpg;
    }
    this._collection.update(docID, { $set: updateData });
  }

  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish('AllVehicle', function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  subscribeAllVehicle() {
    if (Meteor.isClient) {
      return Meteor.subscribe('AllVehicle');
    }
    return null;
  }

  getAllVehicles() {
    return this._collection.find({}).fetch();
  }

  getEvVehicles() {
    const vehicles = this._collection.find({}).fetch();
    const evVehicles = [];

    vehicles.forEach(vehicle => {
      if (vehicle.Type === 'EV/Hybrid') {
        evVehicles.push(vehicle);
      }
    });

    return _.uniq(evVehicles);
  }

  getUserVehicles(email) {
    return this._collection.find({ Owner: email }).fetch();
  }

  getUserMpg(owner) {
    const userVehicles = this._collection.find({ Owner: owner }).fetch();

    if (userVehicles.length) {
      let avgMpg = 0;
      _.forEach(userVehicles, function (vehicles) {
        avgMpg += vehicles.Mpg;
      });

      return avgMpg / userVehicles.length;
    }

    return averageAutoMPG;
  };
}

export const AllVehicles = new AllVehicleCollection();
