// Common conversion factor of 8,887 grams of CO2 emissions per gallon of gasoline consumed (Federal Register 2010)
import { tripModes } from '../../api/utilities/constants';

export const cePerGallon = 19.6;

// The weighted average combined fuel economy for cars and light trucks in 2017 (FHWA 2019)
// Read more: https://www.epa.gov/energy/greenhouse-gases-equivalencies-calculator-calculations-and-references
export const averageAutoMPG = 22.3;

// Kilometers to Miles Conversion Factor
export const kmToMiFactor = 0.621371;

// Miles to Kilometers Conversion Factor
export const miToKmFactor = 1.609344;

// An array of all the Alternative Transportation modes that are not EV/Hybrid vehicles
export const altTransportation = [
  {
    label: tripModes.BIKE,
    value: 'biking',
  }, {
    label: tripModes.CARPOOL,
    value: 'carpool',
  }, {
    label: tripModes.PUBLIC_TRANSPORTATION,
    value: 'publicTransportation',
  }, {
    label: tripModes.TELEWORK,
    value: 'telework',
  }, {
    label: tripModes.WALK,
    value: 'walking',
  }, {
    label: tripModes.ELECTRIC_VEHICLE,
    value: 'EVHybrid',
  }];

// An array of Alternative Transportation labels
export const altTransportationLabels = altTransportation.map(alt => alt.label);

// An array of Alternative Transportation labels without 'EV/Hybrid'
export const altSelectFieldOptions = altTransportationLabels.filter(label => label !== tripModes.ELECTRIC_VEHICLE);

export const altNoEVWalking = altSelectFieldOptions.filter(label => label !== tripModes.WALK);

export const altNoEVWalkingBiking = altNoEVWalking.filter(label => label !== tripModes.BIKE);
