import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Icon, Popup } from 'semantic-ui-react';
import { Users } from '../../api/user/UserCollection';

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = { changeMpg: '', changeRoundTrip: '' };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  submit = () => {
    const { changeMpg, changeRoundTrip } = this.state;
    Users.update({ _id: this.props.docId }, {
      username: this.props.username,
      autoMPG: Number(changeMpg) || this.props.userMpg,
      homeRoundTrip: Number(changeRoundTrip) || this.props.userHomeRoundTrip,
    });
  }

  render() {
    return (
      <Grid>
        <Form onSubmit={this.submit}>
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
            name='changeMpg'
            type='number'
            placeholder={this.props.userMpg}
            onChange={this.handleChange}
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
            name='changeRoundTrip'
            type='number'
            placeholder={this.props.userHomeRoundTrip}
            onChange={this.handleChange}
          />
          <Form.Button content="Submit"/>
        </Form>
      </Grid>
    );
  }
}

Settings.propTypes = {
  docId: PropTypes.string,
  username: PropTypes.string,
  userMpg: PropTypes.number,
  userHomeRoundTrip: PropTypes.number,
};

export default Settings;
