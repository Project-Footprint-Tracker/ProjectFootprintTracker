import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Statistic, Image } from 'semantic-ui-react';
import DashboardStatisticsCard from './DashboardStatisticsCard';

function DashboardTreeCard(
  {
    treesPerGhgReduced,
    treesPerGhgProduced,
    userProfile,
  },
) {

  return (
    <DashboardStatisticsCard
      cardHeader='Tree per GHG'
      topContent={
        <Grid>
          <Grid.Column className='tree-icon' width={6}>
            <Image src='/images/TreeIconGood.png'/>
          </Grid.Column>
          <Grid.Column width={10} textAlign='center' style={{ paddingLeft: '0.4rem' }}>
            <Statistic >
              <Statistic.Value className='dashboard-statistic'>
                {treesPerGhgReduced}
              </Statistic.Value>
              <Statistic.Label className='dashboard-statistic'>tree equivalence to ghg reduced</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid>
      }
      popupTop='One tree absorbs 48 pounds of GHG each year. Based on the amount of GHG you reduced, this number represents your contribution in reducing GHG in terms of trees.'
      bottomContent={
        <Grid>
          <Grid.Column className='tree-icon' width={6}>
            <Image src='/images/TreeIconBad.png'/>
          </Grid.Column>
          <Grid.Column width={10} textAlign='center' style={{ paddingLeft: '0.4rem' }}>
            <Statistic >
              <Statistic.Value className='dashboard-statistic'>
                {treesPerGhgProduced}
              </Statistic.Value>
              <Statistic.Label className='dashboard-statistic'>tree equivalence to ghg produced</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid>

      }
      popupBottom='One tree absorbs 48 pounds of GHG each year. Based on the amount of GHG you produced, you would need to plant this many trees in order to offset the produced GHG.'
      userProfile={userProfile}
    />
  );
}

DashboardTreeCard.propTypes = {
  treesPerGhgReduced: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  treesPerGhgProduced: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  userProfile: PropTypes.object,
};

export default DashboardTreeCard;
