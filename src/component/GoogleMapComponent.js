import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.544437,  // 서울시 성동구의 위도
  lng: 127.056993  // 서울시 성동구의 경도
};

const GoogleMapComponent = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAISYj4953VETF9jPVKhqjaGvkaiY0G-no">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapComponent;
