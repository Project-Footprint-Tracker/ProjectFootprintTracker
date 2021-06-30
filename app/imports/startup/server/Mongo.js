import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Stuffs } from '../../api/stuff/Stuff.js';
import { Trips } from '../../api/trip/TripCollection';
import { SavedCommutes } from '../../api/saved-commute/SavedCommute';
import { Groups } from '../../api/group/GroupCollection';
import { Users } from '../../api/user/UserCollection';
import { ROLE } from '../../api/role/Role';
import { GroupMembers } from '../../api/group/GroupMemberCollection';

/* eslint-disable no-console */

function createUser(email, password, role) {
  console.log(`  Creating user ${email} with role ${role}.`);
  const userID = Accounts.createUser({
    username: email,
    email: email,
    password: password,
  });
  if (role === ROLE.ADMIN) {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, ROLE.ADMIN);
  } else {
    Roles.createRole(ROLE.USER, { unlessExists: true });
    Roles.addUsersToRoles(userID, ROLE.USER);
  }
}

const getAssetsData = (filename) => JSON.parse(Assets.getText(filename));

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
  groupInfo.users.forEach(user => {
    Users.define(user);
    createUser(user.email, 'changeme', ROLE.USER);
  });
  groupInfo.groups.forEach(group => Groups.define(group));
  groupInfo.groupMembers.forEach(member => GroupMembers.define(member));
  groupInfo.trips.forEach(trip => Trips.define(trip));
}

/** Initialize the users collection if empty. */
if (Users.count() === 0) {
  getAssetsData('sampleUsers.json').forEach(user => {
    Users.define(user);
    createUser(user.email, 'changeme');
  });
  console.log(`  UserCollection: ${Users.count()} users`);
}
