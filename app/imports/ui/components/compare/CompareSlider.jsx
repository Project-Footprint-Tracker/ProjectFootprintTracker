import PropTypes from 'prop-types';
import { Slide, Slider } from 'pure-react-carousel';
import { Card } from 'semantic-ui-react';
import React from 'react';

function CompareSlider({ vehicleData }) {

  return (
    <Slider className='compare-slider'>
      {vehicleData.map((value, index) => <Slide index={index} key={index}>
        <Card>
          <Card.Header>{value.Year} {value.Make} {value.Model}</Card.Header>
          <Card.Content>{'Mpge' in value ? `${value.Mpge} Mpge` : `${value.Mpg} Mpg`}</Card.Content>
        </Card>
      </Slide>)}
    </Slider>
  );
}

CompareSlider.propTypes = {
  vehicleData: PropTypes.array,
};

export default CompareSlider;
