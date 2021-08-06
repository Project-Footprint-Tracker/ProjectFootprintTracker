import { Trips } from '../../api/trip/TripCollection';
import { SavedCommutes } from '../../api/saved-commute/SavedCommuteCollection';
import { Groups } from '../../api/group/GroupCollection';
import { GroupMembers } from '../../api/group/GroupMemberCollection';
import { EvVehicles } from '../../api/vehicle/EvVehicleCollection';
import { UserVehicles } from '../../api/vehicle/UserVehicleCollection';

/* eslint-disable no-console */
const getAssetsData = (filename) => JSON.parse(Assets.getText(filename));

/* Initialize the users collection if empty. */
if (Trips.count() === 0) {
  getAssetsData('sampleTrips.json').map(trip => Trips.define(trip));
  console.log(`  TripCollection: ${Trips.count()} trips`);
}

if (SavedCommutes.count() === 0) {
  getAssetsData('sampleSavedCommutes.json').map(commute => SavedCommutes.define(commute));
  console.log(`  SavedCommuteCollection: ${SavedCommutes.count()} commutes`);
}

if (Groups.count() === 0) {
  const groupInfo = getAssetsData('sampleGroups.json');
  groupInfo.groups.forEach(group => Groups.define(group));
  groupInfo.groupMembers.forEach(member => GroupMembers.define(member));
}

if (UserVehicles.count() === 0) {
  getAssetsData('sampleUserVehicles.json').map(vehicle => UserVehicles.define(vehicle));
  console.log(`  UserVehicleCollection: ${UserVehicles.count()} vehicles`);
}

if (EvVehicles.count() === 0) {
  getAssetsData('sampleEvVehicles.json').map(vehicle => EvVehicles.define(vehicle));
  console.log(`  EvVehicleCollection: ${EvVehicles.count()} vehicles`);
}
