import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Grid, Image } from 'semantic-ui-react';
import { averageAutoMPG } from '../../../api/utilities/constants';

const VehicleCard = (props) => {
  const [display, setDisplay] = useState(0);

  const handleNext = () => (display === (props.userVehicles.length - 1) ?
    setDisplay(0) :
    setDisplay(display + 1));

  const handlePrev = () => (display === 0 ?
    setDisplay(props.userVehicles.length - 1) :
    setDisplay(display - 1));

  const getVehicle = () => props.userVehicles[display];

  return (
    <Card fluid style={{ height: 320 }}>
      <Card.Content textAlign='center' style={{ marginTop: 10 }}>
        <Card.Header>My Average MPG: {props.userMPG}</Card.Header>
        <Card.Meta>US Average: {averageAutoMPG}</Card.Meta>
      </Card.Content>
      <Card.Content style={{ height: 180 }}>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column textAlign='center'>
              <Image
                circular
                src={getVehicle().logo}
                style={{ height: 100, width: 100 }}
              />
            </Grid.Column>
            <Grid.Column/>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column textAlign='center'>
              <Button
                size='tiny'
                color='black'
                icon='left chevron'
                onClick={() => handleNext()}
              />
              <Button
                size='tiny'
                color='black'
                icon='right chevron'
                onClick={() => handlePrev()}
              />
            </Grid.Column>
            <Grid.Column/>
          </Grid.Row>
        </Grid>
      </Card.Content>
      <Card.Content extra>
        <Button size='tiny' content='Add Vehicle' color='black'/>
      </Card.Content>
    </Card>
  );
};

VehicleCard.propTypes = {
  userVehicles: PropTypes.array.isRequired,
  userMPG: PropTypes.number.isRequired,
};

export default VehicleCard;
