export const getPercent = (part, all) => Math.floor((part / all) * 100);

export const getTripsCopy = (allTrips) => {
  const allTripsCopy = [];
  allTrips.forEach(trip => allTripsCopy.push({
    date: trip.date,
    ceSaved: trip.ceSaved,
    ceProduced: trip.ceProduced,
  }));
  return allTripsCopy;
};

export const getCEProducedData = (trips) => {
  const date = [];
  const ceProduced = [];

  trips.forEach((trip) => {
    const tripDate = trip.date.toISOString().split('T')[0];
    if (!date.includes(tripDate)) {
      date.push(tripDate);
      ceProduced.push(Number(trip.ceProduced.toFixed(2)));
    } else {
      const oldCE = ceProduced[date.indexOf(tripDate)];
      ceProduced[date.indexOf(tripDate)] = Number((oldCE + trip.ceProduced).toFixed(2));
    }
  });

  return { date, ceProduced };
};

export const getCESavedData = (trips) => {
  const date = [];
  const ceSaved = [];

  trips.forEach((trip) => {
    const tripDate = trip.date.toISOString().split('T')[0];
    if (!date.includes(tripDate)) {
      date.push(tripDate);
      ceSaved.push(Number(trip.ceSaved.toFixed(2)));
    } else {
      const oldCE = ceSaved[date.indexOf(tripDate)];
      ceSaved[date.indexOf(tripDate)] = Number((oldCE + trip.ceSaved).toFixed(2));
    }
  });

  return ceSaved;
};

export const getStatistics = (allTrips) => {

  const allTripsNum = allTrips.length;

  const ceProducedTrips = allTrips.filter(trip => trip.ceProduced > 0);
  const ceProducedCount = ceProducedTrips.length;
  const ceProducedPercent = getPercent(ceProducedCount, allTripsNum) || 100;
  const ceProducedTotal = Number(getCEProducedData(ceProducedTrips).ceProduced
    .reduce((a, b) => a + b, 0)
    .toFixed(2));

  const ceSavedNumbers = getCESavedData(allTrips);
  const ceSavedTotal = Number(ceSavedNumbers.reduce((a, b) => a + b, 0)
    .toFixed(2));

  return ({
    ceProducedCount,
    ceProducedPercent,
    ceProducedTotal,
    ceSavedNumbers,
    ceSavedTotal,
  });
};

export const getPotentialTrips = (allTrips, difference) => {
  const monthTripsCopy = getTripsCopy(allTrips);
  let iter = 0;
  let iter2 = 0;
  if (difference > 0) {
    while (iter < difference) {
      const ceProduced = monthTripsCopy[iter2].ceProduced;
      if (ceProduced > 0) {
        monthTripsCopy[iter2].ceSaved += ceProduced;
        monthTripsCopy[iter2].ceProduced = 0;
        iter++;
      }
      iter2++;
    }
  } else if (difference < 0) {
    while (iter < Math.abs(difference)) {
      const ceSaved = monthTripsCopy[iter2].ceSaved;
      if (ceSaved > 0) {
        monthTripsCopy[iter2].ceProduced += ceSaved;
        monthTripsCopy[iter2].ceSaved = 0;
        iter++;
      }
      iter2++;
    }
  }

  return getCEProducedData(monthTripsCopy);

};
