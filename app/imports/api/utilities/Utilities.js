import { Meteor } from 'meteor/meteor';
import { _ } from 'lodash';
import moment from 'moment';
import { Trips } from '../trip/TripCollection';
import { AllVehicles } from '../vehicle/AllVehicleCollection';
import { cePerGallonFuel, tripModes, averageAutoMPG } from './constants';

export const getCountyData = (county) => {
  const nonCarArr = Trips.find({ county: county, mode: { $not: tripModes.GAS_CAR } }).fetch().map(function (element) {
    element.fuelSaved = element.distance / element.mpg;
    element.ceSaved = element.fuelSaved * cePerGallonFuel;
    return element;
  });

  const nonCarData = nonCarArr.reduce(function (m, d) {
    if (!m[d.date]) {
      m[d.date] = { ...d, count: 1 };
      return m;
    }
    m[d.date].distance += d.distance;
    m[d.date].fuelSaved += d.fuelSaved;
    m[d.date].ceSaved += d.ceSaved;
    m[d.date].count += 1;
    return m;
  }, {});

  const nonCarByDay = Object.keys(nonCarData).map(function (k) {
    const item = nonCarData[k];
    return {
      date: item.date,
      distance: item.distance,
      fuelSaved: (item.fuelSaved).toFixed(2),
      ceSaved: (item.ceSaved).toFixed(2),
    };
  });

  const carArr = Trips.find({ county: county, mode: tripModes.GAS_CAR }).fetch().map(function (element) {
    element.fuelUsed = element.distance / element.mpg;
    element.ceProduced = element.fuelUsed * cePerGallonFuel;
    return element;
  });

  const carData = carArr.reduce(function (m, d) {
    if (!m[d.date]) {
      m[d.date] = { ...d, count: 1 };
      return m;
    }
    m[d.date].distance += d.distance;
    m[d.date].fuelUsed += d.fuelUsed;
    m[d.date].ceProduced += d.ceProduced;
    m[d.date].count += 1;
    return m;
  }, {});

  const carByDay = Object.keys(carData).map(function (k) {
    const item = carData[k];
    return {
      date: item.date,
      distance: item.distance,
      fuelUsed: (item.fuelUsed).toFixed(2),
      ceProduced: (item.ceProduced).toFixed(2),
    };
  });

  const dates = _.map(nonCarByDay, 'date');
  const formattedDates = dates.map((date) => moment(date).format('YYYY-MM-DD'));
  const dates2 = _.map(carByDay, 'date');
  const formattedDates2 = dates2.map((date) => moment(date).format('YYYY-MM-DD'));
  const milesReduced = _.map(nonCarByDay, 'distance');
  const milesProduced = _.map(carByDay, 'distance');
  const fuelSavedByDay = _.map(nonCarByDay, 'fuelSaved');
  const fuelUsedByDay = _.map(carByDay, 'fuelUsed');
  const ceSavedByDay = _.map(nonCarByDay, 'ceSaved');
  const ceProducedByDay = _.map(carByDay, 'ceProduced');

  const totalUsers = Meteor.users.find({ 'profile.county': county }).count();

  const carDistances = _.map(Trips.find({ county: county, mode: 'Gas Car' }).fetch(), 'distance');
  const carMpgs = _.map(Trips.find({ county: county, mode: 'Gas Car' }).fetch(), 'mpg');
  const fuelUsed = _.zipWith(carDistances, carMpgs, (distance, mpg) => distance / mpg);
  const totalFuelUsed = _.sum(fuelUsed).toFixed(2);
  const totalCeProduced = (totalFuelUsed * cePerGallonFuel).toFixed(2);

  const otherDistances = _.map(Trips.find({ county: county, mode: { $not: 'Gas Car' } }).fetch(), 'distance');
  const totalMilesSaved = _.sum(otherDistances).toFixed(2);
  const otherMpgs = _.map(Trips.find({ county: county, mode: { $not: 'Gas Car' } }).fetch(), 'mpg');
  const fuelSaved = _.zipWith(otherDistances, otherMpgs, (distance, mpg) => distance / mpg);
  const totalFuelSaved = _.sum(fuelSaved).toFixed(2);
  const totalCeReduced = (totalFuelSaved * cePerGallonFuel).toFixed(2);

  const bikeCount = _.size(Trips.find({ county: county, mode: tripModes.BIKE }).fetch());
  const carpoolCount = _.size(Trips.find({ county: county, mode: tripModes.CARPOOL }).fetch());
  const evCount = _.size(Trips.find({ county: county, mode: tripModes.ELECTRIC_VEHICLE }).fetch());
  const carCount = _.size(Trips.find({ county: county, mode: tripModes.GAS_CAR }).fetch());
  const ptCount = _.size(Trips.find({ county: county, mode: tripModes.PUBLIC_TRANSPORTATION }).fetch());
  const teleworkCount = _.size(Trips.find({ county: county, mode: tripModes.TELEWORK }).fetch());
  const walkCount = _.size(Trips.find({ county: county, mode: tripModes.WALK }).fetch());

  const modeDistribution = [{
    type: 'pie',
    hole: 0.4,
    values: [bikeCount, carpoolCount, evCount, carCount, ptCount, teleworkCount, walkCount],
    labels: [tripModes.BIKE, tripModes.CARPOOL, tripModes.ELECTRIC_VEHICLE, tripModes.GAS_CAR, tripModes.PUBLIC_TRANSPORTATION, tripModes.TELEWORK, tripModes.WALK],
    hoverinfo: 'label+percent',
    textposition: 'inside',
  }];

  const vmtReduced =
      {
        x: formattedDates,
        y: milesReduced,
        stackgroup: 'one',
        name: 'Reduced',
      };

  const vmtProduced =
      {
        x: formattedDates2,
        y: milesProduced,
        stackgroup: 'one',
        name: 'Produced',
      };

  const vmtData = [vmtReduced, vmtProduced];

  const fuelSavings =
      {
        x: formattedDates,
        y: fuelSavedByDay,
        stackgroup: 'one',
        name: 'Saved',
      };

  const fuelUsage =
      {
        x: formattedDates2,
        y: fuelUsedByDay,
        stackgroup: 'one',
        name: 'Used',
      };

  const fuelData = [fuelSavings, fuelUsage];

  const ceSavings =
      {
        x: formattedDates,
        y: ceSavedByDay,
        stackgroup: 'one',
        name: 'Saved',
      };

  const ceProduction =
      {
        x: formattedDates2,
        y: ceProducedByDay,
        stackgroup: 'one',
        name: 'Produced',
      };

  const ceData = [ceSavings, ceProduction];

  return {
    totalUsers,
    totalMilesSaved,
    totalFuelUsed,
    totalFuelSaved,
    totalCeProduced,
    totalCeReduced,
    modeDistribution,
    vmtReduced,
    vmtProduced,
    vmtData,
    fuelSavings,
    fuelUsage,
    fuelData,
    ceSavings,
    ceProduction,
    ceData,
  };
};

