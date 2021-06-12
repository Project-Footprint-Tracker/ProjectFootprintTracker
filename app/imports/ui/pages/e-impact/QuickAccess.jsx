import React, { useState } from 'react';
import { Grid, Form, Card, Image, Header, Popup, Button } from 'semantic-ui-react';
import '../../../../client/style.css';
import { cePerGallonFuel } from '../../../api/utilities/constants';

const QuickAccess = () => {
  const [miles, setMiles] = useState(1);
  const [mpg, setMpg] = useState(1);
  const [ce, setCe] = useState(0);
  const [transportationMethod, setTransportation] = useState('produced');
  const updateProduced = (updatedMiles, updatedMpg) => {
    setCe((updatedMiles / updatedMpg) * cePerGallonFuel);
  };
  const handleMiles = newMiles => {
    if (newMiles.target.value === '') {
      setMiles(1);
      updateProduced(1, mpg);
    } else {
      setMiles(newMiles.target.value);
      updateProduced(newMiles.target.value, mpg);
    }
  };
  const handleMpg = newMpg => {
    if (newMpg.target.value === '' || newMpg.target.value === '0') {
      setMpg(1);
      updateProduced(miles, 1);
    } else {
      setMpg(newMpg.target.value);
      updateProduced(miles, newMpg.target.value);
    }
  };
  const handleTransportation = e => {
    if (e.target.value === 'car') {
      setTransportation('produced');
    } else if (e.target.value !== 'select mode') {
      setTransportation('reduced');
    }
  };

  return (
    <div className="quick-access-container">
      <div className="quick-access-form">
        <Grid className="quick-access-grid">
          <Grid.Row centered>
            <Image src={'/images/e-impact/QuickAccessLogo.png'} height={102} width={271} alt="Quick Access" />
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column width={5}>
              <Popup
                trigger={<Button secondary>What is the Quick Access Page?</Button>
                }
                content="Welcome to the QuickAccess Page, the purpose of this page is allow potential users to test this website before building an account."
                position="left center"
                inverted
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Popup
                trigger={<Button secondary>How Does this Page Work?</Button>
                }
                content="Input any travel information below and the mileage of your most used vehicle to calculate your potential Green House Gas(CO2) emissions."
                position="right center"
                inverted
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row floated="left" centered>
            <Grid.Column width={5}>
              <Header as="h3">Distance Traveled(mi)</Header>
            </Grid.Column>
            <Grid.Column width={5}>
              <Form align="left">
                <Form.Field>
                  <input type="number" placeholder="ex. 0-9" maxLength="5" onChange={e => handleMiles(e)} />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row floated="left" centered>
            <Grid.Column width={5}>
              <Header as="h3">Mode of Transport</Header>
            </Grid.Column>
            <Grid.Column width={5}>
              <Form>
                <Form.Field>
                  <select onChange={e => handleTransportation(e)}>
                    <option value="select mode">Select Mode</option>
                    <option value="bike">Bike</option>
                    <option value="bus">Bus</option>
                    <option value="car">Car</option>
                    <option value="carpool">Carpool</option>
                    <option value="foot">Foot</option>
                    <option value="remote work">Remote Work</option>
                  </select>
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row floated="left" centered>
            <Grid.Column width={5}>
              <Header as="h3">Miles Per Gallon of test vehicle</Header>
            </Grid.Column>
            <Grid.Column width={5}>
              <Form align="left">
                <Form.Field>
                  <input type="number" placeholder="ex. 0-9" maxLength="4" onChange={e => handleMpg(e)} />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Card.Group>
              <Card href='https://projectfootprint.com/'>
                <img src={'/images/e-impact/ProjectFootPrint.png'} width={280} height={280} alt="PFP Logo" />
                <Card.Content>
                  <Card.Header>Reduce Your CO2 Footprint</Card.Header>
                  <Card.Description>
                    Project Footprint is a nonprofit organization aiming to plant native King Koa trees and encourage
                    others to make conscious efforts at reducing their carbon footprint.
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card>
                {// Temporary Image from:https://favpng.com/png_view/array-health-greenhouse-gas-lyocell-material-logo-png/M35VccaZ
                }
                <img src={'/images/e-impact/LeafLogo.png'} width={280} height={280} alt="CE Logo" />
                <Card.Content>
                  <Card.Header>CO2 {transportationMethod}</Card.Header>
                  <Card.Description>You {transportationMethod} a total of <strong>{ce.toFixed(2)} lb. of Carbon
                    Dioxide(CO2)</strong></Card.Description>
                </Card.Content>
              </Card>
              <Card>
                {// Temporary Image from:https://www.cleanpng.com/png-cost-reduction-saving-money-service-1541224/
                }
                <img src={'/images/e-impact/SavingMoneyLogo.png'} width={280} height={280} alt="Saving Money Logo" />
                <Card.Content>
                  <Card.Header>Save Gas Money</Card.Header>
                  <Card.Description>Using an electric car cuts the cost of Gas every month and reduces the amount of
                    Green House Gases you produce.</Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
};

export default QuickAccess;
