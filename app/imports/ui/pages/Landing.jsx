import React from 'react';
import { Grid, Image } from 'semantic-ui-react';

/* A simple static component to render some text for the landing page. */
const Landing = () => {
  const menuStyle = { height: '500px' };
  const padding = { paddingTop: '100px' };

  return (
    <div className='background-landing' style={menuStyle}><Grid id='landing-page' verticalAlign='middle' textAlign='center' container>

      <Grid.Column width={4}>
        <Image src="/images/landing-page/footprint.jpg" />
        <Image src="/images/honolulu.jpg" />
      </Grid.Column>

      <Grid.Column width={8}>
        <h1>Welcome to this template</h1>
        <p>Now get to work and modify this app!</p>
      </Grid.Column>

    </Grid></div>
  );
};

export default Landing;
