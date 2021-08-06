import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { Users } from '../../api/user/UserCollection';

/* eslint-disable no-console */

export function createUser(email, password, role) {
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

// When running app for first time, pass a settings file to set up a default user account.
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    const users = JSON.parse(Assets.getText('sampleUsers.json'));
    users.forEach(user => {
      Users.define(user);
      createUser(user.email, 'changeme', user.role || ROLE.USER);
    });
    console.log(`  UserCollection: ${Users.count()} users`);
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
