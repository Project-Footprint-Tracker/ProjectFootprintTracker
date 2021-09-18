import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Users } from './UserCollection';
import { ROLE } from '../role/Role';

export const UserDefineMethod = new ValidatedMethod({
  name: 'UserCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run(userData) {
    if (Meteor.isServer) {
      return Users.define(userData);
    }
    return null;
  },
});

export const CreateAccountMethod = new ValidatedMethod({
  name: 'Create.Account',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ email, password }) {
    if (Meteor.isServer) {
      const userID = Accounts.createUser({
        username: email,
        email: email,
        password: password,
      });
      Roles.createRole(ROLE.USER, { unlessExists: true });
      Roles.addUsersToRoles(userID, ROLE.USER);
      return userID;
    }
    return null;
  },
});
