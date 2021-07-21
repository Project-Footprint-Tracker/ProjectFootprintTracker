import { Meteor } from 'meteor/meteor';
import { Trips } from '../../api/trip/TripCollection';
import { Users } from '../../api/user/UserCollection';
import { UserVehicles } from '../../api/vehicle/UserVehicleCollection';
import { SavedCommutes } from '../../api/saved-commute/SavedCommuteCollection';
import { Groups } from '../../api/group/GroupCollection';
import { GroupMembers } from '../../api/group/GroupMemberCollection';
import { EvVehicles } from '../../api/vehicle/EvVehicleCollection';

const allCollections = [
  EvVehicles,
  Groups,
  GroupMembers,
  Users,
  SavedCommutes,
  Trips,
  UserVehicles,
];

allCollections.forEach((collection) => collection.publish());

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
