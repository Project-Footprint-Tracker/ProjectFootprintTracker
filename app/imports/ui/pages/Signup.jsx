import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { UserDefineMethod } from '../../api/user/UserCollection.methods';

/*
 * Signup component is similar to signin component, but we create a new user instead.
 */
const Signup = ({ location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zipCode, setZipCode] = useState(0);
  const [goal, setGoal] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  /* Update the form controls each time the user interacts with them. */
  const handleChange = (e, { name, value }) => {
    switch (name) {
    case 'email':
      setEmail(value);
      break;
    case 'password':
      setPassword(value);
      break;
    case 'firstName':
      setFirstName(value);
      break;
    case 'lastName':
      setLastName(value);
      break;
    case 'zipCode':
      setZipCode(value);
      break;
    case 'goal':
      setGoal(value);
      break;
    case 'image':
      setImage(value);
      break;
    default:
        // do nothing
    }
  };

  /* Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = () => {

    UserDefineMethod.call({
      email,
      firstName,
      lastName,
      zipCode,
      goal,
      image,
    },
    (userError) => {
      if (userError) {
        swal('Invalid ZIP Code. Please type a valid ZIP Code');
      } else {
        Accounts.createUser({ username: email, email, password }, (accountError) => {
          if (accountError) {
            setError(accountError.reason);
          } else {
            setError('');
            setRedirectToReferer(true);
          }
        });
      }
    });
  };

  /* Display the signup form. Redirect to add page after successful registration and login. */
  const { from } = location.state || { from: { pathname: '/' } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Redirect to={from} />;
  }
  return (
    <Container id='signup-page'>
      <Grid textAlign='center' verticalAlign='middle' centered columns={2}>
        <Grid.Column>
          <Header as='h2' textAlign='center'>
            Register your account
          </Header>
          <Form onSubmit={submit}>
            <Segment stacked>
              <Form.Input
                label='Email'
                id='signup-form-email'
                icon='user'
                iconPosition='left'
                name='email'
                type='email'
                placeholder='E-mail address'
                onChange={handleChange}
              />
              <Form.Input
                label='Password'
                id='signup-form-password'
                icon='lock'
                iconPosition='left'
                name='password'
                placeholder='Password'
                type='password'
                onChange={handleChange}
              />
              <Form.Input
                label="First Name"
                id='signup-form-first-name'
                icon='user'
                iconPosition='left'
                name='firstName'
                onChange={handleChange}
              />
              <Form.Input
                label='Last Name'
                id='signup-form-last-name'
                icon='user'
                iconPosition='left'
                name='lastName'
                onChange={handleChange}
              />
              <Form.Input
                label='Zip Code'
                id='signup-form-zip-code'
                icon='point'
                iconPosition='left'
                name='zipCode'
                type='number'
                onChange={handleChange}
              />
              <Form.Input
                label='Goal'
                id='signup-form-goal'
                icon='trophy'
                iconPosition='left'
                name='goal'
                onChange={handleChange}
              />
              <Form.Input
                label='Profile Picture'
                id='signup-form-image'
                icon='user'
                iconPosition='left'
                name='image'
                onChange={handleChange}
              />
              <Form.Button id='signup-form-submit' content='Submit' />
            </Segment>
          </Form>
          <Message>
            Already have an account? Login <Link to='/signin'>here</Link>
          </Message>
          {error === '' ? (
            ''
          ) : (
            <Message
              error
              header='Registration was not successful'
              content={error}
            />
          )}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
