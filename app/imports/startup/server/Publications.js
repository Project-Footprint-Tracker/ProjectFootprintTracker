import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Stuffs } from '../../api/stuff/Stuff';
import { Trips } from '../../api/trip/TripCollection';
import { Users2 } from '../../api/user/UserCollection2';
import { SavedTrips } from '../../api/trip/SavedTripCollection';
import { AllVehicles } from '../../api/vehicle/AllVehicleCollection';
import { VehicleMakes } from '../../api/vehicle/VehicleMakeCollection';
import { Users } from '../../api/user/UserCollection';
import { UserVehicles } from '../../api/user/UserVehicleCollection';
import { UserDailyData } from '../../api/user/UserDailyDataCollection';
import { UserSavedDistances } from '../../api/user/UserSavedDistanceCollection';

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

Trips.publish();
Users2.publish();
SavedTrips.publish();

const allCollections = [
  AllVehicles,
  VehicleMakes,
  Users,
  UserVehicles,
  UserDailyData,
  UserSavedDistances,
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
