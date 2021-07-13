import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';
import { averageAutoMPG, tripModes } from '../utilities/constants';
import { vehicleMakes } from '../utilities/VehicleMakes';
import { ROLE } from '../role/Role';

export const userVehiclePublications = {
  userVehicle: 'UserVehicle',
  userVehicleCumulative: 'UserVehicleCumulative',
};

class UserVehicleCollection extends BaseCollection {
  constructor() {
    super('UserVehicle', new SimpleSchema({
      name: String,
      make: String,
      model: String,
      owner: String,
      logo: String,
      price: Number,
      year: Number,
      MPG: Number,
      fuelSpending: Number,
      type: {
        type: String,
        allowedValues: [tripModes.GAS_CAR, tripModes.ELECTRIC_VEHICLE],
      },
    }));
  }

  define({ name, make, model, owner, price, year, MPG, fuelSpending }) {
    const logoArray = vehicleMakes.filter(makeLogo => makeLogo.make === make);
    const logo = logoArray.length === 0 ? '/images/default/default-pfp.png' :
      logoArray[0].logo;
    const type = MPG <= 0 ? tripModes.ELECTRIC_VEHICLE : tripModes.GAS_CAR;
    const docID = this._collection.insert({
      name,
      make,
      model,
      owner,
      logo,
      price,
      year,
      MPG,
      fuelSpending,
      type,
    });
    return docID;
  }

  update(docID, { name, make, model, price, year, MPG, fuelSpending }) {
    const updateData = {};
    const logoArray = vehicleMakes.filter(makeLogo => makeLogo.make === make);
    updateData.logo = logoArray.length === 0 ? '/images/default/default-pfp.png' :
      logoArray[0].logo;
    updateData.type = MPG < 0 ? tripModes.ELECTRIC_VEHICLE : tripModes.GAS_CAR;
    if (name) {
      updateData.name = name;
    }
    if (model) {
      updateData.model = model;
    }
    if (_.isNumber(year)) {
      updateData.Year = year;
    }
    if (_.isNumber(MPG)) {
      updateData.MPG = MPG;
    }
    if (_.isNumber(price)) {
      updateData.price = price;
    }
    if (_.isNumber(fuelSpending)) {
      updateData.fuelSpending = fuelSpending;
    }
    this._collection.update(docID, { $set: updateData });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
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

  getUserMpg = (owner) => {
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

export const UserVehicles = new UserVehicleCollection();
