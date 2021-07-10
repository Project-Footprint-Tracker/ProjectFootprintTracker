import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Statistic, Popup, Table, Icon } from 'semantic-ui-react';
import DashboardStatisticsCard from './DashboardStatisticsCard';
import { fuelCost, eGallon } from '../../../api/utilities/constants';

function DashboardFuelCard(
  {
    fuelSavedTotal,
    fuelCostTotal,
    fuelSavedAvgPerYear,
    fuelSavedAvgPerMonth,
    fuelSavedAvgPerDay,
    fuelSpentAvgPerYear,
    fuelSpentAvgPerMonth,
    fuelSpentAvgPerDay,
    userProfile,
  },
) {
  const fuelSavedCostPerYear = (fuelSavedAvgPerYear * fuelCost).toFixed(2);
  const fuelSavedCostPerMonth = (fuelSavedAvgPerMonth * fuelCost).toFixed(2);
  const fuelSavedCostPerDay = (fuelSavedAvgPerDay * fuelCost).toFixed(2);

  const fuelSpentCostPerYear = (fuelSpentAvgPerYear * fuelCost).toFixed(2);
  const fuelSpentCostPerMonth = (fuelSpentAvgPerMonth * fuelCost).toFixed(2);
  const fuelSpentCostPerDay = (fuelSpentAvgPerDay * fuelCost).toFixed(2);

  const efuelSpentCostPerYear = (fuelSpentAvgPerYear * eGallon).toFixed(2);
  const efuelSpentCostPerMonth = (fuelSpentAvgPerMonth * eGallon).toFixed(2);
  const efuelSpentCostPerDay = (fuelSpentAvgPerDay * eGallon).toFixed(2);

  return (
    <DashboardStatisticsCard
      cardHeader='Gallons of Fuel'
      topContent={
        <Statistic>
          <Statistic.Value className='dashboard-statistic'>{fuelSavedTotal}</Statistic.Value>
          <Statistic.Label className='dashboard-statistic'>gallons saved</Statistic.Label>
        </Statistic>
      }
      popupTop='This number represents how many gallons of fuel you saved by using other modes of transportation.'
      bottomContent={
        <Statistic>
          <Statistic.Value className='dashboard-statistic'>{fuelCostTotal}</Statistic.Value>
          <Statistic.Label className='dashboard-statistic'>gallons spent</Statistic.Label>
        </Statistic>
      }
      popupBottom='This number represents how many gallons of fuel you spent by traveling using a gas-powered car.'
      showMore
      moreHeader={
        <div>
              More Information
          <Popup
            hoverable
            trigger={<Icon className='question-icon' link name='question circle outline'/>}
          >
            <Popup.Content>
                  The Department of Energy reports that the cost of using a vehicle running on gasoline is $3.10/gallon while running the same vehicle only costs $2.65/eGallon. <br/>
                  Using this data we can calculate the money that you saved as well as the money you spent on average. <br/>
                  We can also use this data to calculate how much you would have spent if you used an electric vehicle instead when traveling the same distance <br/>
              <a href='https://www.energy.gov/maps/egallon' target='_blank' rel='noreferrer'>Source</a>
            </Popup.Content>
          </Popup>
        </div>
      }
      moreContent={
        <Grid stackable columns='equal'>
          <Grid.Row divided>
            <Grid.Column>
              <Header className='dashboard-statistic' textAlign='center'>Average Gallons Saved per Time</Header>
              <Table className='dashboard-statistic' basic='very'>
                <Table.Header fullWidth>
                  <Table.Row>
                    <Table.HeaderCell/>
                    <Table.HeaderCell className='dashboard-statistic' textAlign='right'>Gallons</Table.HeaderCell>
                    <Table.HeaderCell className='dashboard-statistic' textAlign='right'>Savings</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Yearly</Table.Cell>
                    <Table.Cell textAlign='right'>{fuelSavedAvgPerYear} gallons</Table.Cell>
                    <Table.Cell textAlign='right'>${fuelSavedCostPerYear}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Monthly</Table.Cell>
                    <Table.Cell textAlign='right'>{fuelSavedAvgPerMonth} gallons</Table.Cell>
                    <Table.Cell textAlign='right'>${fuelSavedCostPerMonth}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Daily</Table.Cell>
                    <Table.Cell textAlign='right'>{fuelSavedAvgPerDay} gallons</Table.Cell>
                    <Table.Cell textAlign='right'>${fuelSavedCostPerDay}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column>
              <Header className='dashboard-statistic' textAlign='center'>Average Gallons Spent per Time</Header>
              <Table className='dashboard-statistic' basic='very'>
                <Table.Header fullWidth>
                  <Table.Row>
                    <Table.HeaderCell/>
                    <Table.HeaderCell className='dashboard-statistic' textAlign='right'>Gallons</Table.HeaderCell>
                    <Table.HeaderCell className='dashboard-statistic' textAlign='right'>Spendings</Table.HeaderCell>
                    <Table.HeaderCell className='dashboard-statistic' textAlign='right'>E-Vehicle Spendings</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Yearly</Table.Cell>
                    <Table.Cell textAlign='right'>{fuelSpentAvgPerYear} gallons</Table.Cell>
                    <Table.Cell textAlign='right'>${fuelSpentCostPerYear}</Table.Cell>
                    <Table.Cell textAlign='right'>${efuelSpentCostPerYear}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Monthly</Table.Cell>
                    <Table.Cell textAlign='right'>{fuelSpentAvgPerMonth} gallons</Table.Cell>
                    <Table.Cell textAlign='right'>${fuelSpentCostPerMonth}</Table.Cell>
                    <Table.Cell textAlign='right'>${efuelSpentCostPerMonth}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Daily</Table.Cell>
                    <Table.Cell textAlign='right'>{fuelSpentAvgPerDay} gallons</Table.Cell>
                    <Table.Cell textAlign='right'>${fuelSpentCostPerDay}</Table.Cell>
                    <Table.Cell textAlign='right'>${efuelSpentCostPerDay}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      }
      userProfile={userProfile}
    />
  );
}

DashboardFuelCard.propTypes = {
  fuelSavedTotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fuelCostTotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fuelSavedAvgPerYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fuelSavedAvgPerMonth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fuelSavedAvgPerDay: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fuelSpentAvgPerYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fuelSpentAvgPerMonth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fuelSpentAvgPerDay: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  userProfile: PropTypes.object,
};

export default DashboardFuelCard;
