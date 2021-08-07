import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, List } from 'semantic-ui-react';
import EditProfileModal from './EditProfileModal';

const ProfileCard = (props) => {
  const getUpperCase = (string) => string[0].toUpperCase() + string.slice(1);

  const groups = props.userGroupsNames.length === 0 ?
    <i>No groups added yet</i> :
    props.userGroupsNames.join(', ');

  return (
    <Card fluid style={{ height: 370 }} >
      <Card.Content textAlign='center' style={{ maxHeight: 200 }}>
        <Image
          circular
          src={props.profile.image}
          style={{ width: 120, marginBottom: 10 }}
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
  userGroupsNames: PropTypes.array.isRequired,
};

export default ProfileCard;
