import React from 'react';
import { Grid, Header, Button, Image } from 'semantic-ui-react';
import { withRouter, NavLink } from 'react-router-dom';

class Info1 extends React.Component {
  render() {
    return (
      <Grid celled stackable>
        <Grid.Row columns={2} style={{ padding: '30px' }}>
          <Grid.Column as={NavLink} to='/quickaccess' className='landing-info-center' verticalAlign='middle'>
            <div id='landing-info1-left'>
              <Header as='h1' inverted>Want to calculate your carbon footprint?</Header>
              <hr className='landing-white-text'/>
              <Header as='h2' inverted>Use our GHC estimator to calculate your GHG emissions for a single trip.
                            We also include carpool calculations.</Header>
              <Header as='h6' inverted>Click here to check it out!</Header>
            </div>
          </Grid.Column>
          <Grid.Column className='landing-info-center' verticalAlign='middle'>
            <h1 id='community-engagement-header' align='center'>Join the Community!</h1>
            <h2>Create an account to keep track of the emissions of your daily transit and
                            see the changes you are making within your community!</h2>
            <br/>
            <Image as={NavLink} to='/signup' src="images/community_info2.png" size="medium" centered/>
            <br/>
            <Button as={NavLink} exact to='/signup'>
              <Button.Content visible>Sign me up!</Button.Content>
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(Info1);
