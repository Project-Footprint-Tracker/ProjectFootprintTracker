import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Grid, Header, Loader, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Trips } from '../../api/trip/TripCollection';
import { Groups } from '../../api/group/GroupCollection';
import { GroupMembers } from '../../api/group/GroupMemberCollection';
import {
  counties,
  getCountyTrips, getModeChartCounts, getGroupTrips, getCEReducedPerDay, getCEProducedPerDay, getFuelSavedPerDay,
} from '../utilities/group-analysis';
import { Users } from '../../api/user/UserCollection';
import ModesChart from '../components/charts/ModesChart';
import CEDataChart from '../components/charts/CEDataChart';

const GroupCompare = ({ groups, groupMembers, trips, ready, username, myGroups, myGroupModes, myModes, hawaiiModes, honoluluModes }) => {
  // const [metric, setMetric] = useState(false);

  const groupData = {};
  // eslint-disable-next-line no-return-assign
  groups.forEach((group) => groupData[group.name] = {});
  // eslint-disable-next-line no-return-assign
  groupMembers.forEach((member) => groupData[member.group][member.member] = []);
  const myGroup = myGroups[0];
  const myTrips = trips.filter(t => t.owner === username);
  const myCeSaved = getCEReducedPerDay(myTrips);
  const myCeProduced = getCEProducedPerDay(myTrips);
  const myFuelSaved = getFuelSavedPerDay(myTrips);
  const myGroupTrips = getGroupTrips(myGroup);
  const myGroupCeSaved = getCEReducedPerDay(myGroupTrips);
  const myGroupCeProduced = getCEProducedPerDay(myGroupTrips);
  const myGroupFuelSaved = getFuelSavedPerDay(myGroupTrips);
  // const honTrips = getCountyTrips(counties.Honolulu);
  // const hawTrips = getCountyTrips(counties.Hawaii);
  // console.log(myTotal, groupCeTotals, honTotal, hawTotal);
  // console.log(myAve, groupCeAve, honAve, hawAve);
  const myChartStyle = { height: 400, title: 'My Modes of Transport' };
  const groupChartStyle = { height: 400, title: `${myGroup} Modes of Transport` };
  const honChartStyle = { height: 400, title: `${counties.Honolulu} Modes of Transport` };
  const hawChartStyle = { height: 400, title: `${counties.Hawaii} Modes of Transport` };
  return (ready ? (<Segment><Header dividing>Group Compare</Header>
    <Grid>
      <Grid.Row columns={2}>
        <Grid.Column>
          <ModesChart modesData={myModes} chartStyle={myChartStyle} />
        </Grid.Column>
        <Grid.Column>
          <ModesChart modesData={myGroupModes} chartStyle={groupChartStyle} />
        </Grid.Column>
        <Grid.Column>
          <ModesChart modesData={honoluluModes} chartStyle={honChartStyle} />
        </Grid.Column>
        <Grid.Column>
          <ModesChart modesData={hawaiiModes} chartStyle={hawChartStyle} />
        </Grid.Column>
        <Grid.Column>
          <CEDataChart
            ceSaved={myCeSaved}
            ceProduced={myCeProduced}
            fuelSaved={myFuelSaved}
            chartStyle={{ height: 400, title: 'My' }}
          />
        </Grid.Column>
        <Grid.Column>
          <CEDataChart
            ceSaved={myGroupCeSaved}
            ceProduced={myGroupCeProduced}
            fuelSaved={myGroupFuelSaved}
            chartStyle={{ height: 400, title: `${myGroup}` }}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>) : <Loader active>Getting Group Data</Loader>);
};

GroupCompare.propTypes = {
  ready: PropTypes.bool.isRequired,
  groups: PropTypes.array.isRequired,
  groupMembers: PropTypes.array.isRequired,
  trips: PropTypes.array.isRequired,
  username: PropTypes.string,
  myGroups: PropTypes.array,
  myModes: PropTypes.object,
  myGroupModes: PropTypes.object,
  honoluluModes: PropTypes.object,
  hawaiiModes: PropTypes.object,
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
  const myModes = getModeChartCounts(Trips.find({ owner: username }).fetch());
  const groupTrips = getGroupTrips(myGroups[0]);
  const myGroupModes = getModeChartCounts(groupTrips);
  const honoluluTrips = getCountyTrips(counties.Honolulu);
  const hawaiiTrips = getCountyTrips(counties.Hawaii);
  const honoluluModes = getModeChartCounts(honoluluTrips);
  const hawaiiModes = getModeChartCounts(hawaiiTrips);
  // console.log(username, myGroups, groupMembers);
  // console.log(Trips.getGroupModesOfTransport(myGroups[0]));
  // console.log(myModes, myGroupModes, hawaiiModes, honoluluModes);
  return {
    ready,
    groups,
    groupMembers,
    trips,
    username,
    myGroups,
    myModes,
    myGroupModes,
    honoluluModes,
    hawaiiModes,
  };
})(GroupCompare);
