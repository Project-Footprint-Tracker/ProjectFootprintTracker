import React from 'react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = { paddingTop: '15px' };
    return (
      <footer>
        <div style={divStyle} className="ui center aligned container">
          <hr />
              Project Footprint: CE Tracker <br />
              Department of Information and Computer Sciences <br />
              University of Hawaii<br />
              Honolulu, HI 96822 <br />
          <a href="https://project-footprint-tracker.github.io/ProjectFootprintTracker.github.io/">CE Tracker Home Page</a>
        </div>
      </footer>
    );
  }
}

export default Footer;
