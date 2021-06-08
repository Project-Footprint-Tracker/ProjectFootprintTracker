import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Trips } from '../../api/trip/TripCollection';
import { Users2 } from '../../api/user/UserCollection2';
import DashboardContent from '../components/e-impact/DashboardContent';

/* global document */

function Dashboard(
  {
    tripReady,
    userReady,
    vehicleMilesTraveled,
    milesTotal,
    milesSavedPerDay,
    milesAddedPerDay,
    modesOfTransport,
    milesPerMode,
    userProfile,
    ghgProducedTotal,
    ghgReducedPerDay,
    fuelSavedPerDay,
    milesSavedAvg,
    milesTraveledAvg,
    fuelSavedAvg,
    fuelSpentAvg,
    ghgReducedAvg,
    ghgProducedAvg,
    evGhgProducedAvg,
  },
) {

  this.theme = !document.body.classList.contains('dark');

  return ((tripReady && userReady) ?
    <div>
      <DashboardContent
        vehicleMilesSaved={vehicleMilesTraveled.milesSaved}
        vehicleMilesAdded={vehicleMilesTraveled.milesAdded}
        milesTotal={milesTotal}
        milesSavedPerDay={milesSavedPerDay}
        milesAddedPerDay={milesAddedPerDay}
        modesOfTransport={modesOfTransport}
        milesPerMode={milesPerMode}
        userProfile={userProfile}
        userReady={userReady}
        ghgProducedTotal={ghgProducedTotal}
        ghgReducedPerDay={ghgReducedPerDay}
        fuelSavedPerDay={fuelSavedPerDay}
        milesSavedAvg={milesSavedAvg}
        milesTraveledAvg={milesTraveledAvg}
        fuelSavedAvg={fuelSavedAvg}
        fuelSpentAvg={fuelSpentAvg}
        ghgReducedAvg={ghgReducedAvg}
        ghgProducedAvg={ghgProducedAvg}
        evGhgProducedAvg={evGhgProducedAvg}
      />
    </div> :
    <Dimmer inverted={this.theme} active>
      <Loader>Loading Data</Loader>
    </Dimmer>
  );
}

Dashboard.propTypes = {
  vehicleMilesTraveled: PropTypes.object,
  milesTotal: PropTypes.number,
  milesSavedPerDay: PropTypes.object,
  milesAddedPerDay: PropTypes.object,
  modesOfTransport: PropTypes.object,
  milesPerMode: PropTypes.array,
  userProfile: PropTypes.any,
  ghgProducedTotal: PropTypes.string,
  ghgReducedPerDay: PropTypes.object,
  evGhgProducedAvg: PropTypes.object,
  fuelSavedPerDay: PropTypes.object,
  milesSavedAvg: PropTypes.object,
  milesTraveledAvg: PropTypes.object,
  fuelSavedAvg: PropTypes.object,
  fuelSpentAvg: PropTypes.object,
  ghgReducedAvg: PropTypes.object,
  ghgProducedAvg: PropTypes.object,
  tripReady: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  const tripSubscribe = Trips.subscribeTrip();
  const userSubscribe = Users2.subscribeUser();

  const username = match.params._id;

  const vehicleMilesTraveled = Trips.getVehicleMilesTraveled(username);
  const milesTotal = Trips.getMilesTotal(username);
  const milesPerDay = Trips.getMilesTraveledPerDay(username);

  const modesOfTransport = Trips.getModesOfTransport(username);
  const milesPerMode = Trips.getMilesPerMode(username);

  const userProfile = Users2.getUserProfile(username);

  const ghgProducedTotal = Trips.getGHGProducedTotal(username, (userSubscribe.ready()) ? userProfile.autoMPG : 1);
  const ghgReducedPerDay = Trips.getGHGReducedPerDay(username, (userSubscribe.ready()) ? userProfile.autoMPG : 1);

  const fuelSavedPerDay = Trips.getFuelSavedPerDay(username, (userSubscribe.ready()) ? userProfile.autoMPG : 1);

  const milesAvg = Trips.getMilesAvg(username);
  const fuelAvg = Trips.getFuelAvg(username);
  const ghgAvg = Trips.getGhgAvg(username);
  return {
    tripReady: tripSubscribe.ready(),
    userReady: userSubscribe.ready(),
    vehicleMilesTraveled,
    milesTotal,
    milesSavedPerDay: milesPerDay.milesSaved,
    milesAddedPerDay: milesPerDay.milesAdded,
    modesOfTransport,
    milesPerMode,
    userProfile,
    ghgProducedTotal,
    ghgReducedPerDay,
    fuelSavedPerDay,
    milesSavedAvg: milesAvg.milesSavedAvg,
    milesTraveledAvg: milesAvg.milesTraveledAvg,
    fuelSavedAvg: fuelAvg.fuelSavedAvg,
    fuelSpentAvg: fuelAvg.fuelSpentAvg,
    ghgReducedAvg: ghgAvg.ghgReducedAvg,
    ghgProducedAvg: ghgAvg.ghgProducedAvg,
    evGhgProducedAvg: ghgAvg.evGhgProducedAvg,
  };
})(Dashboard);
