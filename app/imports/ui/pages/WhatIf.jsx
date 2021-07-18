import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Trips } from '../../api/trip/TripCollection';
import { Users } from '../../api/user/UserCollection';
import ChoseScenario from '../components/what-if/ChoseScenario';
import WhatIfContent from '../components/what-if/WhatIfContent';
import { AllVehicles } from '../../api/vehicle/AllVehicleCollection';
import { tripModes } from '../../api/utilities/constants';

// This page contains the graphs that will visualize the user's data in a more meaningful way.
// The page waits for the data to load first and shows a loading page. Then once the collection is ready, we show the dashboard.
function WhatIf(
  {
    tripReady,
    userReady,
    milesSavedTotal,
    milesSavedPerDay,
    modesOfTransport,
    userMpg,
    ceProducedTotal,
    ceReducedPerDay,
    fuelSavedPerDay,
  },
) {
  const [milesSavedPerDayWI, setMSPDWI] = useState();
  const [modesOfTransportWI, setMOTDWI] = useState();
  const [ceReducedPerDayWI, setGRPDWI] = useState();
  const [fuelSavedPerDayWI, setFSPDWI] = useState();
  const trueMilesTotal = (x) => {
    let gasMiles = 0;
    _.forEach(x.mode, function (mode, index) {
      if (mode === tripModes.GAS_CAR || mode === tripModes.CARPOOL) {
        gasMiles += x.distance[index];
      }
    });
    return (milesSavedTotal - gasMiles);
  };
  const trueMilesSavedTotal = trueMilesTotal(milesSavedPerDay);
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
        modesOfTransport={modesOfTransport}
        ceProducedTotal={ceProducedTotal}
        ceReducedPerDay={ceReducedPerDay}
        fuelSavedPerDay={fuelSavedPerDay}
        test={testFP}
      />
      <WhatIfContent
        milesSavedTotal={milesSavedTotal}
        trueMilesSavedTotal={trueMilesSavedTotal}
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
  modesOfTransport: PropTypes.object,
  userMpg: PropTypes.number,
  ceProducedTotal: PropTypes.string,
  ceReducedPerDay: PropTypes.object,
  fuelSavedPerDay: PropTypes.object,
  tripReady: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  const tripSubscribe = Trips.subscribeTrip();
  const userSubscribe = Users.subscribeUser();
  const allVehicleSubscribe = AllVehicles.subscribeAllVehicle();
  const username = match.params._id;

  const milesSavedTotal = Trips.getMilesTotal(username);

  const milesSavedPerDay = Trips.getMilesSavedPerDay(username);
  const modesOfTransport = Trips.getModesOfTransport(username);
  const ceProducedTotal = Trips.getCEProducedTotal(username);
  const ceReducedPerDay = Trips.getCEReducedPerDay(username);
  const fuelSavedPerDay = Trips.getFuelSavedPerDay(username);
  const userMpg = AllVehicles.getUserMpg(username);
  return {
    tripReady: tripSubscribe.ready(),
    userReady: userSubscribe.ready(),
    allVehicleReady: allVehicleSubscribe.ready(),
    milesSavedTotal,

    milesSavedPerDay,
    modesOfTransport,
    ceProducedTotal,
    ceReducedPerDay,
    fuelSavedPerDay,
    userMpg,
  };
})(WhatIf);
