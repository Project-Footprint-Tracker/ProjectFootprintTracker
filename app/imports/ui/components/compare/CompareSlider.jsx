import PropTypes from 'prop-types';
import { Slide, Slider } from 'pure-react-carousel';
import { Card } from 'semantic-ui-react';
import React from 'react';

function CompareSlider({ vehicleData }) {

  return (
    <Slider className='compare-slider'>
      {vehicleData.map((value, index) => <Slide index={index} key={index}>
        <Card>
          <Card.Header>{value.year} {value.make} {value.model}</Card.Header>
          <Card.Content>{'mpge' in value ? `${value.mpge} Mpge` : `${value.MPG} Mpg`}</Card.Content>
        </Card>
      </Slide>)}
    </Slider>
  );
}

CompareSlider.propTypes = {
  vehicleData: PropTypes.array,
};

export default CompareSlider;
