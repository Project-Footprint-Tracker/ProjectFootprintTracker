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
      year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear(),
      },
      MPG: Number,
      fuelSpending: Number,
      type: {
        type: String,
        allowedValues: [tripModes.GAS_CAR, tripModes.ELECTRIC_VEHICLE],
      },
    }));
  }

  define({ name, make, model, owner, price, year, MPG, fuelSpending }) {
    const logoArray = vehicleMakes.filter(makeLogo => makeLogo.make.split(' ')[0] === make.split(' ')[0]);
    const definitionData = {};
    definitionData.name = (name || `${year} ${make} ${model}`);
    definitionData.make = make;
    definitionData.model = model;
    definitionData.owner = owner;
    definitionData.logo = logoArray.length === 0 ? '/images/default/default-pfp.png' :
      logoArray[0].logo;
    definitionData.price = price || 0;
    definitionData.year = year;
    definitionData.MPG = MPG;
    definitionData.fuelSpending = fuelSpending || 0;
    definitionData.type = MPG <= 0 ? tripModes.ELECTRIC_VEHICLE : tripModes.GAS_CAR;
    const docID = this._collection.insert(definitionData);
    return docID;
  }

  update(docID, { name, make, model, price, year, MPG, fuelSpending }) {
    const updateData = {};
    const logoArray = vehicleMakes.filter(makeLogo => makeLogo.make.split(' ')[0] === make.split(' ')[0]);
    updateData.logo = logoArray.length === 0 ? '/images/default/default-pfp.png' :
      logoArray[0].logo;
    updateData.type = MPG <= 0 ? tripModes.ELECTRIC_VEHICLE : tripModes.GAS_CAR;
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
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      Meteor.publish(userVehiclePublications.userVehicleCumulative, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
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
      if (vehicle.type === tripModes.ELECTRIC_VEHICLE) {
        evVehicles.push(vehicle);
      }
    });

    return _.uniq(evVehicles);
  }

  getUserVehicles(email) {
    return this._collection.find({ owner: email }).fetch();
  }

  getUserMpg(owner) {
    const userVehicles = this._collection.find({ owner: owner }).fetch();

    if (userVehicles.length) {
      let avgMpg = 0;
      _.forEach(userVehicles, function (vehicles) {
        if (vehicles.type === tripModes.GAS_CAR) {
          avgMpg += vehicles.MPG;
        }
      });

      return avgMpg / userVehicles.length;
    }

    return averageAutoMPG;
  };
}

export const UserVehicles = new UserVehicleCollection();
