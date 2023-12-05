import React from 'react'
import GoogleMapReact from 'google-map-react'
import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'
import './map.css'
import './main.css'

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={locationIcon} className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>
)

const Mapa = ({ location, zoomLevel }) => 
(  
  <div className="map">
    <h2 align='center' id='titMapa'>Mapa</h2>
    <h6 id='geo' align='center'>Latitud: <span id='idLat'>{location.lat}</span></h6>
    <h6 id='geo' align='center'>Longitud: <span id='idLng'>{location.lng}</span></h6>
    <div className="google-map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyBHawWrb2oiCkHSZ-0jvGztVGjgWPXiSJ4' }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      >
        <LocationPin
          lat={location.lat}
          lng={location.lng}
          text={location.address}
        />
      </GoogleMapReact>
    </div>
  </div>
)

export default Mapa