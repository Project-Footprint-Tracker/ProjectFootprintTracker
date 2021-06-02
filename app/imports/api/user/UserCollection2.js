import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import swal from 'sweetalert';
import BaseCollection from '../base/BaseCollection';

/* global document */

export const userPublications = {
  user: 'User',
  userAdmin: 'UserAdmin',
};

class UserCollection2 extends BaseCollection {
  constructor() {
    super('Users', new SimpleSchema({
      username: String,
      autoMPG: Number,
      homeRoundTrip: Number,
      theme: String,
    }));
  }

  /**
     * Defines a new User item
     * @param username: the username of the user.
     * @param autoMPG: the mpg of the user's vehicle.
     * @param homeRoundTrip: the round trip distance between the user's house and their work.
     * @return {String} the docID of the new document.
     */
  define({ username, autoMPG, homeRoundTrip }) {
    const theme = 'light';
    const docID = this._collection.insert({
      username,
      autoMPG,
      homeRoundTrip,
      theme,
    });
    return docID;
  }

  defineWithMessage({ username, autoMPG, homeRoundTrip }) {
    const theme = 'light';
    const docID = this._collection.insert({ username, autoMPG, homeRoundTrip, theme },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Sucess');
        }
      });
    return docID;
  }

  /**
   * Gets the data for the specified user.
   * @param username the username of the user.
   * @returns {*} An object that contains all the data of the user.
   */
  getUserProfile(username) {
    const user = this._collection.findOne({ username: username });
    return user;
  }

  // Updates the theme to either light or dark.
  updateTheme(username) {
    const user = this._collection.findOne({ username: username });
    const id = user._id;
    if (user.theme === 'light') {
      this._collection.update(id, { $set: { theme: 'dark' } });
    } else {
      this._collection.update(id, { $set: { theme: 'light' } });
    }
  }

  /**
   * Updates the given document.
   * @param username: the username of the user.
   * @param autoMPG: the mpg of the user's vehicle.
   * @param homeRoundTrip: the round trip distance between the user's house and their work.
   */
  update(docID, { username, autoMPG, homeRoundTrip }) {
    const updateData = {};
    // if (distance) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (username) {
      updateData.username = username;
    }
    if (_.isNumber(autoMPG)) {
      updateData.autoMPG = autoMPG;
    }
    if (_.isNumber(homeRoundTrip)) {
      updateData.homeRoundTrip = homeRoundTrip;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the trip associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the TripCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(userPublications.user, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ username: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(userPublications.userAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for trip owned by the current user.
   */
  subscribeUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(userPublications.user);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeUserAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(userPublications.userAdmin);
    }
    return null;
  }

  communityStyling(props) {
    const communityCard = document.getElementsByClassName('community-card');
    const communityCardHeader = document.getElementsByClassName('community-card-header');
    if (props.userProfile.theme === 'dark') {
      for (let i = 0; i < communityCard.length; i++) {
        communityCard[i].classList.add('dark-community-card');
      }
      for (let i = 0; i < communityCardHeader.length; i++) {
        communityCardHeader[i].classList.add('dark-community-card-header');
      }
    } else {
      for (let i = 0; i < communityCard.length; i++) {
        communityCard[i].classList.remove('dark-community-card');
      }
      for (let i = 0; i < communityCardHeader.length; i++) {
        communityCardHeader[i].classList.remove('dark-community-card-header');
      }
    }
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Users2 = new UserCollection2();
