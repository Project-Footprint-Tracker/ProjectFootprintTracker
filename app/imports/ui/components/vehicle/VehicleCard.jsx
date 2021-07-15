import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Divider, Grid, Header, Image, List } from 'semantic-ui-react';
import { averageAutoMPG } from '../../../api/utilities/constants';

const VehicleCard = (props) => {
  const [display, setDisplay] = useState(0);

  const handleNext = () => (display === (props.userVehicles.length - 1) ?
    setDisplay(0) :
    setDisplay(display + 1));

  const handlePrev = () => (display === 0 ?
    setDisplay(props.userVehicles.length - 1) :
    setDisplay(display - 1));

  const getVehicle = props.userVehicles[display];

  return (
    <Card fluid style={{ height: 340 }}>
      <Card.Content textAlign='center'>
        <Card.Header>My Average MPG: {props.userMPG}</Card.Header>
        <Card.Meta>US Average: {averageAutoMPG}</Card.Meta>
      </Card.Content>
      <Card.Content>
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column textAlign='center' width={2}>
              <Button
                size='mini'
                color='black'
                icon='left chevron'
                onClick={() => handleNext()}
              />
            </Grid.Column>
            <Grid.Column textAlign='center' verticalAlign='middle' width={12}>
              <Header as='h3' content={getVehicle.name}/>
            </Grid.Column>
            <Grid.Column textAlign='center' width={2}>
              <Button
                size='mini'
                color='black'
                icon='right chevron'
                onClick={() => handlePrev()}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column textAlign='center' width={6}>
              <Image src={getVehicle.logo}/>
            </Grid.Column>
            <Grid.Column width={4}>
              <List>
                <List.Item>
                  <List.Header>Year</List.Header>
                  {getVehicle.year}
                </List.Item>
                <List.Item>
                  <List.Header>Make</List.Header>
                  {getVehicle.make}
                </List.Item>
                <List.Item>
                  <List.Header>Model</List.Header>
                  {getVehicle.model}
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={4}>
              <List>
                <List.Item>
                  <List.Header>MPG</List.Header>
                  {getVehicle.MPG}
                </List.Item>
                <List.Item>
                  <List.Header>Price</List.Header>
                  {getVehicle.price === 0 ?
                    <i>Not defined</i> :
                    `${getVehicle.price}`}
                </List.Item>
                <List.Item>
                  <List.Header>Yearly Fuel Spending</List.Header>
                  {getVehicle.fuelSpending === 0 ?
                    <i>Not defined</i> :
                    `${getVehicle.fuelSpending}`}
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
      <Card.Content extra>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column floated='left' width={7}>
              <Button size='tiny' content='Edit Vehicle' color='black'/>
            </Grid.Column>
            <Grid.Column textAlign='right' width={7}>
              <Button size='tiny' content='Add Vehicle' color='black'/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
};

VehicleCard.propTypes = {
  userVehicles: PropTypes.array.isRequired,
  userMPG: PropTypes.number.isRequired,
};

export default VehicleCard;
