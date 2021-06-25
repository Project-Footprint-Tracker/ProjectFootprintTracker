import React from 'react';
import { Button, Header, Modal, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { SavedTrips, savedTripPublications } from '../../../api/saved-commute/to-delete/SavedTripCollection';
import SavedTripItem from './SavedTripItem';

function DeleteSavedModal(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button id='edit-saved-trip-button'>Edit Saved Trip List</Button>}
    >
      <Modal.Header>Current Saved Trip List</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Header>Remove from list</Header>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className='daily-table-header'>Title</Table.HeaderCell>
                <Table.HeaderCell className='daily-table-header'>Mode</Table.HeaderCell>
                <Table.HeaderCell className='daily-table-header'>Distance</Table.HeaderCell>
                <Table.HeaderCell className='daily-table-header'>mpg</Table.HeaderCell>
                <Table.HeaderCell className='daily-table-header'>Net Gallons</Table.HeaderCell>
                <Table.HeaderCell className='daily-table-header'>Net CE</Table.HeaderCell>
                <Table.HeaderCell className='daily-table-header'>Unsave Trip</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {props.userSavedTrips.map((trip) => <SavedTripItem key={trip._id} trip={trip}/>)}
              <Table.Row>
                <Table.Cell className='daily-table-data'>{`${props.userSavedTrips.length > 0 ? props.userSavedTrips.length : 'No'} Trips listed`}</Table.Cell></Table.Row>
            </Table.Body>
          </Table>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="All Good!"
          labelPosition='right'
          icon='checkmark'
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

DeleteSavedModal.propTypes = {
  ready: PropTypes.bool.isRequired,
  userSavedTrips: PropTypes.array.isRequired,
  username: PropTypes.string,
};

export default withTracker(() => {
  const username = Meteor.user()?.username;
  const ready = Meteor.subscribe(savedTripPublications.savedTrip).ready() && username !== undefined;
  const userSavedTrips = SavedTrips.find({ owner: username }, {}).fetch();
  return {
    ready,
    userSavedTrips,
    username,
  };
})(DeleteSavedModal);
