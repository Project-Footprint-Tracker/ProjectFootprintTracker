import _ from 'lodash';

export const tripModes = {
  TELEWORK: 'Telework',
  PUBLIC_TRANSPORTATION: 'Public Transportation',
  BIKE: 'Bike',
  WALK: 'Walk',
  CARPOOL: 'Carpool',
  ELECTRIC_VEHICLE: 'Electric Vehicle',
  GAS_CAR: 'Gas Car',
};

export const tripModesArray = _.values(tripModes);

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
