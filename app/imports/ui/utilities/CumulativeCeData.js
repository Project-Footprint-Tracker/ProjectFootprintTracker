/**
 * CumulativeCeData.js is a global document that contains utility functions that computes for the cumulative CE Data
 * or climate-related metrics needed for data charts and dashboards implemented in this application.
 *
 * author(s):   Daphne Marie Tapia, Sophia Elize Cruz, Timothy Huo, Chak Hon Lam
 */
import { altSelectFieldOptions } from './GlobalVariables';
import { getDailyCE } from './DailyCeData';

const filterDailyData = (dailyData) => {
  const filtered = {};
  filtered.reducedFiltered = dailyData.filter(({ modeType }) => modeType !== 'Gas');
  filtered.producedFiltered = dailyData.filter(({ modeType }) => modeType === 'Gas');

  return (filtered);
};

const getCeData = (dailyData, userVehicles) => {
  const filtered = filterDailyData(dailyData);
  const computeCO2 = (array) => array.map(data => Math.abs(getDailyCE(data.milesTraveled, data.modeOfTransportation, userVehicles).cO2Reduced))
    .reduce((a, b) => a + b, 0);
  const computeFuel = (array) => array.map(data => Math.abs(getDailyCE(data.milesTraveled, data.modeOfTransportation, userVehicles).fuelSaved))
    .reduce((a, b) => a + b, 0);
  const computeVMT = (array) => array.map(data => data.milesTraveled)
    .reduce((a, b) => a + b, 0);
  return ({
    reducedCO2: computeCO2(filtered.reducedFiltered),
    producedCO2: computeCO2(filtered.producedFiltered),
    VMTReduced: computeVMT(filtered.reducedFiltered),
    VMTProduced: computeVMT(filtered.producedFiltered),
    fuelSaved: computeFuel(filtered.reducedFiltered),
    fuelSpent: computeFuel(filtered.producedFiltered),
  });
};

/**
 * Returns an object with attributes equal to climate-related metrics related to a specific mode of the transportation
 * @param dailyData, an array of objects or documents from the DailyUserDataCollection
 * @param mode, the mode of transportation
 *        allowed values: ['Biking', 'Carpool', 'Public Transportation', 'Telework', 'Walking', 'EV/Hybrid', 'Gas']
 * @returns {Object}
 */
export const getCumulativePerMode = (dailyData, mode, userVehicles) => {
  const cePerMode = {};
  let filtered;

  // Retrieves relevant user data from collection, filtered by modeOfTransportation
  if (altSelectFieldOptions.includes(mode)) {
    filtered = dailyData.filter(({ modeOfTransportation }) => modeOfTransportation === mode);
  } else if (mode === 'EVHybrid') {
    filtered = dailyData.filter(({ modeType }) => modeType === 'EV/Hybrid');
  } else { // Implies that mode === 'Gas'
    filtered = dailyData.filter(({ modeType }) => modeType === 'Gas');
  }

  const ceData = getCeData(filtered, userVehicles);
  cePerMode.cO2Reduced = ceData.reducedCO2;
  cePerMode.cO2Produced = ceData.producedCO2;
  cePerMode.VMTReduced = ceData.VMTReduced;
  cePerMode.VMTProduced = ceData.VMTProduced;
  cePerMode.fuelSaved = ceData.fuelSaved;
  cePerMode.fuelSpent = ceData.fuelSpent;
  cePerMode.timesUsed = filtered.length;

  return cePerMode;
};

/**
 * Returns an object with attributes equal to climate-related metrics based on all user/s input data
 * @param dailyData, an array of objects or documents from the DailyUserDataCollection
 * @returns {Object}
 */
export const getCumulativeCE = (dailyData, userVehicles) => {
  const ce = {};

  const ceData = getCeData(dailyData, userVehicles);
  ce.cO2Reduced = ceData.reducedCO2;
  ce.cO2Produced = ceData.producedCO2;
  ce.VMTReduced = ceData.VMTReduced;
  ce.VMTProduced = ceData.VMTProduced;
  ce.fuelSaved = ceData.fuelSaved;
  ce.fuelSpent = ceData.fuelSpent;

  return ce;
};
