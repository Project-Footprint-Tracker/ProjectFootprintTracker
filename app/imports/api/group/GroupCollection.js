import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import BaseCollection from '../base/BaseCollection';
import { GroupMembers } from './GroupMemberCollection';

class GroupCollection extends BaseCollection {
  constructor() {
    super('Group', new SimpleSchema({
      name: String,
      description: String,
      retired: { type: Boolean, optional: true },
    }));
  }

  /**
   * Defines a new group.
   * @param name the name of the group.
   * @param description the description of the group.
   * @param retired if the group is retired, (optional, defaults to false).
   * @return {String} the id of the new group.
   */
  define({ name, description, retired = false }) {
    const groupID = this._collection.insert({ name, description, retired });
    return groupID;
  }

  update(docID, { name, description, retired }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this._collection.update(docID, { $set: updateData });
  }

  removeIt(id) {
    // check for GroupUsers
    const doc = this.findDoc(id);
    GroupMembers.find().forEach((gm) => {
      if (doc.name === gm.group) {
        throw new Meteor.Error(`Group ${id} is referenced by a GroupMember ${gm}.`);
      }
    });
    return super.removeIt(id);
  }

  checkIntegrity() {
    return [];
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const description = doc.description;
    const retired = doc.retired;
    return {
      name,
      description,
      retired,
    };
  }
}

/**
 * Provides the singleton instance of the GroupCollection.
 * @type {GroupCollection}
 */
export const Groups = new GroupCollection();
