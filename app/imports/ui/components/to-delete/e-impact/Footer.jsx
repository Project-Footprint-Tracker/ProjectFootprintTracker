import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Container, List, Image } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = (props) => (
  <Container id={props.id}>
    <Grid divided stackable inverted>
      <Grid.Row columns={2} style={{ padding: '25px' }}>
        <Grid.Column>
          <List link inverted>
            <List.Item as="a" href="/#">Home</List.Item>
            <List.Item as='a' href="/#/quickaccess">Calculator</List.Item>
            <List.Item as='a' href="/#/signin">Sign in</List.Item>
            <List.Item as='a' target="_blank" href="https://environment-overflow.github.io/ ">About</List.Item>
          </List>
        </Grid.Column>
        <Grid.Column>
          <a href={'/#'}>
            <Image size='small' src="/images/EImpactLogoWhite.png"/>
          </a>
          <p>CORPORATE HEADQUARTERS</p>
          <p>1001 Bishop Street, Suite 2900 Honolulu, Hawaii 96813</p>
          <p>Telephone: (808) 543-5662</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

Footer.propTypes = {
  id: PropTypes.string,
};

export default Footer;
