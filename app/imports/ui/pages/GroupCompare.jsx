import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, SelectField } from 'uniforms-semantic';
import { Trips } from '../../api/trip/TripCollection';
import { Groups } from '../../api/group/GroupCollection';
import { GroupMembers } from '../../api/group/GroupMemberCollection';
import {
  counties,
  getCountyTrips,
  getModeChartCounts,
  getGroupTrips,
  getCEReducedPerDay,
  getCEProducedPerDay,
  getFuelSavedPerDay,
} from '../utilities/group-analysis';
import { Users } from '../../api/user/UserCollection';
import ModesChart from '../components/charts/ModesChart';
import CEDataChart from '../components/charts/CEDataChart';

const GroupCompare = ({ groups, ready, countyTrips, groupTrips, userTrips }) => {

  const choiceNames = ['My'];
  groups.forEach((g) => choiceNames.push(g.name));
  choiceNames.push(counties.Hawaii);
  choiceNames.push(counties.Honolulu);
  choiceNames.push(counties.Kauai);
  choiceNames.push(counties.Maui);

  const schema = new SimpleSchema({
    leftGroup: { type: String, allowedValues: choiceNames, defaultValue: choiceNames[0] },
    rightGroup: { type: String, allowedValues: choiceNames, defaultValue: counties.Honolulu },
  });
  const formSchema = new SimpleSchema2Bridge(schema);

  const [choice1, setChoice1] = useState(choiceNames[0]);
  const [choice1Trips, setChoice1Trips] = useState([]);
  const [choice2, setChoice2] = useState(counties.Honolulu);
  const [choice2Trips, setChoice2Trips] = useState([]);

  const handleChange = (name, value) => {
    // console.log('handleChange', name, value);
    if (name === 'leftGroup') {
      setChoice1(value);
      switch (value) {
      case 'My':
        setChoice1Trips(userTrips);
        break;
      case counties.Hawaii:
      case counties.Honolulu:
      case counties.Kauai:
      case counties.Maui:
        setChoice1Trips(countyTrips[value]);
        break;
      default:
        setChoice1Trips(groupTrips[value]);
      }
    } else {
      setChoice2(value);
      switch (value) {
      case 'My':
        setChoice2Trips(userTrips);
        break;
      case counties.Hawaii:
      case counties.Honolulu:
      case counties.Kauai:
      case counties.Maui:
        setChoice2Trips(countyTrips[value]);
        break;
      default:
        setChoice2Trips(groupTrips[value]);
      }
    }
  };
  const choice1Modes = getModeChartCounts(choice1Trips);
  const choice1CE = {
    ceSaved: getCEReducedPerDay(choice1Trips),
    ceProduced: getCEProducedPerDay(choice1Trips),
    fuelSaved: getFuelSavedPerDay(choice1Trips),
  };
  const choice2Modes = getModeChartCounts(choice2Trips);
  const choice2CE = {
    ceSaved: getCEReducedPerDay(choice2Trips),
    ceProduced: getCEProducedPerDay(choice2Trips),
    fuelSaved: getFuelSavedPerDay(choice2Trips),
  };
  const choice1ChartStyle = { height: 400, title: `${choice1} Modes of Transport` };
  const choice2ChartStyle = { height: 400, title: `${choice2} Modes of Transport` };
  return (ready ? (<Segment><Header dividing>Group Compare</Header>
    <Grid>
      <Grid.Row columns={1}>
        <Grid.Column><AutoForm schema={formSchema} onChange={handleChange}>
          <Form.Group>
            <SelectField name="leftGroup" />
            <SelectField name="rightGroup" />
          </Form.Group>
        </AutoForm></Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <ModesChart modesData={choice1Modes} chartStyle={choice1ChartStyle} />
        </Grid.Column>
        <Grid.Column>
          <ModesChart modesData={choice2Modes} chartStyle={choice2ChartStyle} />
        </Grid.Column>
        <Grid.Column>
          <CEDataChart
            ceSaved={choice1CE.ceSaved}
            ceProduced={choice1CE.ceProduced}
            fuelSaved={choice1CE.fuelSaved}
            chartStyle={{ height: 400, title: `${choice1}` }}
          />
        </Grid.Column>
        <Grid.Column>
          <CEDataChart
            ceSaved={choice2CE.ceSaved}
            ceProduced={choice2CE.ceProduced}
            fuelSaved={choice2CE.fuelSaved}
            chartStyle={{ height: 400, title: `${choice2}` }}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>) : <Loader active>Getting Group Data</Loader>);
};

GroupCompare.propTypes = {
  ready: PropTypes.bool.isRequired,
  groups: PropTypes.array.isRequired,
  userTrips: PropTypes.array,
  groupTrips: PropTypes.object,
  countyTrips: PropTypes.object,
};

export default withTracker(() => {
  const username = Meteor.user()?.username;
  const groupReady = Groups.subscribe().ready();
  const groups = Groups.find({}, { sort: { name: 1 } }).fetch();
  const membersReady = GroupMembers.subscribe().ready();
  const tripsReady = Trips.subscribeTripCommunity().ready();
  const usersReady = Users.subscribeUserAdmin().ready();
  const ready = groupReady && membersReady && tripsReady && usersReady;
  // console.log(groupReady, membersReady, tripsReady, ready);
  const userTrips = Trips.find({ owner: username }, {}).fetch();
  const groupTrips = {};
  groups.forEach((g) => {
    const name = g.name;
    groupTrips[name] = getGroupTrips(name);
  });
  const countyTrips = {};
  countyTrips[counties.Hawaii] = getCountyTrips(counties.Hawaii);
  countyTrips[counties.Honolulu] = getCountyTrips(counties.Honolulu);
  countyTrips[counties.Kauai] = getCountyTrips(counties.Kauai);
  countyTrips[counties.Maui] = getCountyTrips(counties.Maui);
  return {
    ready,
    groups,
    userTrips,
    groupTrips,
    countyTrips,
  };
})(GroupCompare);
