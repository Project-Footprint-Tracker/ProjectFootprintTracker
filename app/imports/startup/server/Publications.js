import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Stuffs } from '../../api/stuff/Stuff';
import { Trips } from '../../api/trip/TripCollection';
// import { SavedTrips } from '../../api/saved-commute/to-delete/SavedTripCollection';
// import { AllVehicles } from '../../api/vehicle/AllVehicleCollection';
import { Users } from '../../api/user/UserCollection';
// import { VehicleMakes } from '../../api/vehicle/VehicleMakeCollection';
// import { UserVehicles } from '../../api/vehicle/UserVehicleCollection';
// import { UserDailyData } from '../../api/trip/to-delete/UserDailyDataCollection';
// import { UserSavedDistances } from '../../api/saved-commute/to-delete/UserSavedDistanceCollection';
import { SavedCommutes } from '../../api/saved-commute/SavedCommuteCollection';
import { Groups } from '../../api/group/GroupCollection';
import { GroupMembers } from '../../api/group/GroupMemberCollection';

// User-level publication.
// If logged in, then publish documents owned by this user. Otherwise publish nothing.
Meteor.publish(Stuffs.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Stuffs.collection.find({ owner: username });
  }
  return this.ready();
});

// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise publish nothing.
Meteor.publish(Stuffs.adminPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Stuffs.collection.find();
  }
  return this.ready();
});

const allCollections = [
  Groups,
  GroupMembers,
  // AllVehicles,
  // VehicleMakes,
  Groups,
  GroupMembers,
  Users,
  // UserVehicles,
  // UserDailyData,
  // UserSavedDistances,
  Trips,
  SavedCommutes,
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
