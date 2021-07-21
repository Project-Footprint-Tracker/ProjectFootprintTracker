import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Users } from './UserCollection';

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
