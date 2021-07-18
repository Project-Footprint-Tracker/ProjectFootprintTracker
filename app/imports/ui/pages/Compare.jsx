import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Loader } from 'semantic-ui-react';
import { Users } from '../../api/user/UserCollection';
import { EvVehicles } from '../../api/vehicle/EvVehicleCollection';
import { UserVehicles } from '../../api/vehicle/UserVehicleCollection';
import CompareContent from '../components/compare/CompareContent';

function Compare({ evData, userVehicle, userReady, userVehicleReady }) {

  return ((userReady && userVehicleReady) ?
    <div id='compare-container'>
      <CompareContent evData={evData} userVehicle={userVehicle}/>
    </div> :
    <Loader active>Loading data</Loader>);
}

Compare.propTypes = {
  evData: PropTypes.array,
  userVehicle: PropTypes.array,
  userReady: PropTypes.bool.isRequired,
  userVehicleReady: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  const username = match.params._id;
  const userSubscribe = Users.subscribeUser();
  const evSubscribe = EvVehicles.subscribeEvVehicle();
  const userVehicleSubscribe = UserVehicles.subscribeUserVehicleCumulative();
  const evData = EvVehicles.getVehicles();
  const userVehicle = UserVehicles.getUserVehicles(username);
  return {
    userReady: userSubscribe.ready(),
    evReady: evSubscribe.ready(),
    userVehicleReady: userVehicleSubscribe.ready(),
    evData,
    userVehicle,
    username,
  };
})(Compare);
