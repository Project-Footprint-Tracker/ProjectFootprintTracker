import React from 'react';
import { Grid, Icon, Button } from 'semantic-ui-react';
import { withRouter, NavLink } from 'react-router-dom';

class Info2 extends React.Component {
  render() {
    return (
      <div id='landing-info1'>
        <Grid>
          <Grid.Column width={5} className='landing-info-center' verticalAlign='middle'>
            <a href={'#/signup'}>
              <Icon link name='car' size='massive'/>
            </a>
          </Grid.Column>
          <Grid.Column width={8}>
            <h1>Join the Community!</h1>
            <hr/>
            <h2>Create an account to keep track of the emissions of your daily transit and
                        see the changes you are making within your community!</h2>
            <Button as={NavLink} exact to='/signup'>
              <Button.Content visible>Sign me up!</Button.Content>
            </Button>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Info2);
