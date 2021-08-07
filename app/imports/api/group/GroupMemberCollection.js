import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

class GroupMemberCollection extends BaseCollection {

  constructor() {
    super('GroupMember', new SimpleSchema({
      group: String,
      member: String,
      retired: { type: Boolean, optional: true },
    }));
  }

  define({ group, member, retired = false }) {
    const groupMemberID = this._collection.insert({ group, member, retired });
    return groupMemberID;
  }

  update(docID, { group, member, retired }) {
    const updateData = {};
    if (group) {
      updateData.group = group;
    }
    if (member) {
      updateData.member = member;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this._collection.update(docID, { $set: updateData });
  }

  removeIt(id) {
    return super.removeIt(id);
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const group = doc.group;
    const member = doc.member;
    const retired = doc.retired;
    return {
      group,
      member,
      retired,
    };
  }
}

export const GroupMembers = new GroupMemberCollection();
