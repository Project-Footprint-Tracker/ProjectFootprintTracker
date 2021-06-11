import { Meteor } from 'meteor/meteor';
import { CeTracker } from '../ce-tracker/CeTracker';

export const removeAllEntities = () => {
  if (Meteor.isTest || Meteor.isAppTest) {
    CeTracker.collections.forEach((collection) => {
      if (collection.type !== 'AdminProfile') {
        collection._collection.remove({});
      }
    });
  } else {
    throw new Meteor.Error('removeAllEntities not called in testing mode.');
  }
  return true;
};
