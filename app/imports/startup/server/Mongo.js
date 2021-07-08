import { Trips } from '../../api/trip/TripCollection';
import { SavedCommutes } from '../../api/saved-commute/SavedCommute';
import { Users } from '../../api/user/UserCollection';
import { AllVehicles } from '../../api/vehicle/AllVehicleCollection';

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

/** Initialize the users collection if empty. */
if (Users.count() === 0) {
  getAssetsData('sampleUsers.json').map(user => Users.define(user));
  console.log(`  UserCollection: ${Users.count()} users`);
}

if (AllVehicles.count() === 0) {
  getAssetsData('')
}