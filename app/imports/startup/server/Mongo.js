import { Meteor } from 'meteor/meteor';
import { Users } from '../../api/user/UserCollection';
import { Trips } from '../../api/trip/TripCollection';

/* eslint-disable no-console */

function addTrips(data) {
  console.log(`Adding trip on ${data.date} with distance ${data.distance} using ${data.mode}`);
  Trips.define(data);
}

function addUsers(data) {
  console.log(`Adding user ${data.firstName} ${data.lastName} with email ${data.email}`);
  Users.define(data);
}

if (Users.find({}).count() === 0) {
  if (Meteor.settings.defaultUsers) {
    console.log('Creating default users');
    Meteor.settings.defaultUsers.map(data => addUsers(data));
  }
}

if (Trips.find({}).count() === 0) {
  if (Meteor.settings.defaultTrips) {
    console.log('Creating default trips');
    Meteor.settings.defaultTrips.map(data => addTrips(data));
  }
}