export const getStateData = () => {
  const nonCarArr = Trips.find({ mode: { $not: tripModes.GAS_CAR } }).fetch().map(function (element) {
    // eslint-disable-next-line no-param-reassign
    element.fuelSaved = element.distance / element.mpg;
    // eslint-disable-next-line no-param-reassign
    element.ceSaved = element.fuelSaved * cePerGallonFuel;
    return element;
  });

  const nonCarData = nonCarArr.reduce(function (m, d) {
    if (!m[d.date]) {
      m[d.date] = { ...d, count: 1 };
      return m;
    }
    m[d.date].distance += d.distance;
    m[d.date].fuelSaved += d.fuelSaved;
    m[d.date].ceSaved += d.ceSaved;
    m[d.date].count += 1;
    return m;
  }, {});

  const nonCarByDay = Object.keys(nonCarData).map(function (k) {
    const item = nonCarData[k];
    return {
      date: item.date,
      distance: item.distance,
      fuelSaved: (item.fuelSaved).toFixed(2),
      ceSaved: (item.ceSaved).toFixed(2),
    };
  });

  const carArr = Trips.find({ mode: tripModes.GAS_CAR }).fetch().map(function (element) {
    element.fuelUsed = element.distance / element.mpg;
    element.ceProduced = element.fuelUsed * cePerGallonFuel;
    return element;
  });

  const carData = carArr.reduce(function (m, d) {
    if (!m[d.date]) {
      m[d.date] = { ...d, count: 1 };
      return m;
    }
    m[d.date].distance += d.distance;
    m[d.date].fuelUsed += d.fuelUsed;
    m[d.date].ceProduced += d.ceProduced;
    m[d.date].count += 1;
    return m;
  }, {});

  const carByDay = Object.keys(carData).map(function (k) {
    const item = carData[k];
    return {
      date: item.date,
      distance: item.distance,
      fuelUsed: (item.fuelUsed).toFixed(2),
      ceProduced: (item.ceProduced).toFixed(2),
    };
  });

  const dates = _.map(nonCarByDay, 'date');
  const formattedDates = dates.map((date) => moment(date).format('YYYY-MM-DD'));
  const dates2 = _.map(carByDay, 'date');
  const formattedDates2 = dates2.map((date) => moment(date).format('YYYY-MM-DD'));
  const milesReduced = _.map(nonCarByDay, 'distance');
  const milesProduced = _.map(carByDay, 'distance');
  const fuelSavedByDay = _.map(nonCarByDay, 'fuelSaved');
  const fuelUsedByDay = _.map(carByDay, 'fuelUsed');
  const ceSavedByDay = _.map(nonCarByDay, 'ceSaved');
  const ceProducedByDay = _.map(carByDay, 'ceProduced');

  const totalUsers = getCountyData('Hawaii').totalUsers + getCountyData('Honolulu').totalUsers +
      getCountyData('Kalawao').totalUsers + getCountyData('Kauai').totalUsers
      + getCountyData('Maui').totalUsers;

  const carDistances = _.map(Trips.find({ mode: tripModes.GAS_CAR }).fetch(), 'distance');
  const carMpgs = _.map(Trips.find({ mode: tripModes.GAS_CAR }).fetch(), 'mpg');
  const fuelUsed = _.zipWith(carDistances, carMpgs, (distance, mpg) => distance / mpg);
  const totalFuelUsed = _.sum(fuelUsed).toFixed(2);
  const totalCeProduced = (totalFuelUsed * cePerGallonFuel).toFixed(2);

  const otherDistances = _.map(Trips.find({ mode: { $not: tripModes.GAS_CAR } }).fetch(), 'distance');
  const totalMilesSaved = _.sum(otherDistances).toFixed(2);
  const otherMpgs = _.map(Trips.find({ mode: { $not: tripModes.GAS_CAR } }).fetch(), 'mpg');
  const fuelSaved = _.zipWith(otherDistances, otherMpgs, (distance, mpg) => distance / mpg);

  const totalFuelSaved = _.sum(fuelSaved).toFixed(2);
  const totalCeReduced = (totalFuelSaved * cePerGallonFuel).toFixed(2);

  const bikeCount = _.size(Trips.find({ mode: tripModes.BIKE }).fetch());
  const carpoolCount = _.size(Trips.find({ mode: tripModes.CARPOOL }).fetch());
  const evCount = _.size(Trips.find({ mode: tripModes.ELECTRIC_VEHICLE }).fetch());
  const carCount = _.size(Trips.find({ mode: tripModes.GAS_CAR }).fetch());
  const ptCount = _.size(Trips.find({ mode: tripModes.PUBLIC_TRANSPORTATION }).fetch());
  const teleworkCount = _.size(Trips.find({ mode: tripModes.TELEWORK }).fetch());
  const walkCount = _.size(Trips.find({ mode: tripModes.WALK }).fetch());

  const modeDistribution = [{
    type: 'pie',
    hole: 0.4,
    values: [bikeCount, carpoolCount, evCount, carCount, ptCount, teleworkCount, walkCount],
    labels: [tripModes.BIKE, tripModes.CARPOOL, tripModes.ELECTRIC_VEHICLE, tripModes.GAS_CAR, tripModes.PUBLIC_TRANSPORTATION, tripModes.TELEWORK, tripModes.WALK],
    hoverinfo: 'label+percent',
    textposition: 'inside',
  }];

  const vmtReduced =
      {
        x: formattedDates,
        y: milesReduced,
        stackgroup: 'one',
        name: 'Reduced',
      };

  const vmtProduced =
      {
        x: formattedDates2,
        y: milesProduced,
        stackgroup: 'one',
        name: 'Produced',
      };

  const vmtData = [vmtReduced, vmtProduced];

  const fuelSavings =
      {
        x: formattedDates,
        y: fuelSavedByDay,
        stackgroup: 'one',
        name: 'Saved',
      };

  const fuelUsage =
      {
        x: formattedDates2,
        y: fuelUsedByDay,
        stackgroup: 'one',
        name: 'Used',
      };

  const fuelData = [fuelSavings, fuelUsage];

  const ceSavings =
      {
        x: formattedDates,
        y: ceSavedByDay,
        stackgroup: 'one',
        name: 'Saved',
      };

  const ceProduction =
      {
        x: formattedDates2,
        y: ceProducedByDay,
        stackgroup: 'one',
        name: 'Produced',
      };

  const ceData = [ceSavings, ceProduction];

  const hawaiiData = getCountyData('Hawaii');
  const vmtReducedHawaii = hawaiiData.vmtReduced;
  vmtReducedHawaii.name = 'Hawaii';
  const vmtProducedHawaii = hawaiiData.vmtProduced;
  vmtProducedHawaii.name = 'Hawaii';
  const fuelSavedHawaii = hawaiiData.fuelSavings;
  fuelSavedHawaii.name = 'Hawaii';
  const fuelUsedHawaii = hawaiiData.fuelUsage;
  fuelUsedHawaii.name = 'Hawaii';
  const ceSavedHawaii = hawaiiData.ceSavings;
  ceSavedHawaii.name = 'Hawaii';
  const ceProducedHawaii = hawaiiData.ceProduction;
  ceProducedHawaii.name = 'Hawaii';

  const honoluluData = getCountyData('Honolulu');
  const vmtReducedHonolulu = honoluluData.vmtReduced;
  vmtReducedHonolulu.name = 'Honolulu';
  const vmtProducedHonolulu = honoluluData.vmtProduced;
  vmtProducedHonolulu.name = 'Honolulu';
  const fuelSavedHonolulu = honoluluData.fuelSavings;
  fuelSavedHonolulu.name = 'Honolulu';
  const fuelUsedHonolulu = honoluluData.fuelUsage;
  fuelUsedHonolulu.name = 'Honolulu';
  const ceSavedHonolulu = honoluluData.ceSavings;
  ceSavedHonolulu.name = 'Honolulu';
  const ceProducedHonolulu = honoluluData.ceProduction;
  ceProducedHonolulu.name = 'Honolulu';

  const kalawaoData = getCountyData('Kalawao');
  const vmtReducedKalawao = kalawaoData.vmtReduced;
  vmtReducedKalawao.name = 'Kalawao';
  const vmtProducedKalawao = kalawaoData.vmtProduced;
  vmtProducedKalawao.name = 'Kalawao';
  const fuelSavedKalawao = kalawaoData.fuelSavings;
  fuelSavedKalawao.name = 'Kalawao';
  const fuelUsedKalawao = kalawaoData.fuelUsage;
  fuelUsedKalawao.name = 'Kalawao';
  const ceSavedKalawao = kalawaoData.ceSavings;
  ceSavedKalawao.name = 'Kalawao';
  const ceProducedKalawao = kalawaoData.ceProduction;
  ceProducedKalawao.name = 'Kalawao';

  const kauaiData = getCountyData('Kauai');
  const vmtReducedKauai = kauaiData.vmtReduced;
  vmtReducedKauai.name = 'Kauai';
  const vmtProducedKauai = kauaiData.vmtProduced;
  vmtProducedKauai.name = 'Kauai';
  const fuelSavedKauai = kauaiData.fuelSavings;
  fuelSavedKauai.name = 'Kauai';
  const fuelUsedKauai = kauaiData.fuelUsage;
  fuelUsedKauai.name = 'Kauai';
  const ceSavedKauai = kauaiData.ceSavings;
  ceSavedKauai.name = 'Kauai';
  const ceProducedKauai = kauaiData.ceProduction;
  ceProducedKauai.name = 'Kauai';

  const mauiData = getCountyData('Maui');
  const vmtReducedMaui = mauiData.vmtReduced;
  vmtReducedMaui.name = 'Maui';
  const vmtProducedMaui = mauiData.vmtProduced;
  vmtProducedMaui.name = 'Maui';
  const fuelSavedMaui = mauiData.fuelSavings;
  fuelSavedMaui.name = 'Maui';
  const fuelUsedMaui = mauiData.fuelUsage;
  fuelUsedMaui.name = 'Maui';
  const ceSavedMaui = mauiData.ceSavings;
  ceSavedMaui.name = 'Maui';
  const ceProducedMaui = mauiData.ceProduction;
  ceProducedMaui.name = 'Maui';

  const vmtReducedCounties = [vmtReducedHawaii, vmtReducedHonolulu, vmtReducedKalawao, vmtReducedKauai, vmtReducedMaui];
  const vmtProducedCounties =
      [vmtProducedHawaii, vmtProducedHonolulu, vmtProducedKalawao, vmtProducedKauai, vmtProducedMaui];
  const fuelSavedCounties = [fuelSavedHawaii, fuelSavedHonolulu, fuelSavedKalawao, fuelSavedKauai, fuelSavedMaui];
  const fuelUsedCounties = [fuelUsedHawaii, fuelUsedHonolulu, fuelUsedKalawao, fuelUsedKauai, fuelUsedMaui];
  const ceSavedCounties = [ceSavedHawaii, ceSavedHonolulu, ceSavedKalawao, ceSavedKauai, ceSavedMaui];
  const ceProducedCounties =
      [ceProducedHawaii, ceProducedHonolulu, ceProducedKalawao, ceProducedKauai, ceProducedMaui];

  const ed = moment();
  const sd = moment().subtract(30, 'd');
  const result = Trips.find({ mode: { $not: tripModes.GAS_CAR } }).fetch().filter(d => {
    const date = new Date(d.date);
    return (sd < date && date < ed);
  });
  const totalDays = ed.diff(sd, 'days') + 1;
  const resultDistances = _.map(result, 'distance');
  const resultMpgs = _.map(result, 'mpg');
  const resultFuelSaved = _.zipWith(resultDistances, resultMpgs, (distance, mpg) => distance / mpg);
  const resultCeSaved = resultFuelSaved.map(i => i * cePerGallonFuel);
  const avgMilesReduced = (_.sum(resultDistances) / totalDays / totalUsers).toFixed(2);
  const avgFuelSaved = (_.sum(resultFuelSaved) / totalDays / totalUsers).toFixed(2);
  const avgCeSaved = (_.sum(resultCeSaved) / totalDays / totalUsers).toFixed(2);

  const myNonCarTrips = Trips.find({ owner: Meteor.user()?.username, mode: { $not: tripModes.GAS_CAR } }).fetch().filter(d => {
    const date = new Date(d.date);
    return (sd < date && date < ed);
  });
  const myNonCarDistances = _.map(myNonCarTrips, 'distance');
  const myNonCarMpgs = _.map(myNonCarTrips, 'mpg');
  const myFuelSaved = _.zipWith(myNonCarDistances, myNonCarMpgs, (distance, mpg) => distance / mpg);
  const myCeReduced = myFuelSaved.map(i => i * cePerGallonFuel);
  const myAvgMilesReduced = (_.sum(myNonCarDistances) / totalDays).toFixed(2);
  const myAvgFuelSaved = (_.sum(myFuelSaved) / totalDays).toFixed(2);
  const myAvgCeReduced = (_.sum(myCeReduced) / totalDays).toFixed(2);

  const AvgSaved = {
    x: ['VMT Reduced', 'Fuel Saved', 'CE Reduced'],
    y: [avgMilesReduced, avgFuelSaved, avgCeSaved],
    name: 'Mean',
    type: 'bar',
  };

  const userAvgSaved = {
    x: ['VMT Reduced', 'Fuel Saved', 'CE Reduced'],
    y: [myAvgMilesReduced, myAvgFuelSaved, myAvgCeReduced],
    name: 'My Average',
    type: 'bar',
  };

  const dataReduced = [AvgSaved, userAvgSaved];

  const result2 = Trips.find({ mode: 'Gas Car' }).fetch().filter(d => {
    const date = new Date(d.date);
    return (sd < date && date < ed);
  });
  const resultDistances2 = _.map(result2, 'distance');
  const resultMpgs2 = _.map(result2, 'mpg');
  const resultFuelUsed = _.zipWith(resultDistances2, resultMpgs2, (distance, mpg) => distance / mpg);
  const resultCeProduced = resultFuelUsed.map(i => i * cePerGallonFuel);
  const avgMilesProduced = (_.sum(resultDistances2) / totalDays / totalUsers).toFixed(2);
  const avgFuelUsed = (_.sum(resultFuelUsed) / totalDays / totalUsers).toFixed(2);
  const avgCeProduced = (_.sum(resultCeProduced) / totalDays / totalUsers).toFixed(2);

  const myCarTrips = Trips.find({ owner: Meteor.user()?.username, mode: tripModes.GAS_CAR }).fetch().filter(d => {
    const date = new Date(d.date);
    return (sd < date && date < ed);
  });
  const myCarDistances = _.map(myCarTrips, 'distance');
  const myCarMpgs = _.map(myCarTrips, 'mpg');
  const myFuelUsed = _.zipWith(myCarDistances, myCarMpgs, (distance, mpg) => distance / mpg);
  const myCeProduced = myFuelUsed.map(i => i * cePerGallonFuel);
  const myAvgMilesProduced = (_.sum(myCarDistances) / totalDays).toFixed(2);
  const myAvgFuelUsed = (_.sum(myFuelUsed) / totalDays).toFixed(2);
  const myAvgCeProduced = (_.sum(myCeProduced) / totalDays).toFixed(2);

  const AvgProduced = {
    x: ['VMT Produced', 'Fuel Used', 'CE Produced'],
    y: [avgMilesProduced, avgFuelUsed, avgCeProduced],
    name: 'Mean',
    type: 'bar',
  };

  const userAvgProduced = {
    x: ['VMT Produced', 'Fuel Used', 'CE Produced'],
    y: [myAvgMilesProduced, myAvgFuelUsed, myAvgCeProduced],
    name: 'My Average',
    type: 'bar',
  };

  const dataProduced = [AvgProduced, userAvgProduced];

  return {
    totalUsers, totalMilesSaved, totalFuelUsed, totalFuelSaved, totalCeProduced, totalCeReduced, modeDistribution,
    vmtReduced, vmtProduced, vmtData, fuelData, ceData, vmtReducedCounties, vmtProducedCounties, fuelSavedCounties,
    fuelUsedCounties, ceSavedCounties, ceProducedCounties, dataReduced, dataProduced,
  };
};

export const getUserMpg = (owner) => {
  const userVehicles = AllVehicles.find({ Owner: owner }).fetch();

  if (userVehicles) {
    return 1;
  }

  return averageAutoMPG;
};
