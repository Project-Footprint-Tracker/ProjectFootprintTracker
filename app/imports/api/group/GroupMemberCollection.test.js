import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { GroupMembers } from './GroupMemberCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('GroupMemberCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      fc.assert(
        fc.property(fc.lorem(1), fc.emailAddress(), (group, member) => {
          const docID = GroupMembers.define({ group, member });
          expect(GroupMembers.isDefined(docID)).to.be.true;
          GroupMembers.removeIt(docID);
          expect(GroupMembers.isDefined(docID)).to.be.false;
        }),
      );
    });
    it('Can define duplicates', function test2() {
      const group = faker.lorem.word();
      const member = faker.internet.email();
      const docID1 = GroupMembers.define({ group, member });
      const docID2 = GroupMembers.define({ group, member });
      expect(docID1).to.not.equal(docID2);
    });
    it('Can update', function test3() {
      const doc = GroupMembers.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.lorem(1), fc.emailAddress(), fc.boolean(), (group, member, retired) => {
          GroupMembers.update(docID, { group, member, retired });
          const updated = GroupMembers.findDoc(docID);
          expect(updated.group).to.equal(group);
          expect(updated.member).to.equal(member);
          expect(updated.retired).to.equal(retired);
        }),
      );
    });
    it('Can dumpOne, removeIt, and restoreOne', function test5() {
      const doc = GroupMembers.findOne({});
      let docID = doc._id;
      const dumpObject = GroupMembers.dumpOne(docID);
      GroupMembers.removeIt(docID);
      expect(GroupMembers.isDefined(docID)).to.be.false;
      docID = GroupMembers.restoreOne(dumpObject);
      expect(GroupMembers.isDefined(docID)).to.be.true;
      const restored = GroupMembers.findDoc(docID);
      expect(doc.group).to.equal(restored.group);
      expect(doc.member).to.equal(restored.member);
      expect(doc.retired).to.equal(restored.retired);
    });
  });
}
