import { cePerGallonFuel } from './constants';

/**
 * Returns an object with attributes equal to climate-related metrics based on the user input data per trip.
 * @param milesTraveled by the user.
 * @param mpg of the user's vehicle.
 * @returns {Object}
 */
export const getTripCE = (milesTraveled, mpg) => {
  const eImpact = {};

  const fuelSaved = milesTraveled / mpg;
  eImpact.fuelSaved = Number((typeof fuelSaved === 'number') ?
    fuelSaved : 0).toFixed(2);
  eImpact.cO2Reduced = Number(fuelSaved * cePerGallonFuel).toFixed(2);

  return eImpact;
};
