import React from 'react';
import { Header } from 'semantic-ui-react';
import LandingNavBar from '../../components/to-delete/e-impact/LandingNavBar';
import Footer from '../../components/Footer';
import Info1 from '../../components/to-delete/e-impact/Info1';

/* global document */

/* A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    document.body.classList.remove('dark');
    return (
      <div id="landing">
        <LandingNavBar/>
        <div id="greet">
          <Header size='huge' textAlign='center'>Welcome to E-Impact!</Header>
          <div style={{ paddingLeft: '250px', paddingRight: '250px', color: 'black' }} className="ui center aligned container">
            <p>Help keep our air clean by monitoring your Green House Gas emissions!</p>
          </div>
        </div>
        <Info1/>
        <br/>
        <Footer id={'landing-footer'}/>
      </div>

    );
  }
}

export default Landing;
