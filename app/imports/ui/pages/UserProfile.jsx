import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Container, Grid, Header, Loader } from 'semantic-ui-react';
import { Users } from '../../api/user/UserCollection';
import { UserVehicles } from '../../api/vehicle/UserVehicleCollection';
import ProfileCard from '../components/profile/ProfileCard';
import { GroupMembers } from '../../api/group/GroupMemberCollection';

const UserProfile = ({
  profile,
  county,
  vehicles,
  userGroups,
  owner,
  ready,
}) => {
  console.log(userGroups);
  console.log(vehicles);
  console.log(owner);
  console.log(ready);
  return (ready ? (
    <Container style={{ width: 900, paddingBottom: 50 }}>
      <Grid container centered>
        <Grid.Row>
          <Grid.Column>
            <Header as='h1' textAlign='center' content='USER PROFILE'/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={7}>
            <ProfileCard
              profile={profile}
              countyName={county}
              groups={userGroups}
            />
          </Grid.Column>
          <Grid.Column width={9}>
            <Card/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  ) :
    <Loader active>Getting Trip Data</Loader>);
};

UserProfile.propTypes = {
  profile: PropTypes.object,
  county: PropTypes.string,
  vehicles: PropTypes.array.isRequired,
  userGroups: PropTypes.array,
  owner: PropTypes.string,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const owner = Meteor.user()?.username;
  const ready = Users.subscribeUser().ready()
    && UserVehicles.subscribeUserVehicle()
    && GroupMembers.subscribe().ready()
    && owner !== undefined;
  const profile = Users.getUserProfile(owner);
  const county = Users.getUserCounty(owner);
  const userGroups = GroupMembers.find({ member: owner }).fetch().map(doc => doc.group);
  const vehicles = UserVehicles.find({ owner }, { sort: [['name', 'asc']] }).fetch();
  return {
    profile,
    county,
    vehicles,
    userGroups,
    owner,
    ready,
  };
})(UserProfile);
