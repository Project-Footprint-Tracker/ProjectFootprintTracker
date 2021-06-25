import { cePerGallonFuel, galToLFactor, lbsToKgFactor, miToKmFactor, mpgToKMLFactor } from './constants';

/**
 * Returns an object with attributes equal to climate-related metrics based on the user input data per trip.
 * @param milesTraveled by the user.
 * @param mpg of the user's vehicle.
 * @returns {Object}
 */
export const getTripCE = (milesTraveled, mpg) => {
  const eImpact = {};

  const fuelSaved = milesTraveled / mpg;
  eImpact.fuelSavedGal = Number(((typeof fuelSaved === 'number') ?
    fuelSaved : 0).toFixed(2));
  eImpact.cO2ReducedLbs = Number((fuelSaved * cePerGallonFuel).toFixed(2));

  return eImpact;
};

export const getMetricData = (milesTraveled, mpg, cO2ReducedLbs, fuelSavedGal) => {
  const metricData = {};

  metricData.distance = Number((milesTraveled * miToKmFactor).toFixed(2));
  metricData.mpgKML = Number((mpg * mpgToKMLFactor).toFixed(2));
  metricData.cO2Reduced = Number((cO2ReducedLbs * lbsToKgFactor).toFixed(2));
  metricData.fuelSaved = Number((fuelSavedGal * galToLFactor).toFixed(2));

  return metricData;
};
