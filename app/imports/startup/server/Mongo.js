import { Meteor } from 'meteor/meteor';
import { Trips } from '../../api/trip/TripCollection';
import { SavedCommutes } from '../../api/saved-commute/SavedCommute';
import { Users } from '../../api/user/UserCollection';

/* eslint-disable no-console */

const getAssetsData = (filename) => JSON.parse(Assets.getText(filename));

if (Trips.count() === 0) {
  getAssetsData('sampleTrips.json').map(trip => Trips.define(trip));
  console.log(`  TripCollection: ${Trips.count()} trips`);
}

if (SavedCommutes.count() === 0) {
  getAssetsData('sampleSavedCommutes.json').map(commute => SavedCommutes.define(commute));
  console.log(`  SavedCommuteCollection: ${SavedCommutes.count()} commutes`);
}

function addUserData(data) {
  console.log(`  Adding: user ${data.firstName} ${data.lastName} (${data.email})`);
  Users.define(data);
}

/** Initialize the users collection if empty. */
if (Users.find().count() === 0) {
  if (Meteor.settings.defaultUsers) {
    console.log('Creating default users.');
    Meteor.settings.defaultUsers.map(data => addUserData(data));
  }
}