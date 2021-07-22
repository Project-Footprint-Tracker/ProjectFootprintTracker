import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Grid, Header, Image, List } from 'semantic-ui-react';
import { averageAutoMPG } from '../../../api/utilities/constants';
import AddVehicleModal from './AddVehicleModal';
import EditVehicleModal from './EditVehicleModal';
import DeleteVehicleModal from './DeleteVehicleModal';

const VehicleCard = (props) => {
  const [display, setDisplay] = useState(0);

  const handleNext = () => (display === (props.userVehicles.length - 1) ?
    setDisplay(0) :
    setDisplay(display + 1));

  const handlePrev = () => (display === 0 ?
    setDisplay(props.userVehicles.length - 1) :
    setDisplay(display - 1));

  const getVehicle = props.userVehicles[display];

  const cardContent = (props.userVehicles.length !== 0 ?
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
        <Grid.Column textAlign='center' width={12} style={{ overflowX: 'auto' }}>
          <Header as='h3' content={getVehicle.name} subheader={getVehicle.type}/>
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
          <Image src={getVehicle.logo} style={{ maxHeight: 125 }}/>
          <EditVehicleModal vehicle={getVehicle}/>
          <DeleteVehicleModal vehicle={getVehicle}/>
        </Grid.Column>
        <Grid.Column width={4} style={{ maxHeight: 125, overflow: 'auto' }}>
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
        <Grid.Column width={4} style={{ maxHeight: 125, overflow: 'auto' }}>
          <List>
            <List.Item>
              <List.Header>MPG</List.Header>
              {getVehicle.MPG}
            </List.Item>
            <List.Item>
              <List.Header>Price</List.Header>
              {getVehicle.price === 0 ?
                <i>Not defined</i> :
                `$${getVehicle.price}`}
            </List.Item>
            <List.Item>
              <List.Header>Yearly Fuel Spending</List.Header>
              {getVehicle.fuelSpending === 0 ?
                <i>Not defined</i> :
                `$${getVehicle.fuelSpending}`}
            </List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid> :
    <Grid.Row>
      <Grid.Column verticalAlign='middle' textAlign='center' style={{ overflowX: 'auto' }}>
        <Header as='h3' content={'No vehicle content to show.'} subheader={'Please add a vehicle.'}/>
      </Grid.Column>
    </Grid.Row>
  );

  return (
    <Card fluid style={{ height: 370 }}>
      <Card.Content textAlign='center'>
        <Card.Header>My Average MPG: {props.userMPG}</Card.Header>
        <Card.Meta>US Average: {averageAutoMPG}</Card.Meta>
      </Card.Content>
      <Card.Content style={{ height: 250 }}>
        {cardContent}
      </Card.Content>
      <Card.Content extra>
        <AddVehicleModal owner={props.owner}/>
      </Card.Content>
    </Card>
  );
};

VehicleCard.propTypes = {
  owner: PropTypes.string.isRequired,
  userVehicles: PropTypes.array.isRequired,
  userMPG: PropTypes.number.isRequired,
};

export default VehicleCard;
