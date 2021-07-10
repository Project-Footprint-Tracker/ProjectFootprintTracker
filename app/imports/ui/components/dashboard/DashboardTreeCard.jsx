import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Statistic, Image } from 'semantic-ui-react';
import DashboardStatisticsCard from './DashboardStatisticsCard';

function DashboardTreeCard(
  {
    treesPerCeReduced,
    treesPerCeProduced,
    userProfile,
  },
) {

  return (
    <DashboardStatisticsCard
      cardHeader='Tree per CE'
      topContent={
        <Grid>
          <Grid.Column className='tree-icon' width={6} verticalAlign='middle'>
            <Image src='/images/TreeIconGood.png'/>
          </Grid.Column>
          <Grid.Column width={10} textAlign='center' style={{ paddingLeft: '0.4rem' }}>
            <Statistic >
              <Statistic.Value className='dashboard-statistic'>
                {treesPerCeReduced}
              </Statistic.Value>
              <Statistic.Label className='dashboard-statistic'>tree equivalence to ce reduced</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid>
      }
      popupTop='One tree absorbs 48 pounds of CE each year. Based on the amount of CE you reduced, this number represents your contribution in reducing CE in terms of trees.'
      bottomContent={
        <Grid>
          <Grid.Column className='tree-icon' width={6} verticalAlign='middle'>
            <Image src='/images/TreeIconBad.png'/>
          </Grid.Column>
          <Grid.Column width={10} textAlign='center' style={{ paddingLeft: '0.4rem' }}>
            <Statistic >
              <Statistic.Value className='dashboard-statistic'>
                {treesPerCeProduced}
              </Statistic.Value>
              <Statistic.Label className='dashboard-statistic'>tree equivalence to ce produced</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid>

      }
      popupBottom='One tree absorbs 48 pounds of CE each year. Based on the amount of CE you produced, you would need to plant this many trees in order to offset the produced CE.'
      userProfile={userProfile}
    />
  );
}

DashboardTreeCard.propTypes = {
  treesPerCeReduced: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  treesPerCeProduced: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  userProfile: PropTypes.object,
};

export default DashboardTreeCard;
