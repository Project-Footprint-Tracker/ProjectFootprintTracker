import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid, Header, Loader } from 'semantic-ui-react';
import { Users } from '../../api/user/UserCollection';
import { UserVehicles } from '../../api/vehicle/UserVehicleCollection';
import ProfileCard from '../components/profile/ProfileCard';
import { GroupMembers } from '../../api/group/GroupMemberCollection';
import VehicleCard from '../components/vehicle/VehicleCard';
import GroupCard from '../components/group/GroupCard';

const UserProfile = ({
  owner,
  profile,
  county,
  userGroups,
  userGroupsNames,
  vehicles,
  userMPG,
  ready,
}) => (ready ? (
  <Container style={{ width: 900, paddingBottom: 50 }}>
    <Grid container centered>
      <Grid.Row>
        <Grid.Column>
          <Header as='h1' textAlign='center' content='USER PROFILE'/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column width={8}>
          <ProfileCard
            profile={profile}
            countyName={county}
            userGroupsNames={userGroupsNames}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <GroupCard
            owner={owner}
            userGroupsNames = {userGroupsNames}
            userGroups={userGroups}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <VehicleCard
            owner={owner}
            userMPG={userMPG}
            userVehicles={vehicles}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
) :
  <Loader active>Getting Trip Data</Loader>);

UserProfile.propTypes = {
  owner: PropTypes.string,
  profile: PropTypes.object,
  county: PropTypes.string,
  userGroups: PropTypes.array,
  userGroupsNames: PropTypes.array,
  vehicles: PropTypes.array.isRequired,
  userMPG: PropTypes.number.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const owner = Meteor.user()?.username;
  const ready = Users.subscribeUser().ready()
    && UserVehicles.subscribeUserVehicle().ready()
    && GroupMembers.subscribe().ready()
    && owner !== undefined;
  const profile = Users.getUserProfile(owner);
  const county = Users.getUserCounty(owner);
  const vehicles = UserVehicles.getUserVehicles(owner);
  const userMPG = UserVehicles.getUserMpg(owner);
  const userGroups = GroupMembers.find({ member: owner }).fetch();
  const userGroupsNames = userGroups.map(doc => doc.group);
  return {
    owner,
    profile,
    county,
    vehicles,
    userMPG,
    userGroups,
    userGroupsNames,
    ready,
  };
})(UserProfile);
