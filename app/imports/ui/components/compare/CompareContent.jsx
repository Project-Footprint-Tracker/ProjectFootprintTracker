import React from 'react';
import PropTypes from 'prop-types';
import { CarouselProvider, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { Grid } from 'semantic-ui-react';
import CompareSlider from './CompareSlider';

function CompareContent({ userVehicle, evData }) {

  return ((userVehicle.length > 0) ?
    <div>
      <Grid columns='equal'>
        <Grid.Column>
          <CarouselProvider
            isIntrinsicHeight={true}
            totalSlides={userVehicle.length}
            infinite={true}
          >
            <Grid.Row>
              <CompareSlider vehicleData={userVehicle}/>
            </Grid.Row>
            <Grid.Row>
              <ButtonBack className='ui icon button'>
                <i className='arrow left icon'/>
              </ButtonBack>
              <ButtonNext className='ui icon button right floated'>
                <i className='arrow right icon'/>
              </ButtonNext>
            </Grid.Row>
          </CarouselProvider>
        </Grid.Column>
        <Grid.Column>
          <CarouselProvider
            isIntrinsicHeight={true}
            totalSlides={evData.length}
            infinite={true}
          >
            <Grid.Row>
              <CompareSlider vehicleData={evData}/>
            </Grid.Row>
            <Grid.Row>
              <ButtonBack className='ui icon button'>
                <i className='arrow left icon'/>
              </ButtonBack>
              <ButtonNext className='ui icon button right floated'>
                <i className='arrow right icon'/>
              </ButtonNext>
            </Grid.Row>
          </CarouselProvider>
        </Grid.Column>
      </Grid>
    </div> :
    <div>
      <CarouselProvider
        isIntrinsicHeight={true}
        totalSlides={evData.length}
        infinite={true}
      >
        <Grid centered>
          <Grid.Row>
            <CompareSlider vehicleData={evData}/>
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
    </div>);
}

CompareContent.propTypes = {
  evData: PropTypes.array,
  userVehicle: PropTypes.array,
};

export default CompareContent;
