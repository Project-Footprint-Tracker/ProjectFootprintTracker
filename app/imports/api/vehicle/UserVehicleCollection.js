import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';

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
    if (Make) {
      updateData.Make = Make;
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
