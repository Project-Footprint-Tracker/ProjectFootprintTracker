import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import UserItem from '../components/UserItem';
import { Users } from '../../api/user/UserCollection';
import SideBar from '../components/SideBar';

/* global document */

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Admin extends React.Component {
  componentDidUpdate() {
    const adminTableHeaders = document.getElementsByClassName('admin-table-headers');
    if (this.props.userReady && (document.getElementById('admin-container'))) {
      if (this.props.userProfile.theme === 'dark') {
        document.getElementById('admin-table').classList.add('dark-admin-table');
        for (let i = 0; i < adminTableHeaders.length; i++) {
          adminTableHeaders[i].classList.add('dark-admin-table-headers');
        }
      } else {
        document.getElementById('admin-table').classList.remove('dark-admin-table');
        for (let i = 0; i < adminTableHeaders.length; i++) {
          adminTableHeaders[i].classList.remove('dark-admin-table-headers');
        }
      }
    }
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
      <div id='admin-container'>
        <SideBar theme={this.props.userProfile.theme}/>
        <Container>
          <Header id='admin-header' as="h2" textAlign="center">All Users</Header>
          <Table id='admin-table' celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className='admin-table-headers'>Last Name</Table.HeaderCell>
                <Table.HeaderCell className='admin-table-headers'>First Name</Table.HeaderCell>
                <Table.HeaderCell className='admin-table-headers'>Email</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.users.map((user) => <UserItem key={user._id} user={user} />)}
            </Table.Body>
          </Table>
        </Container>
      </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Admin.propTypes = {
  users: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
  userProfile: PropTypes.object,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const subscription = Users.subscribeUserAdmin();
  const userSubscription = Users.subscribeUser();
  const userProfile = Users.getUserProfile(Meteor.user()?.username);
  return {
    users: Meteor.users.find({}).fetch(),
    ready: subscription.ready(),
    userReady: userSubscription.ready(),
    userProfile,
  };
})(Admin);
