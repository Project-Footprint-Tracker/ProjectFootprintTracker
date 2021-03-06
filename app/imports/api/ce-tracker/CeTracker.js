import { Meteor } from 'meteor/meteor';
import { Groups } from '../group/GroupCollection';
import { GroupMembers } from '../group/GroupMemberCollection';
import { Trips } from '../trip/TripCollection';
import { SavedCommutes } from '../saved-commute/SavedCommuteCollection';
import { Users } from '../user/UserCollection';
import { UserVehicles } from '../vehicle/UserVehicleCollection';
import { EvVehicles } from '../vehicle/EvVehicleCollection';

class CeTrackerClass {
  collections;

  collectionLoadSequence;

  collectionAssociation;

  constructor() {
    // list of all the CeTracker collections
    this.collections = [
      Groups,
      GroupMembers,
      SavedCommutes,
      Trips,
      Users,
      EvVehicles,
      UserVehicles,
    ];
    /**
     * A list of collection class instances in the order required for them to be sequentially loaded from a file.
     */
    this.collectionLoadSequence = [];

    /**
     * An object with keys equal to the collection name and values the associated collection instance.
     */
    this.collectionAssociation = {};
    this.collections.forEach((collection) => {
      this.collectionAssociation[collection.getCollectionName()] = collection;
    });
  }

  /**
   * Return the collection class instance given its name.
   * @param collectionName The name of the collection.
   * @returns The collection class instance.
   * @throws { Meteor.Error } If collectionName does not name a collection.
   */
  getCollection(collectionName) {
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called CeTracker.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;
  }
}

export const CeTracker = new CeTrackerClass();
