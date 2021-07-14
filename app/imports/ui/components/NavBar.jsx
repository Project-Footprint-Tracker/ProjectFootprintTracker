import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';

/* The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    const menuStyle = { marginBottom: '10px' };
    const manageDropdownItems = [
      { label: 'Groups', route: '/manage/groups' },
      { label: 'Group Members', route: '/manage/group-members' },
      { label: 'Saved Commutes', route: '/manage/saved-commutes' },
      { label: 'Trips', route: '/manage/trips' },
      { label: 'Users', route: '/manage/users' },
      { label: 'User Vehicles', route: '/manage/user-vehicles' },
    ];

    return (
      <Menu style={menuStyle} attached="top" borderless inverted>
        <Menu.Item as={NavLink} activeClassName="" exact to="/">
          <Header inverted as='h1'>Project Footprint: CE Tracker</Header>
        </Menu.Item>
        {this.props.currentUser ? (
          [
            <Menu.Item as={NavLink} activeClassName='active' exact to={`/Dashboard/${this.props.currentUser}`}
              key='dashboard'>Dashboard</Menu.Item>,
            <Menu.Item as={NavLink} activeClassName="active" exact to="/profile" key='profile'>Profile</Menu.Item>,
            <Menu.Item as={NavLink} activeClassName="active" exact to="/trips" key='trips'>Trips</Menu.Item>,
            <Menu.Item as={NavLink} activeClassName='active' exact to={`/compare/${this.props.currentUser}`} key='compare'>Compare Vehicles</Menu.Item>,
            <Menu.Item as={NavLink} activeClassName="active" exact to="/group-compare" key='group-compare'>Compare</Menu.Item>,
          ]
        ) : ''}
        {Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN) ? (
          <Dropdown item text="Manage">
            <Dropdown.Menu>
              {manageDropdownItems.map(item => <Dropdown.Item key={item.label} as={NavLink} exact to={item.route}
                content={item.label} />)}
            </Dropdown.Menu>
          </Dropdown>
        ) : ''}
        <Menu.Item position="right">
          {this.props.currentUser === '' ? (
            <Dropdown id="login-dropdown" text="Login" pointing="top right" icon={'user'}>
              <Dropdown.Menu>
                <Dropdown.Item id="login-dropdown-sign-in" icon="user" text="Sign In" as={NavLink} exact to="/signin" />
                <Dropdown.Item id="login-dropdown-sign-up" icon="add user" text="Sign Up" as={NavLink} exact
                  to="/signup" />
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Dropdown id="navbar-current-user" text={this.props.currentUser} pointing="top right" icon={'user'}>
              <Dropdown.Menu>
                <Dropdown.Item id="navbar-sign-out" icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" />
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Menu.Item>
      </Menu>
    );
  }
}

// Declare the types of all properties.
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(NavBarContainer);
