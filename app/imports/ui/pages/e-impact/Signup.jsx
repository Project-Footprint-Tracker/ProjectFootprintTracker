import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Image, Message, Segment, Popup, Icon } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { Users } from '../../api/user/UserCollection';
import LandingNavBar from '../components/LandingNavBar';

const countyOptions = [
  { text: 'Hawaii', value: 'Hawaii' },
  { text: 'Honolulu', value: 'Honolulu' },
  { text: 'Kalawao', value: 'Kalawao' },
  { text: 'Kauai', value: 'Kauai' },
  { text: 'Maui', value: 'Maui' },
];

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
class Signup extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { county: '', first: '', last: '', mpg: '', homeRoundTrip: '', email: '', password: '', error: '', redirectToReferer: false };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  /** Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  submit = () => {
    const { county, first, last, mpg, homeRoundTrip, email, password } = this.state;
    Accounts.createUser({ email, profile: { county: county, first: first, last: last }, username: email, password }, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        this.setState({ error: '', redirectToReferer: true });
      }
    });
    Users.define({ username: email, homeRoundTrip: Number(homeRoundTrip), autoMPG: Number(mpg) });
  };

  /** Display the signup form. Redirect to add page after successful registration and login. */
  render() {
    const { from } = this.props.location.state || { from: { pathname: `/Dashboard/${this.state.email}` } };
    // if correct authentication, redirect to from: page instead of signup screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    return (
      <div id='sign'>
        <LandingNavBar/>
        <Container id="signup-page">
          <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
            <Grid.Column>
              <Form onSubmit={this.submit}>
                <Segment stacked>
                  <Header as="h2" textAlign="center">
                      Register your account
                  </Header>
                  <Image size='medium' src="/images/EImpactLogo.png" centered/>
                  <Form.Select
                    label="Location"
                    id="signup-form-county"
                    name="county"
                    type="county"
                    placeholder="Select County"
                    options={countyOptions}
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Input
                    label='First Name'
                    icon='user'
                    iconPosition='left'
                    name='first'
                    type='name'
                    placeholder="First Name"
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Input
                    label='Last Name'
                    icon='user'
                    name='last'
                    iconPosition='left'
                    type='name'
                    placeholder="Last Name"
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Input
                    label={
                      <div className='field' style={{ margin: 0 }}>
                        <label style={{ display: 'inline-block' }}>Mpg of Vehicle</label>
                        <Popup
                          trigger={<Icon name='question circle outline'/>}
                          content='This will be used to calculate how much gas you are saving and spending with each trip'
                        />
                      </div>
                    }
                    name='mpg'
                    type='number'
                    placeholder='Mpg'
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Input
                    label={
                      <div className='field' style={{ margin: 0 }}>
                        <label style={{ display: 'inline-block' }}>Home Round Trip</label>
                        <Popup
                          trigger={<Icon name='question circle outline'/>}
                          content='This is the distance from your house to work and back. This will be used as the default value when quickly adding trips.'
                        />
                      </div>
                    }
                    name='homeRoundTrip'
                    type='number'
                    placeholder='Distance'
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Input
                    label="Email"
                    id="signup-form-email"
                    icon="user"
                    iconPosition="left"
                    name="email"
                    type="email"
                    placeholder="E-mail address"
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Input
                    label="Password"
                    id="signup-form-password"
                    icon="lock"
                    iconPosition="left"
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Button id="signup-form-submit" content="Submit"/>
                </Segment>
              </Form>
              <Message>
                  Already have an account? <Link to="/signin">Login here!</Link>
              </Message>
              {this.state.error === '' ? (
                ''
              ) : (
                <Message
                  error
                  header="Registration was not successful"
                  content={this.state.error}
                />
              )}
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
