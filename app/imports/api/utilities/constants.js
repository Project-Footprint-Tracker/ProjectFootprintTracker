import _ from 'lodash';

export const tripModes = {
  TELEWORK: 'Telework',
  PUBLIC_TRANSPORTATION: 'Public Transportation',
  BIKE: 'Biking',
  WALK: 'Walking',
  CARPOOL: 'Carpool',
  ELECTRIC_VEHICLE: 'EV/Hybrid',
  GAS_CAR: 'Gas Vehicle',
};

export const tripModesArray = _.values(tripModes);

export const tripModesColors = {
  TELEWORK: '#1f77b4',
  PUBLIC_TRANSPORTATION: '#8c564b',
  BIKE: '#2ca02c',
  WALK: '#e377c2',
  CARPOOL: '#ff7f0e',
  ELECTRIC_VEHICLE: '#9467bd',
  GAS_CAR: '#d62728',
};

export const cePerGallonFuel = 19.6;
export const poundsOfCePerTree = 48;

// Values taken from https://www.energy.gov/maps/egallon using Hawaii prices
export const fuelCost = 3.10;
export const eGallon = 2.65;

// https://en.wikipedia.org/wiki/Miles_per_gallon_gasoline_equivalent#Conversion_to_MPGe
// MPGe = (33,705 Wh/gal) / (Wh/mi of an electric car)

// https://afdc.energy.gov/vehicles/electric_emissions_sources.html
// average kWh/mi of an EV is 0.32 kWh/mi = 320 Wh/mi

// average MPGe = (33,705 Wh/gal) / (320 Wh/mi) = 105.33 mi/gal
export const avgMpge = 105;

// The weighted average combined fuel economy for cars and light trucks in 2018 (FHWA 2020)
// Read more: https://www.epa.gov/energy/greenhouse-gases-equivalencies-calculator-calculations-and-references
export const averageAutoMPG = 22.5;

// Miles to Kilometers Conversion Factor
export const miToKmFactor = 1.60934;

// Kilometers to Miles Conversion Factor
export const kmToMiFactor = 0.621371;

// Pounds to Kilograms Conversion Factor
export const lbsToKgFactor = 0.453592;

// Gallons to Liters Conversion Factor
export const galToLFactor = 3.78541;

// MPG to KM/L Conversion Factor
export const mpgToKMLFactor = 0.425144;

export const imperialUnits = {
  distance: 'mi',
  mpgKML: 'MPG',
  ce: 'lbs',
};

export const metricUnits = {
  distance: 'km',
  mpgKML: 'km/L',
  ce: 'kg',
};
