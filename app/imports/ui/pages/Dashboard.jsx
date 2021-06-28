import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Trips } from '../../api/trip/TripCollection';
import { Users } from '../../api/user/UserCollection';
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
    ceProducedTotal,
    ceReducedPerDay,
    fuelSavedPerDay,
    milesSavedAvg,
    milesTraveledAvg,
    fuelSavedAvg,
    fuelSpentAvg,
    ceReducedAvg,
    ceProducedAvg,
    evCeProducedAvg,
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
        ceProducedTotal={ceProducedTotal}
        ceReducedPerDay={ceReducedPerDay}
        fuelSavedPerDay={fuelSavedPerDay}
        milesSavedAvg={milesSavedAvg}
        milesTraveledAvg={milesTraveledAvg}
        fuelSavedAvg={fuelSavedAvg}
        fuelSpentAvg={fuelSpentAvg}
        ceReducedAvg={ceReducedAvg}
        ceProducedAvg={ceProducedAvg}
        evCeProducedAvg={evCeProducedAvg}
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
  ceProducedTotal: PropTypes.string,
  ceReducedPerDay: PropTypes.object,
  evCeProducedAvg: PropTypes.object,
  fuelSavedPerDay: PropTypes.object,
  milesSavedAvg: PropTypes.object,
  milesTraveledAvg: PropTypes.object,
  fuelSavedAvg: PropTypes.object,
  fuelSpentAvg: PropTypes.object,
  ceReducedAvg: PropTypes.object,
  ceProducedAvg: PropTypes.object,
  tripReady: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  const tripSubscribe = Trips.subscribeTrip();
  const userSubscribe = Users.subscribeUser();

  const username = match.params._id;

  const vehicleMilesTraveled = Trips.getVehicleMilesTraveled(username);
  const milesTotal = Trips.getMilesTotal(username);
  const milesPerDay = Trips.getMilesTraveledPerDay(username);

  const modesOfTransport = Trips.getModesOfTransport(username);
  const milesPerMode = Trips.getMilesPerMode(username);

  const userProfile = Users.getUserProfile(username);

  const ceProducedTotal = Trips.getCEProducedTotal(username);
  const ceReducedPerDay = Trips.getCEReducedPerDay(username);

  const fuelSavedPerDay = Trips.getFuelSavedPerDay(username);

  const milesAvg = Trips.getMilesAvg(username);
  const fuelAvg = Trips.getFuelAvg(username);
  const ceAvg = Trips.getCEAvg(username);
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
    ceProducedTotal,
    ceReducedPerDay,
    fuelSavedPerDay,
    milesSavedAvg: milesAvg.milesSavedAvg,
    milesTraveledAvg: milesAvg.milesTraveledAvg,
    fuelSavedAvg: fuelAvg.fuelSavedAvg,
    fuelSpentAvg: fuelAvg.fuelSpentAvg,
    ceReducedAvg: ceAvg.ceReducedAvg,
    ceProducedAvg: ceAvg.ceProducedAvg,
    evCeProducedAvg: ceAvg.evCeProducedAvg,
  };
})(Dashboard);
