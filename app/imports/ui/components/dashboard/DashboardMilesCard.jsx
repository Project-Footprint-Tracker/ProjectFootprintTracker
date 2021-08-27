import React from 'react';
import PropTypes from 'prop-types';
import { Statistic, Grid, Table, Header } from 'semantic-ui-react';
import DashboardStatisticsCard from './DashboardStatisticsCard';
import { tripModes } from '../../../api/utilities/constants';

function DashboardMilesCard(
  {
    milesSaved,
    milesAdded,
    milesSavedAvgPerYear,
    milesSavedAvgPerMonth,
    milesSavedAvgPerDay,
    milesTraveledAvgPerYear,
    milesTraveledAvgPerMonth,
    milesTraveledAvgPerDay,
    milesPerMode,
    userProfile,
  },
) {

  const teleworkMiles = milesPerMode[tripModes.TELEWORK];
  const publicMiles = milesPerMode[tripModes.PUBLIC_TRANSPORTATION];
  const bikeMiles = milesPerMode[tripModes.BIKE];
  const walkMiles = milesPerMode[tripModes.WALK];
  const carpoolMiles = milesPerMode[tripModes.CARPOOL];
  const electricMiles = milesPerMode[tripModes.ELECTRIC_VEHICLE];
  const gasMiles = milesPerMode[tripModes.GAS_CAR];

  return (
    <DashboardStatisticsCard
      cardHeader='Vehicle Miles Traveled'
      topContent={
        <Statistic>
          <Statistic.Value className='dashboard-statistic'>{milesSaved}</Statistic.Value>
          <Statistic.Label className='dashboard-statistic'>miles saved</Statistic.Label>
        </Statistic>
      }
      popupTop='This number represents how many miles you traveled using environmentally conscious modes of transportation.'
      bottomContent={
        <Statistic>
          <Statistic.Value className='dashboard-statistic'>{milesAdded}</Statistic.Value>
          <Statistic.Label className='dashboard-statistic'>miles traveled</Statistic.Label>
        </Statistic>
      }
      popupBottom='This number represents how many you traveled using a gas-powered car'
      showMore
      moreHeader='More information'
      moreContent={
        <Grid relaxed columns='equal'>
          <Grid.Column>
            <Grid.Row>
              <Header className='dashboard-statistic' textAlign='center'>Average Miles Saved per Time</Header>
              <Table className='dashboard-statistic' basic='very'>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Yearly</Table.Cell>
                    <Table.Cell textAlign='right'>{milesSavedAvgPerYear} miles</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Monthly</Table.Cell>
                    <Table.Cell textAlign='right'>{milesSavedAvgPerMonth} miles</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Daily</Table.Cell>
                    <Table.Cell textAlign='right'>{milesSavedAvgPerDay} miles</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Row>
            <Grid.Row>
              <Header className='dashboard-statistic' textAlign='center'>Average Miles Traveled per Time</Header>
              <Table className='dashboard-statistic' basic='very'>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Yearly</Table.Cell>
                    <Table.Cell textAlign='right'>{milesTraveledAvgPerYear} miles</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Monthly</Table.Cell>
                    <Table.Cell textAlign='right'>{milesTraveledAvgPerMonth} miles</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Daily</Table.Cell>
                    <Table.Cell textAlign='right'>{milesTraveledAvgPerDay} miles</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column>
            <Header className='dashboard-statistic' textAlign='center'>Miles per Mode of Transportation</Header>
            <Table className='dashboard-statistic' basic='very'>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Telework</Table.Cell>
                  <Table.Cell textAlign='right'>{teleworkMiles} miles</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Public Transportation</Table.Cell>
                  <Table.Cell textAlign='right'>{publicMiles} miles</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Bike</Table.Cell>
                  <Table.Cell textAlign='right'>{bikeMiles} miles</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Walk</Table.Cell>
                  <Table.Cell textAlign='right'>{walkMiles} miles</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Carpool</Table.Cell>
                  <Table.Cell textAlign='right'>{carpoolMiles} miles</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Electric Vehicle</Table.Cell>
                  <Table.Cell textAlign='right'>{electricMiles} miles</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Gas Car</Table.Cell>
                  <Table.Cell textAlign='right'>{gasMiles} miles</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
      }
      userProfile={userProfile}
    />
  );
}

DashboardMilesCard.propTypes = {
  milesSaved: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  milesAdded: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  milesSavedAvgPerYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  milesSavedAvgPerMonth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  milesSavedAvgPerDay: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  milesTraveledAvgPerYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  milesTraveledAvgPerMonth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  milesTraveledAvgPerDay: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  milesPerMode: PropTypes.object,
  userProfile: PropTypes.object,
};

export default DashboardMilesCard;
