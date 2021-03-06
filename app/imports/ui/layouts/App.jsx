import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import QuickAccess from '../pages/QuickAccess';
import Dashboard from '../pages/Dashboard';
import TripHistory from '../pages/TripHistory';
import Compare from '../pages/Compare';
import GroupCompare from '../pages/GroupCompare';
import ManageGroups from '../pages/manage/Groups';
import ManageGroupMembers from '../pages/manage/GroupMembers';
import { ROLE } from '../../api/role/Role';
import ManageSavedCommutes from '../pages/manage/SavedCommutes';
import ManageTrips from '../pages/manage/Trips';
import ManageUsers from '../pages/manage/Users';
import ManageUserVehicles from '../pages/manage/UserVehicles';
import WhatIf from '../pages/WhatIf';
import UserProfile from '../pages/UserProfile';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar/>
          <Switch>
            <Route exact path="/" component={Landing}/>
            <Route exact path="/quickaccess" component={QuickAccess} />
            <Route path="/signin" component={Signin}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/signout" component={Signout}/>
            <ProtectedRoute path='/compare/:_id' component={Compare}/>
            <ProtectedRoute path="/Dashboard/:_id" component={Dashboard} />
            <ProtectedRoute path="/trips" component={TripHistory}/>
            <ProtectedRoute path='/whatif/:_id' component={WhatIf}/>
            <ProtectedRoute path="/profile" component={UserProfile}/>
            <ProtectedRoute path="/group-compare" component={GroupCompare} />
            <AdminProtectedRoute path="/manage/groups" component={ManageGroups} />
            <AdminProtectedRoute path="/manage/group-members" component={ManageGroupMembers} />
            <AdminProtectedRoute path="/manage/saved-commutes" component={ManageSavedCommutes} />
            <AdminProtectedRoute path="/manage/trips" component={ManageTrips} />
            <AdminProtectedRoute path="/manage/users" component={ManageUsers} />
            <AdminProtectedRoute path="/manage/user-vehicles" component={ManageUserVehicles} />
            <Route component={NotFound}/>
          </Switch>
          <Footer/>
        </div>
      </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
      return (isLogged && isAdmin) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

export default App;
