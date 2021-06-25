import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/Stuff.js';
import { Trips } from '../../api/trip/TripCollection';
import { SavedCommutes } from '../../api/saved-commute/SavedCommute';

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

// Initialize the database with a default data document.
function addData(data) {
  // console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.collection.insert(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    // console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}
