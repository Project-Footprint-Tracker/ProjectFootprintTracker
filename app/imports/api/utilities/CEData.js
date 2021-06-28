import { lbsToKgFactor, miToKmFactor, mpgToKMLFactor } from './constants';
import { kmToMiFactor } from '../../ui/utilities/to-delete/GlobalVariables';

export const getMetricData = (milesTraveled, mpg, ceSavedLbs, ceProducedLbs) => {
  const metricData = {};

  metricData.distance = Number((milesTraveled * miToKmFactor).toFixed(2));
  metricData.mpgKML = Number((mpg * mpgToKMLFactor).toFixed(2));
  metricData.ceSaved = Number((ceSavedLbs * lbsToKgFactor).toFixed(2));
  metricData.ceProduced = Number((ceProducedLbs * lbsToKgFactor).toFixed(2));

  return metricData;
};

export const getMilesTraveled = (distanceTraveled) => distanceTraveled * kmToMiFactor;

/**
 * Returns today's date, used in add/edit daily data forms
 */
export const getDateToday = () => {
  const today = new Date();
  today.setHours(11, 59, 59, 99);

  return today;
};
