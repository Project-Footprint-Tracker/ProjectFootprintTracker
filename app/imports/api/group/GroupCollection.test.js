import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { Groups } from './GroupCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('GroupCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(25, true), fc.boolean(), (name, description, retired) => {
          const docID = Groups.define({ name, description, retired });
          expect(Groups.isDefined(docID)).to.be.true;
          Groups.removeIt(docID);
          expect(Groups.isDefined(docID)).to.be.false;
        }),
      );
    });
    it('Cannot define duplicates', function test2() {
      const name = faker.lorem.words();
      const description = faker.lorem.sentences();
      const docID1 = Groups.define({ name, description });
      const docID2 = Groups.define({ name, description });
      expect(docID1).to.equal(docID2);
    });
    it('Can update', function test3() {
      let doc = Groups.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(25, true), fc.boolean(), (name, description, retired) => {
          Groups.update(docID, { name, description, retired });
          doc = Groups.findDoc(docID);
          expect(doc.name).to.equal(name);
          expect(doc.description).to.equal(description);
          expect(doc.retired).to.equal(retired);
        }),
      );
    });
    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const doc = Groups.findOne({});
      let docID = doc._id;
      const dumpObject = Groups.dumpOne(docID);
      Groups.removeIt(docID);
      expect(Groups.isDefined(docID)).to.be.false;
      docID = Groups.restoreOne(dumpObject);
      expect(Groups.isDefined(docID)).to.be.true;
    });
  });
}
