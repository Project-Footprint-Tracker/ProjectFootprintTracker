import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const mapStyles = {
  height: '400px',
  width: '90%',
};

export class MapContainer extends React.Component {
  state = {
    showingInfoWindow: false,
    showingHCA: false,
    showingSCH: false,
    showing808: false,
    showingHWF: false,
    showingSC: false,
    showingMRC: false,
    showingWKH: false,
    showingKRCP: false,
    showingKISC: false,
    showingKHM: false,
    showingLCHC: false,
    showingKAH: false,
    activeMarker: {},
    selectedPlace: {},
  };

  onMarkerClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true,
  });

  onHCAClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingHCA: true,
    showingSCH: false,
    showing808: false,
    showingHWF: false,
    showingSC: false,
    showingMRC: false,
    showingWKH: false,
    showingKRCP: false,
    showingKISC: false,
    showingKHM: false,
    showingLCHC: false,
    showingKAH: false,
  })

  onSCHClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingSCH: true,
    showingHCA: false,
    showing808: false,
    showingHWF: false,
    showingSC: false,
    showingMRC: false,
    showingWKH: false,
    showingKRCP: false,
    showingKISC: false,
    showingKHM: false,
    showingLCHC: false,
    showingKAH: false,
  })

  on808Click = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showing808: true,
    showingHCA: false,
    showingSCH: false,
    showingHWF: false,
    showingSC: false,
    showingMRC: false,
    showingWKH: false,
    showingKRCP: false,
    showingKISC: false,
    showingKHM: false,
    showingLCHC: false,
    showingKAH: false,
  })

  onHWFClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingHWF: true,
    showing808: false,
    showingHCA: false,
    showingSCH: false,
    showingSC: false,
    showingMRC: false,
    showingWKH: false,
    showingKRCP: false,
    showingKISC: false,
    showingKHM: false,
    showingLCHC: false,
    showingKAH: false,
  })

  onSCClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingSC: true,
    showingHWF: false,
    showing808: false,
    showingHCA: false,
    showingSCH: false,
    showingMRC: false,
    showingWKH: false,
    showingKRCP: false,
    showingKISC: false,
    showingKHM: false,
    showingLCHC: false,
    showingKAH: false,
  })

  onMRCClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingMRC: true,
    showingSC: false,
    showingHWF: false,
    showing808: false,
    showingHCA: false,
    showingSCH: false,
    showingWKH: false,
    showingKRCP: false,
    showingKISC: false,
    showingKHM: false,
    showingLCHC: false,
    showingKAH: false,
  })

  onWKHClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingWKH: true,
    showingMRC: false,
    showingSC: false,
    showingHWF: false,
    showing808: false,
    showingHCA: false,
    showingSCH: false,
    showingKRCP: false,
    showingKISC: false,
    showingKHM: false,
    showingLCHC: false,
    showingKAH: false,
  })

  onKRCPClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingKRCP: true,
    showingWKH: false,
    showingMRC: false,
    showingSC: false,
    showingHWF: false,
    showing808: false,
    showingHCA: false,
    showingSCH: false,
    showingKISC: false,
    showingKHM: false,
    showingLCHC: false,
    showingKAH: false,
  })

  onKISCClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingKISC: true,
    showingKRCP: false,
    showingWKH: false,
    showingMRC: false,
    showingSC: false,
    showingHWF: false,
    showing808: false,
    showingHCA: false,
    showingSCH: false,
    showingKHM: false,
    showingLCHC: false,
    showingKAH: false,
  })

  onKHMClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingKHM: true,
    showingKISC: false,
    showingKRCP: false,
    showingWKH: false,
    showingMRC: false,
    showingSC: false,
    showingHWF: false,
    showing808: false,
    showingHCA: false,
    showingSCH: false,
    showingLCHC: false,
    showingKAH: false,
  })

  onLCHCClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingLCHC: true,
    showingKHM: false,
    showingKISC: false,
    showingKRCP: false,
    showingWKH: false,
    showingMRC: false,
    showingSC: false,
    showingHWF: false,
    showing808: false,
    showingHCA: false,
    showingSCH: false,
    showingKAH: false,
  })

  onKAHClick = (props, marker) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingKAH: true,
    showingLCHC: false,
    showingKHM: false,
    showingKISC: false,
    showingKRCP: false,
    showingWKH: false,
    showingMRC: false,
    showingSC: false,
    showingHWF: false,
    showing808: false,
    showingHCA: false,
    showingSCH: false,
  })

  onClose = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  /*
   * https://www.hawaiiconservation.org/
   * https://808cleanups.org/
   * https://www.sustainablecoastlineshawaii.org/
   * https://www.wildhawaii.org/
   *
   */

  render() {

    return (
      <div>
        <Map
          /* eslint-disable-next-line react/prop-types */
          google={this.props.google}
          zoom={7}
          style={mapStyles}
          initialCenter={{
            lat: 20.6,
            lng: -157.6,
          }}
        >
          <Marker onClick={this.onHCAClick}
            name={'Hawaii Community Alliance'}
            position={{ lat: 21.2970, lng: -157.8146 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingHCA}>
            <div>
              <h1>Hawai&apos;i Conservation Alliance</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onSCHClick}
            name={'Sustainable Coastlines Hawaii'}
            position={{ lat: 21.288140, lng: -157.808660 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingSCH}>
            <div>
              <h1>Sustainable Coastlines Hawaii</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.on808Click}
            name={'Sustainable Coastlines Hawaii'}
            position={{ lat: 21.4389, lng: -158.0001 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showing808}>
            <div>
              <h1>808 Cleanups</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onHWFClick}
            name={'Hawaii Wildlife Fund Big Island'}
            position={{ lat: 19.5208, lng: -155.9225 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingHWF}>
            <div>
              <h1>Hawaii Wildlife Fund</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onHWFClick}
            name={'Hawaii Wildlife Fund Maui'}
            position={{ lat: 20.9033, lng: -156.3694 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingHWF}>
            <div>
              <h1>Hawaii Wildlife Fund</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onSCClick}
            name={'Sierra Club Hawaii'}
            position={{ lat: 19.7241, lng: -155.0868 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingSC}>
            <div>
              <h1>Sierra Club Hawaii</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onMRCClick}
            name={'Marine Resource Council'}
            position={{ lat: 20.8893, lng: -156.472 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingMRC}>
            <div>
              <h1>Marine Resource Council</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onWKHClick}
            name={'Water Keepers Hawaii Kona'}
            position={{ lat: 19.6400, lng: -155.99692 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingWKH}>
            <div>
              <h1>Waiwai Ola Waterkeepers Hawaii</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onWKHClick}
            name={'Water Keepers Hawaii Hilo'}
            position={{ lat: 19.7374, lng: -155.0750 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingWKH}>
            <div>
              <h1>Waiwai Ola Waterkeepers Hawaii</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onWKHClick}
            name={'Water Keepers Hawaii Oahu'}
            position={{ lat: 21.3069, lng: -157.8583 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingWKH}>
            <div>
              <h1>Waiwai Ola Waterkeepers Hawaii</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onKRCPClick}
            name={'Kōkeʻe Resource Conservation Program'}
            position={{ lat: 21.9586, lng: -159.6708 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingKRCP}>
            <div>
              <h1>Kōkeʻe Resource Conservation Program</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onKISCClick}
            name={'Kauai Invasive Species Committee'}
            position={{ lat: 22.065330, lng: -159.395790 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingKISC}>
            <div>
              <h1>Kauai Invasive Species Committee</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onKHMClick}
            name={'Ka Honua Momona'}
            position={{ lat: 21.073549, lng: -156.981003 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingKHM}>
            <div>
              <h1>Ka Honua Momona</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onLCHCClick}
            name={'Lāna‘i Culture & Heritage Center'}
            position={{ lat: 20.826300, lng: -156.918070 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingLCHC}>
            <div>
              <h1>Lāna‘i Culture & Heritage Center</h1>
            </div>
          </InfoWindow>
          <Marker onClick={this.onKAHClick}
            name={'Ke Ao Hali‘i'}
            position={{ lat: 20.7575, lng: -155.9884 }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingKAH}>
            <div>
              <h1>Ke Ao Hali‘i</h1>
            </div>
          </InfoWindow>
        </Map>
        <div id='community-section'>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: Meteor.settings.defaultKey,
})(MapContainer);
