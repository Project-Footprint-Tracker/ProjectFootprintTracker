import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, List } from 'semantic-ui-react';
import EditProfileModal from './EditProfileModal';

const ProfileCard = (props) => {
  const getUpperCase = (string) => string[0].toUpperCase() + string.slice(1);

  const groups = props.groups.length === 0 ?
    <i>No groups added yet</i> :
    props.groups.join(', ');

  return (
    <Card fluid style={{ height: 320 }} >
      <Card.Content textAlign='center'>
        <Image
          circular
          src={props.profile.image}
          style={{ width: 85, marginBottom: 10 }}
        />
        <Card.Header>
          {getUpperCase(props.profile.firstName)} {getUpperCase(props.profile.lastName)}
        </Card.Header>
        <Card.Meta>{props.profile.email}</Card.Meta>
      </Card.Content>
      <Card.Content>
        <List>
          <List.Item>
            <List.Icon name='point'/>
            <List.Content>{props.countyName}, HI {props.profile.zipCode}</List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='group'/>
            <List.Content>{groups}</List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='trophy'/>
            <List.Content>{props.profile.goal}</List.Content>
          </List.Item>
        </List>
      </Card.Content>

      <Card.Content extra>
        <EditProfileModal profile={props.profile}/>
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
    image: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  countyName: PropTypes.string.isRequired,
  groups: PropTypes.array.isRequired,
};

export default ProfileCard;
