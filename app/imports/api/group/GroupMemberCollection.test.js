import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import mocha;
import faker from 'faker';
import fc from 'fast-check';

/* eslint prefer-arrow-callback: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('GroupMemberCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(

      )
    });

  });
}
