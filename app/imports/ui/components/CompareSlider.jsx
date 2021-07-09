import PropTypes from 'prop-types';
import { Slide, Slider } from 'pure-react-carousel';
import { Card, Divider, Grid, Header, Image } from 'semantic-ui-react';
import React from 'react';

function CompareSlider(props) {

  const testMPG = 25;
  const avgGasPrice = 3.52;
  const gasCost = (100 / testMPG) * avgGasPrice;
  const costPerkWh = 0.2874;

  return (
    <Slider className='compare-slider'>
      {props.evData.map((value, index) => <Slide index={index} key={index}>
        <Grid centered columns={2} divided>
          <Grid.Column width={6}>
            <Image className='compare-logo' src={value.brandLogo}/>
            <Image className='compare-car-image' src={value.image} href={value.website} target='_blank'/>
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

CompareSlider.propTypes = {
  evData: PropTypes.array,
};

export default CompareSlider;
