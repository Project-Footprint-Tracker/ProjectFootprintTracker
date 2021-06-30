import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Icon, Popup, Statistic, Table } from 'semantic-ui-react';
import DashboardStatisticsCard from './DashboardStatisticsCard';

function DashboardCeCard(
  {
    ceReducedTotal,
    ceReducedAvg,
    ceProducedTotal,
    ceProducedAvg,
    evCeProducedAvg,
    userProfile,
  },
) {

  const { ceProducedAvgPerYear, ceProducedAvgPerMonth, ceProducedAvgPerDay } = ceProducedAvg;
  const { ceReducedAvgPerYear, ceReducedAvgPerMonth, ceReducedAvgPerDay } = ceReducedAvg;
  const { evCeProducedAvgPerYear, evCeProducedAvgPerMonth, evCeProducedAvgPerDay } = evCeProducedAvg;

  return (
    <DashboardStatisticsCard
      cardHeader='Carbon Emissions (CE)'
      topContent={
        <Statistic>
          <Statistic.Value className='dashboard-statistic'>{ceReducedTotal}</Statistic.Value>
          <Statistic.Label className='dashboard-statistic'>pounds reduced</Statistic.Label>
        </Statistic>
      }
      popupTop='This number represents how many pounds of CE you reduced by using other modes of transportation.'
      bottomContent={
        <Statistic>
          <Statistic.Value className='dashboard-statistic'>{ceProducedTotal}</Statistic.Value>
          <Statistic.Label className='dashboard-statistic'>pounds produced</Statistic.Label>
        </Statistic>
      }
      popupBottom='This number represents how many pounds of CE you produced by traveling using a gas-powered car.'
      showMore
      moreHeader={
        <div>
              More Information
          <Popup
            hoverable
            trigger={<Icon className='question-icon' link name='question circle outline'/>}
          >
            <Popup.Content>
                  This shows the average amount of CE that you have produced as well as reduced. <br/>
                  The Department of Energy states that the average energy consumption per mile of an Electric Vehicle is 320 Wh/mi. <br/>
                  Using this value, we calculate the MPGe and used it to find out how much CE you would have produced if you have driven an Electric Vehicle instead. <br/>
              <a href='https://afdc.energy.gov/vehicles/electric_emissions_sources.html' target='_blank' rel='noreferrer'>Source</a>
            </Popup.Content>
          </Popup>
        </div>
      }
      moreContent={
        <Grid relaxed columns='equal'>
          <Grid.Row>
            <Grid.Column>
              <Header className='dashboard-statistic' textAlign='center'>Average CE Reduced per Time</Header>
              <Table className='dashboard-statistic' basic='very'>
                <Table.Header fullWidth>
                  <Table.Row>
                    <Table.HeaderCell/>
                    <Table.HeaderCell className='dashboard-statistic' textAlign='right'>CE Reduced</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Yearly</Table.Cell>
                    <Table.Cell textAlign='right'>{ceReducedAvgPerYear} pounds</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Monthly</Table.Cell>
                    <Table.Cell textAlign='right'>{ceReducedAvgPerMonth} pounds</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Daily</Table.Cell>
                    <Table.Cell textAlign='right'>{ceReducedAvgPerDay} pounds</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column>
              <Header className='dashboard-statistic' textAlign='center'>Average CE Produced per Time</Header>
              <Table className='dashboard-statistic' basic='very'>
                <Table.Header fullWidth>
                  <Table.Row>
                    <Table.HeaderCell/>
                    <Table.HeaderCell className='dashboard-statistic' textAlign='right'>CE Produced</Table.HeaderCell>
                    <Table.HeaderCell className='dashboard-statistic' textAlign='right'>CE Produced of an EV</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Yearly</Table.Cell>
                    <Table.Cell textAlign='right'>{ceProducedAvgPerYear} pounds</Table.Cell>
                    <Table.Cell textAlign='right'>{evCeProducedAvgPerYear} pounds</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Monthly</Table.Cell>
                    <Table.Cell textAlign='right'>{ceProducedAvgPerMonth} pounds</Table.Cell>
                    <Table.Cell textAlign='right'>{evCeProducedAvgPerMonth} pounds</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Daily</Table.Cell>
                    <Table.Cell textAlign='right'>{ceProducedAvgPerDay} pounds</Table.Cell>
                    <Table.Cell textAlign='right'>{evCeProducedAvgPerDay} pounds</Table.Cell>
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

DashboardCeCard.propTypes = {
  ceReducedTotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ceReducedAvg: PropTypes.object,
  ceProducedTotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ceProducedAvg: PropTypes.object,
  evCeProducedAvg: PropTypes.object,
  userProfile: PropTypes.object,
};

export default DashboardCeCard;
