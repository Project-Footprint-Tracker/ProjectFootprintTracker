import React, { useState } from 'react';
import { Container, Form, Grid, Header, Loader, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Trips } from '../../api/trip/TripCollection';
import { Groups } from '../../api/group/GroupCollection';
import { GroupMembers } from '../../api/group/GroupMemberCollection';

const GroupCompare = ({ groups, groupMembers, trips, ready }) => {
  const [metric, setMetric] = useState(false);

  const groupData = {};
  // eslint-disable-next-line no-return-assign
  groups.forEach((group) => groupData[group.name] = {});
  // eslint-disable-next-line no-return-assign
  groupMembers.forEach((member) => groupData[member.group][member.member] = []);
  console.log(groupData);

  return (ready ? (<Header>Group Copmpare</Header>) : <Loader active>Getting Group Data</Loader>);
};

GroupCompare.propTypes = {
  ready: PropTypes.bool.isRequired,
  groups: PropTypes.array.isRequired,
  groupMembers: PropTypes.array.isRequired,
  trips: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const groupReady = Groups.subscribe().ready();
  const groups = Groups.find({}, { sort: { name: 1 } }).fetch();
  const membersReady = GroupMembers.subscribe().ready();
  const groupMembers = GroupMembers.find().fetch();
  const tripsReady = Trips.subscribeTripCommunity().ready();
  const trips = Trips.find({}).fetch();
  const ready = groupReady && membersReady && tripsReady;
  // console.log(groupReady, membersReady, tripsReady, ready);
  return {
    ready,
    groups,
    groupMembers,
    trips,
  };
})(GroupCompare);
