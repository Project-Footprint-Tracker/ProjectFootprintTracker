import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Trips } from '../../api/trip/TripCollection';
import { Users } from '../../api/user/UserCollection';
import ChoseScenario from '../components/what-if/ChoseScenario';
import WhatIfContent from '../components/what-if/WhatIfContent';
import { tripModes } from '../../api/utilities/constants';
import { UserVehicles } from '../../api/vehicle/UserVehicleCollection';

// This page contains the graphs that will visualize the user's data in a more meaningful way.
// The page waits for the data to load first and shows a loading page. Then once the collection is ready, we show the dashboard.
function WhatIf(
  {
    tripReady,
    userReady,
    milesSavedTotal,
    milesSavedPerDay,
    allTrips,
    modesOfTransport,
    userMpg,
    ceProducedTotal,
    ceReducedTotal,
    ceReducedPerDay,
    fuelSavedPerDay,
  },
) {
  const [milesSavedPerDayWI, setMSPDWI] = useState();
  const [modesOfTransportWI, setMOTDWI] = useState();
  const [ceReducedPerDayWI, setGRPDWI] = useState();
  const [fuelSavedPerDayWI, setFSPDWI] = useState();

  const trueMilesTotal = (userTrips) => {

    let milesSavedTotalWI = 0;

    _.forEach(userTrips.distance, function (distance, index) {

      if (userTrips.mode[index] !== tripModes.GAS_CAR) {
        milesSavedTotalWI += distance;
      }
    });

    return milesSavedTotalWI;
  };

  useEffect(() => {
    setMSPDWI(milesSavedPerDay);
    setMOTDWI(modesOfTransport);
    setGRPDWI(ceReducedPerDay);
    setFSPDWI(fuelSavedPerDay);
  }, [fuelSavedPerDay]);
  const testFP = (miles, mode, ce, fuel) => {
    setMSPDWI(miles);
    setMOTDWI(mode);
    setGRPDWI(ce);
    setFSPDWI(fuel);
  };
  return ((tripReady && userReady) ?
    <div style={{ width: '100%' }}>
      <ChoseScenario
        milesSavedTotal={milesSavedTotal}
        milesSavedPerDay={milesSavedPerDay}
        allTrips={allTrips}
        modesOfTransport={modesOfTransport}
        ceProducedTotal={ceProducedTotal}
        ceReducedPerDay={ceReducedPerDay}
        fuelSavedPerDay={fuelSavedPerDay}
        test={testFP}
      />
      <WhatIfContent
        milesSavedTotal={milesSavedTotal}
        trueMilesSavedTotal={milesSavedTotal}
        milesSavedPerDay={milesSavedPerDay}
        modesOfTransport={modesOfTransport}
        userMpg={userMpg}
        ceProducedTotal={ceProducedTotal}
        ceReducedPerDay={ceReducedPerDay}
        fuelSavedPerDay={fuelSavedPerDay}
        milesSavedPerDayWI={milesSavedPerDayWI}
        modesOfTransportWI={modesOfTransportWI}
        ceReducedPerDayWI={ceReducedPerDayWI}
        fuelSavedPerDayWI={fuelSavedPerDayWI}
        newMilesTotal={trueMilesTotal}
      />
    </div> :
    <Dimmer active>
      <Loader>Loading Data</Loader>
    </Dimmer>
  );
}

WhatIf.propTypes = {
  milesSavedTotal: PropTypes.number,
  milesSavedPerDay: PropTypes.object,
  allTrips: PropTypes.object,
  modesOfTransport: PropTypes.object,
  userMpg: PropTypes.number,
  ceProducedTotal: PropTypes.string,
  ceReducedTotal: PropTypes.string,
  ceReducedPerDay: PropTypes.object,
  fuelSavedPerDay: PropTypes.object,
  tripReady: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  const tripSubscribe = Trips.subscribeTrip();
  const userSubscribe = Users.subscribeUser();
  const userVehicleSubscribe = UserVehicles.subscribeUserVehicle();
  const username = match.params._id;

  const milesTraveledTotal = Trips.getVehicleMilesTraveled(username);

  const milesTraveledPerDay = Trips.getMilesTraveledPerDay(username);
  const allTrips = Trips.getTrips(username);

  const modesOfTransport = Trips.getModesOfTransport(username);

  const ceProducedTotal = Trips.getCEProducedTotal(username);
  const ceReducedTotal = Trips.getCESavedTotal(username);

  const ceReducedPerDay = Trips.getCEReducedPerDay(username);
  const fuelSavedPerDay = Trips.getFuelSavedPerDay(username);
  const userMpg = UserVehicles.getUserMpg(username);
  return {
    tripReady: tripSubscribe.ready(),
    userReady: userSubscribe.ready(),
    allVehicleReady: userVehicleSubscribe.ready(),
    milesSavedTotal: milesTraveledTotal.milesSaved,
    allTrips,
    milesSavedPerDay: milesTraveledPerDay.milesSaved,
    modesOfTransport,
    ceProducedTotal,
    ceReducedTotal,
    ceReducedPerDay,
    fuelSavedPerDay,
    userMpg,
  };
})(WhatIf);
