import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Divider, Image, List } from 'semantic-ui-react';

const ProfileCard = ({ profile, countyName, groups }) => {
  const getUpperCase = (string) => string[0].toUpperCase() + string.slice(1);

  const getGroups = groups.length === 0 ?
    <i>No groups added yet</i> :
    groups.join(', ');

  return (
    <Card fluid>
      <Card.Content>
        <Image
          circular
          src='/images/default/default-pfp.png'
          floated='right'
          size='tiny'
        />
        <Divider hidden/>
        <Card.Header>
          {getUpperCase(profile.firstName)} {getUpperCase(profile.lastName)}
        </Card.Header>
        <Card.Meta>{profile.email}</Card.Meta>
        <Divider hidden/>
        <List>
          <List.Item>
            <List.Icon name='point'/>
            <List.Content>{countyName}, HI {profile.zipCode}</List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='group'/>
            <List.Content>{getGroups}</List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='target'/>
            <List.Content>{profile.goal}</List.Content>
          </List.Item>
        </List>
      </Card.Content>

      <Card.Content extra>
        <Button size='tiny' content='Edit Profile'/>
      </Card.Content>
    </Card>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    goal: PropTypes.string,
    zipCode: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
  countyName: PropTypes.string.isRequired,
  groups: PropTypes.array.isRequired,
};

export default ProfileCard;
