import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Menu, Image } from 'semantic-ui-react';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    const menuStyle = {
      marginBottom: '0px',
      border: 'none',
      shadow: 'none',
    };

    return (
      <div>
        <Menu id='landing-nav' style={menuStyle} className='ui borderless top fixed menu'>
          <a href={'/#'}>
            <Image id='landing-logo' src="/images/EImpactLogo.png"/>
          </a>
          <Menu.Item className='nav-menu-item' href={'#/get-involved'} position="right">
              Get Involved
          </Menu.Item>
          <Menu.Item id='sign-in-button' className='nav-menu-item' href={'#/signin'}>
              Log In
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(NavBarContainer);
