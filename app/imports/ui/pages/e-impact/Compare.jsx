import React, { useState, useEffect } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Grid, Header, Image, Card, Divider, Loader } from 'semantic-ui-react';
import { Users } from '../../../api/user/UserCollection';
import SideBar from '../../components/to-delete/e-impact/SideBar';

/* global document */

function SliderHandler() {
  const [evData, setEVData] = useState([]);

  useEffect(() => {
    Meteor.call('getEVData', function (error, result) {
      if (!error) {
        setEVData(result);
      }
    });
  }, [setEVData]);

  const [totalMiles, setTotalMiles] = useState(0);

  useEffect(() => {
    Meteor.call('getMilesTotal', function (error, result) {
      if (!error) {
        setTotalMiles(result);
      }
    });
  }, [totalMiles]);

  const testMPG = 25;
  const avgGasPrice = 3.52;
  const gasCost = (100 / testMPG) * avgGasPrice;
  const costPerkWh = 0.2874;

  return (
    <Slider className='compare-slider'>
      {evData.map((value, index) => <Slide index={index} key={index}>
        <Grid centered columns={2} divided>
          <Grid.Column width={6}>
            <Image className='compare-logo' src={value.brandLogo}/>
            <Image className='compare-car-image' src={value.image} href={value.website}
              target='_blank'/>
            <Header id='compare-car' textAlign='center'>{value.car}</Header>
          </Grid.Column>
          <Grid.Column id='compare-slider-information-side' width={10}>
            <Grid.Row textAlign='left'>Starting From: ${value.cashPrice}</Grid.Row>
            <Grid.Row textAlign='left'>Range: {value.range} mi</Grid.Row>
            <Grid.Row textAlign='left'>Battery Capacity: {value.batteryCapacity} kWh</Grid.Row>
            <Grid.Row>
              <Header className='cost-per-header' textAlign='center'>Cost Per 100 mi</Header>
              <Card.Group centered itemsPerRow={2}>
                <Card className='compare-cost-per-inner-card' fluid>
                  <Card.Content textAlign='center'>
                        Electric Vehicle
                    <Divider/>
                        ${((100 / (value.range / value.batteryCapacity)) * costPerkWh).toFixed(2)}
                  </Card.Content>
                </Card>
                <Card className='compare-cost-per-inner-card' fluid>
                  <Card.Content textAlign='center'>
                        Gas
                    <Divider />
                        ${gasCost.toFixed(2)}
                  </Card.Content>
                </Card>
              </Card.Group>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Slide>)}
    </Slider>
  );
}

function Compare(props) {
  const [evData, setEVData] = useState([]);

  useEffect(() => {
    Meteor.call('getEVData', function (error, result) {
      if (!error) {
        setEVData(result);
      }
    });
  }, [setEVData]);

  if (props.userReady) {
    if (props.userProfile.theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  return (!props.userReady) ? <Loader active>Loading data</Loader> :
    (<div>
      <div id='compare-container'>
        <SideBar
          userReady={props.userReady}
          userProfile={props.userProfile}
          theme={props.userProfile.theme}
        />
        <CarouselProvider
          isIntrinsicHeight={true}
          totalSlides={evData.length}
          infinite={true}
        >
          <Grid>
            <Grid.Row>
              <SliderHandler/>
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
      </div>
    </div>);
}

Compare.propTypes = {
  username: PropTypes.string,
  userReady: PropTypes.bool.isRequired,
  userProfile: PropTypes.object,
};

export default withTracker(({ match }) => {
  const username = match.params._id;
  const userSubscribe = Users.subscribeUser();
  const userProfile = Users.getUserProfile(username);
  return {
    userReady: userSubscribe.ready(),
    username,
    userProfile,
  };
})(Compare);
