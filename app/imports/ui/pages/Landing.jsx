import React from 'react';
import { Button, Divider, Grid, Header, Image, Loader } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Trips } from '../../api/trip/TripCollection';
import LandingWhatIf from '../components/landing/LandingWhatIf';
import { getDateToday } from '../../api/utilities/CEData';

/* A simple static component to render some text for the landing page. */
const Landing = ({ monthTrips, ready }) => {
  const padding = { paddingTop: 100 };

  return (ready ?
    <div>
      <Grid verticalAlign='middle' textAlign='center' container>
        <div style={padding} className='ghg-text'>
          <Header textAlign="center" inverted> Carbon Emission Tracker </Header>
        </div>
        <div><Header className="logo-description" textAlign="center" inverted as='h2'>Help keep our air clean by tracking
          carbon emissions that are released from your every day transportation.</Header></div>
      </Grid>
      <Grid stackable>
        <Grid.Row columns={2} stretched style={{ padding: '30px' }}>
          <Grid.Column as={NavLink} to='/quickaccess' className='landing-info-center' verticalAlign='middle'>
            <div id='landing-info1-left'>
              <Header as='h1' inverted>Want to calculate your carbon footprint?</Header>
              <hr className='landing-white-text'/>
              <Header as='h2' inverted>Use our CE estimator to calculate your carbon emissions for a single trip.
                We also include carpool calculations.</Header>
              <Header as='h5' inverted>Click here to check it out!</Header>
            </div>
          </Grid.Column>
          <Grid.Column className='inverted-text' verticalAlign='middle'>
            <Header as='h1' id='community-engagement-header' align='center'><u>Malama I Ka `Aina</u></Header>
            <Header as='h2'>Do your part to save Hawai&apos;i and track your carbon footprint
              today. Create an account to keep track of the emissions of your daily transit and
              see the changes you are making within your community!</Header>
            <br/>
            <Image as={NavLink} to='/signup' src="images/e-impact/community_info2.png" size="medium" centered/>
            <br/>
            <Button as={NavLink} exact to='/signup'>
              <Button.Content visible>Sign me up!</Button.Content>
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Divider/>
        <LandingWhatIf monthTrips={monthTrips}/>
      </Grid>
    </div> :
    <Loader active>Getting Trip Data</Loader>
  );
};

Landing.propTypes = {
  monthTrips: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const ready = Trips.subscribeTripCommunity().ready();
  const lastMonth = getDateToday().getMonth() - 1;
  const monthTrips = Trips.getTripsOnMonth(null, lastMonth);
  return {
    monthTrips,
    ready,
  };
})(Landing);
