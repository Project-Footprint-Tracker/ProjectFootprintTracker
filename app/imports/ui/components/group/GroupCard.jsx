import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Header, Icon, Table } from 'semantic-ui-react';

const GroupCard = ({ groups }) => {
  const getGroups = groups.length !== 0 ?
    groups.map((group) => <Table.Row key={group.key}>
      <Table.Cell>{group.group}</Table.Cell>
      <Table.Cell width={1}>
        <Icon style={{ cursor: 'pointer' }} name='edit outline'/>
        <Icon style={{ cursor: 'pointer' }} name='trash alternate outline' />
      </Table.Cell>
    </Table.Row>) :
    <Table.Row>
      <Table.Cell>
        <Header as='h3' content={'No group content to show.'} subheader={'Please add a group.'} textAlign={'center'}/>
      </Table.Cell>
    </Table.Row>;

  return (
    <Card fluid style={{ height: 370 }} >
      <Card.Content textAlign='center' style={{ maxHeight: 45 }}>
        <Card.Header>My Groups</Card.Header>
      </Card.Content>
      <Card.Content>
        <Table fixed striped basic='very'>
          <Table.Body>
            {getGroups}
          </Table.Body>
        </Table>
      </Card.Content>
      <Card.Content extra>
        <Button size='tiny' color='black'>Add Group</Button>
      </Card.Content>
    </Card>
  );
};

GroupCard.propTypes = {
  groups: PropTypes.array.isRequired,
};

export default GroupCard;
