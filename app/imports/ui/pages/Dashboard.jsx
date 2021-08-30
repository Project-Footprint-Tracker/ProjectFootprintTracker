import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Trips } from '../../api/trip/TripCollection';
import { Users } from '../../api/user/UserCollection';
import DashboardContent from '../components/dashboard/DashboardContent';
import { UserVehicles } from '../../api/vehicle/UserVehicleCollection';

function Dashboard(
  {
    tripReady,
    userReady,
    vehicleMilesTraveled,
    milesSavedPerDay,
    milesAddedPerDay,
    modesOfTransport,
    milesPerMode,
    userProfile,
    ceSavedTotal,
    ceProducedTotal,
    ceSavedPerDay,
    fuelSpentTotal,
    fuelSavedTotal,
    fuelSavedPerDay,
    milesSavedAvg,
    milesTraveledAvg,
    fuelSavedAvg,
    fuelSpentAvg,
    ceSavedAvg,
    ceProducedAvg,
    evCeProducedAvg,
    userMpg,
  },
) {

  return ((tripReady && userReady) ?
    <div>
      <DashboardContent
        vehicleMilesSaved={vehicleMilesTraveled.milesSaved}
        vehicleMilesAdded={vehicleMilesTraveled.milesAdded}
        milesSavedPerDay={milesSavedPerDay}
        milesAddedPerDay={milesAddedPerDay}
        modesOfTransport={modesOfTransport}
        milesPerMode={milesPerMode}
        userProfile={userProfile}
        userReady={userReady}
        ceSavedTotal={ceSavedTotal}
        ceProducedTotal={ceProducedTotal}
        ceSavedPerDay={ceSavedPerDay}
        fuelSpentTotal={fuelSpentTotal}
        fuelSavedTotal={fuelSavedTotal}
        fuelSavedPerDay={fuelSavedPerDay}
        milesSavedAvg={milesSavedAvg}
        milesTraveledAvg={milesTraveledAvg}
        fuelSavedAvg={fuelSavedAvg}
        fuelSpentAvg={fuelSpentAvg}
        ceSavedAvg={ceSavedAvg}
        ceProducedAvg={ceProducedAvg}
        evCeProducedAvg={evCeProducedAvg}
        userMpg={userMpg}
      />
    </div> :
    <Dimmer active>
      <Loader>Loading Data</Loader>
    </Dimmer>
  );
}

Dashboard.propTypes = {
  vehicleMilesTraveled: PropTypes.object,
  milesSavedPerDay: PropTypes.object,
  milesAddedPerDay: PropTypes.object,
  modesOfTransport: PropTypes.object,
  milesPerMode: PropTypes.object,
  userProfile: PropTypes.any,
  ceSavedTotal: PropTypes.number,
  ceProducedTotal: PropTypes.number,
  ceSavedPerDay: PropTypes.object,
  evCeProducedAvg: PropTypes.object,
  fuelSpentTotal: PropTypes.number,
  fuelSavedTotal: PropTypes.number,
  fuelSavedPerDay: PropTypes.object,
  milesSavedAvg: PropTypes.object,
  milesTraveledAvg: PropTypes.object,
  fuelSavedAvg: PropTypes.object,
  fuelSpentAvg: PropTypes.object,
  ceSavedAvg: PropTypes.object,
  ceProducedAvg: PropTypes.object,
  userMpg: PropTypes.number,
  tripReady: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  const tripSubscribe = Trips.subscribeTrip();
  const userSubscribe = Users.subscribeUser();
  const userVehicleSubscribe = UserVehicles.subscribeUserVehicle();

  const username = match.params._id;

  const vehicleMilesTraveled = Trips.getVehicleMilesTraveled(username);

  const milesPerDay = Trips.getMilesTraveledPerDay(username);
  const modesOfTransport = Trips.getModesOfTransport(username);
  const milesPerMode = Trips.getMilesPerMode(username);

  const userProfile = Users.getUserProfile(username);

  const ceSavedTotal = Trips.getCESavedTotal(username);
  const ceProducedTotal = Trips.getCEProducedTotal(username);
  const ceSavedPerDay = Trips.getCESavedPerDay(username);

  const fuelSpentTotal = Trips.getFuelSpentTotal(username);
  const fuelSavedTotal = Trips.getFuelSavedTotal(username);

  const fuelSavedPerDay = Trips.getFuelSavedPerDay(username);

  const milesAvg = Trips.getMilesAvg(username);
  const fuelAvg = Trips.getFuelAvg(username);
  const ceAvg = Trips.getCEAvg(username);

  const userMpg = UserVehicles.getUserMpg(username);

  const tripReady = tripSubscribe.ready();
  const userReady = userSubscribe.ready();
  const userVehicleReady = userVehicleSubscribe.ready();
  return {
    tripReady,
    userReady,
    userVehicleReady,
    vehicleMilesTraveled,
    modesOfTransport,
    milesPerMode,
    userProfile,
    ceSavedTotal,
    ceProducedTotal,
    ceSavedPerDay,
    fuelSpentTotal,
    fuelSavedTotal,
    fuelSavedPerDay,
    milesSavedPerDay: milesPerDay.milesSaved,
    milesAddedPerDay: milesPerDay.milesAdded,
    milesSavedAvg: milesAvg.milesSavedAvg,
    milesTraveledAvg: milesAvg.milesTraveledAvg,
    fuelSavedAvg: fuelAvg.fuelSavedAvg,
    fuelSpentAvg: fuelAvg.fuelSpentAvg,
    ceSavedAvg: ceAvg.ceSavedAvg,
    ceProducedAvg: ceAvg.ceProducedAvg,
    evCeProducedAvg: ceAvg.evCeProducedAvg,
    userMpg,
  };
})(Dashboard);
