import React from 'react';
import { Grid, Header, Container } from 'semantic-ui-react';
import CumulativeDataCard from '../../../components/to-delete/ghg-tracker/cumulative-page/CumulativeDataCard';
import CumulativeDataChart from '../../../components/to-delete/ghg-tracker/cumulative-page/CumulativeDataChart';

const UsersCumulativePage = () => (
  <div className='background-all'>
    <div style={{ paddingBottom: '80px' }}>
      <Container>
        <Grid.Column>
          <div>
            <Header as='h1' textAlign='center'> Cumulative Data Of Users</Header>
            <br/>
          </div>
          <CumulativeDataChart/>
        </Grid.Column>
        <CumulativeDataCard/>
      </Container>
    </div>
  </div>
);

export default UsersCumulativePage;
