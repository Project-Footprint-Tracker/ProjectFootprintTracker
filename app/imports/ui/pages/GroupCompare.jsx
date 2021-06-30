import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Form, Grid, Header, Loader, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Trips } from '../../api/trip/TripCollection';
import { Groups } from '../../api/group/GroupCollection';
import { GroupMembers } from '../../api/group/GroupMemberCollection';
import {
  getCeAverages,
  getCeTotals,
  getGroupCeAverages,
  getGroupCeTotals,
  getGroupModeCounts,
  counties,
  getCountyTrips,
} from '../utilities/group-analysis';
import { Users } from '../../api/user/UserCollection';

const GroupCompare = ({ groups, groupMembers, trips, ready, username, myGroups }) => {
  const [metric, setMetric] = useState(false);

  const groupData = {};
  // eslint-disable-next-line no-return-assign
  groups.forEach((group) => groupData[group.name] = {});
  // eslint-disable-next-line no-return-assign
  groupMembers.forEach((member) => groupData[member.group][member.member] = []);
  const myGroup = myGroups[0];
  const modeCounts = getGroupModeCounts(myGroup);
  const groupCeTotals = getGroupCeTotals(myGroup);
  const groupCeAve = getGroupCeAverages(myGroup);
  console.log(modeCounts, groupCeTotals, groupCeAve);
  console.log(getCountyTrips(counties.Hawaii).length);
  console.log(getCountyTrips(counties.Honolulu).length);
  const myTrips = trips.filter(t => t.owner === username);
  const myTotal = getCeTotals(myTrips);
  const myAve = getCeAverages(myTrips);
  const honTrips = getCountyTrips(counties.Honolulu);
  const honTotal = getCeTotals(honTrips);
  const honAve = getCeAverages(honTrips);
  const hawTrips = getCountyTrips(counties.Hawaii);
  const hawTotal = getCeTotals(hawTrips);
  const hawAve = getCeAverages(hawTrips);
  console.log(myTotal, groupCeTotals, honTotal, hawTotal);
  console.log(myAve, groupCeAve, honAve, hawAve);

  return (ready ? (<Header>Group Copmpare</Header>) : <Loader active>Getting Group Data</Loader>);
};

GroupCompare.propTypes = {
  ready: PropTypes.bool.isRequired,
  groups: PropTypes.array.isRequired,
  groupMembers: PropTypes.array.isRequired,
  trips: PropTypes.array.isRequired,
  username: PropTypes.string,
  myGroups: PropTypes.array,
};

export default withTracker(() => {
  const username = Meteor.user()?.username;
  const groupReady = Groups.subscribe().ready();
  const groups = Groups.find({}, { sort: { name: 1 } }).fetch();
  const membersReady = GroupMembers.subscribe().ready();
  const groupMembers = GroupMembers.find().fetch();
  const tripsReady = Trips.subscribeTripCommunity().ready();
  const trips = Trips.find({}).fetch();
  const usersReady = Users.subscribeUserAdmin().ready();
  const myGroups = GroupMembers.find({ member: username }).fetch().map(doc => doc.group);
  const ready = groupReady && membersReady && tripsReady && usersReady;
  // console.log(groupReady, membersReady, tripsReady, ready);
  return {
    ready,
    groups,
    groupMembers,
    trips,
    username,
    myGroups,
  };
})(GroupCompare);
