import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Landing from '../pages/Landing';
import ListStuff from '../pages/ListStuff';
import ListStuffAdmin from '../pages/ListStuffAdmin';
import AddStuff from '../pages/AddStuff';
import EditStuff from '../pages/EditStuff';
import AddTrip from '../pages/AddTrip';
import TripHistory from '../pages/TripHistory';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import QuickAccess from '../pages/QuickAccess';
import Dashboard from '../pages/Dashboard';
import WhatIf from '../pages/WhatIf';
import Daily from '../pages/Daily';
import Community from '../pages/Community';
import PublicCommunity from '../pages/PublicCommunity';
import MapTest from '../pages/MapTest';
import Compare from '../pages/Compare';
import Admin from '../pages/Admin';
import AdminDaily from '../pages/AdminDaily';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  // const [ userLogin, setUserLogin ] = useState(false)
  render() {
    return (
        <Router>
            <Switch>
              <Route exact path="/" component={Landing}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <Route path="/map" component={MapTest}/>
              <Route path="/get-involved" component={PublicCommunity}/>
              <Route path="/quickaccess" component={QuickAccess}/>
              <ProtectedRoute path="/list" component={ListStuff}/>
              <ProtectedRoute path="/add" component={AddStuff}/>
              <ProtectedRoute path="/admin" component={Admin}/>
              <ProtectedRoute path="/trips/:owner" component={AdminDaily}/>
              <ProtectedRoute path="/edit/:_id" component={EditStuff}/>
              <AdminProtectedRoute path="/admin/:_id" component={ListStuffAdmin}/>
              <ProtectedRoute path="/dashboard/:_id" component={Dashboard}/>
              <ProtectedRoute path="/whatif/:_id" component={WhatIf}/>
              <ProtectedRoute path="/daily/:_id" component={Daily}/>
              <ProtectedRoute path="/addTrip" component={AddTrip}/>
              <ProtectedRoute path="/compare/:_id" component={Compare}/>
              <ProtectedRoute path="/history" component={TripHistory}/>
              <ProtectedRoute path="/community/:_id" component={Community}/>
              <ProtectedRoute path="/signout" component={Signout}/>
              <Route component={NotFound}/>
            </Switch>
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
          const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
          return (isLogged && isAdmin) ?
              (<Component {...props} />) :
              (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
              );
        }}
    />
);

/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.object.isRequired,
  ]),
  location: PropTypes.object,
};

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.object.isRequired,
  ]),
  location: PropTypes.object,
};

export default App;
