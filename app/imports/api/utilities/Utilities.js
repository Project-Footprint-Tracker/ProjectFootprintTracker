// import { Meteor } from 'meteor/meteor';
// import { _ } from 'lodash';
// import moment from 'moment';
// import { Trips } from '../trip/TripCollection';
import { kmToMiFactor, lbsToKgFactor, miToKmFactor, mpgToKMLFactor } from './constants';
// import { UserVehicles } from '../vehicle/UserVehicleCollection';

export const getTotalArray = (array) => array.reduce((a, b) => a + b, 0);

export const getMetricData = (milesTraveled, mpg, ceSavedLbs, ceProducedLbs) => {
  const metricData = {};

  metricData.distance = Number((milesTraveled * miToKmFactor).toFixed(2));
  metricData.mpgKML = Number((mpg * mpgToKMLFactor).toFixed(2));
  metricData.ceSaved = Number((ceSavedLbs * lbsToKgFactor).toFixed(2));
  metricData.ceProduced = Number((ceProducedLbs * lbsToKgFactor).toFixed(2));

  return metricData;
};

export const getMilesTraveled = (distanceTraveled) => Number((distanceTraveled * kmToMiFactor).toFixed(2));

/**
 * Returns today's date, used in add/edit daily data forms
 */
export const getDateToday = () => {
  const today = new Date();
  today.setHours(11, 59, 59, 99);

  return today;
};

export const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return [year, month, day].join('-');
};
