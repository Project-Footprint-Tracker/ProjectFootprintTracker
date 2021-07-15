import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Trips } from '../../api/trip/TripCollection';
import { Users } from '../../api/user/UserCollection';
import ChoseScenario from '../components/what-if/ChoseScenario';
import WhatIfContent from '../components/what-if/WhatIfContent';

// This page contains the graphs that will visualize the user's data in a more meaningful way.
// The page waits for the data to load first and shows a loading page. Then once the collection is ready, we show the dashboard.
function WhatIf(
  {
    tripReady,
    userReady,
    milesSavedTotal,
    milesSavedPerDay,
    modesOfTransport,
    userProfile,
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
    x.mode.forEach(function (mode, index) {
      if (mode === 'Gas Car' || mode === 'Carpool') {
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
        userProfile={userProfile}
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
        userProfile={userProfile}
        userReady={userReady}
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
  userProfile: PropTypes.any,
  ceProducedTotal: PropTypes.string,
  ceReducedPerDay: PropTypes.object,
  fuelSavedPerDay: PropTypes.object,
  tripReady: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
};

export default withTracker(({ match }) => {
  const tripSubscribe = Trips.subscribeTrip();
  const userSubscribe = Users.subscribeUser();
  const username = match.params._id;

  const milesSavedTotal = Trips.getMilesTotal(username);

  const milesSavedPerDay = Trips.getMilesSavedPerDay(username);
  const modesOfTransport = Trips.getModesOfTransport(username);
  const userProfile = Users.getUserProfile(username);
  const ceProducedTotal = Trips.getCEProducedTotal(username, (userSubscribe.ready()) ? userProfile.autoMPG : 1);
  const ceReducedPerDay = Trips.getCEReducedPerDay(username, (userSubscribe.ready()) ? userProfile.autoMPG : 1);
  const fuelSavedPerDay = Trips.getFuelSavedPerDay(username, (userSubscribe.ready()) ? userProfile.autoMPG : 1);
  return {
    tripReady: tripSubscribe.ready(),
    userReady: userSubscribe.ready(),

    milesSavedTotal,

    milesSavedPerDay,
    modesOfTransport,
    userProfile,
    ceProducedTotal,
    ceReducedPerDay,
    fuelSavedPerDay,
  };
})(WhatIf);
