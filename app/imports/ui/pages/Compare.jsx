import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { CarouselProvider, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Grid, Loader } from 'semantic-ui-react';
import { Users } from '../../api/user/UserCollection';
import CompareSlider from '../components/CompareSlider';
import { AllVehicles } from '../../api/vehicle/AllVehicleCollection';

function Compare(props) {

  return ((props.userReady) ?
    <div id='compare-container'>
      <CarouselProvider
        isIntrinsicHeight={true}
        totalSlides={props.evData.length}
        infinite={true}
      >
        <Grid>
          <Grid.Row>
            <CompareSlider evData={props.evData}/>
          </Grid.Row>
          <Grid.Row>
            <ButtonBack className='ui icon button'>
              <i className='arrow left icon'/>
            </ButtonBack>
            <ButtonNext className='ui icon button right floated'>
              <i className='arrow right icon'/>
            </ButtonNext>
          </Grid.Row>
        </Grid>
      </CarouselProvider>
    </div> :
    <Loader active>Loading data</Loader>);
}

Compare.propTypes = {
  username: PropTypes.string,
  evData: PropTypes.array,
  userReady: PropTypes.bool.isRequired,
  userProfile: PropTypes.object,
};

export default withTracker(({ match }) => {
  const username = match.params._id;
  const userSubscribe = Users.subscribeUser();
  const vehicleSubscribe = AllVehicles.subscribeAllVehicle();
  const evData = AllVehicles.getEvVehicles();
  const userProfile = Users.getUserProfile(username);
  return {
    userReady: userSubscribe.ready(),
    vehicleReady: vehicleSubscribe.ready(),
    evData,
    username,
    userProfile,
  };
})(Compare);
