import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import Menu from './Menu';
import './Menu.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaHNhdGFyaXAxIiwiYSI6ImNsdzlpYmhzcTAzeGQyaXJ6bGF5ZGRldDUifQ.XOvM-eMo2PdxC3snDb4MZg';

const Map = () => {
  const mapContainer = useRef(null);
  const addPropertyGeocoderContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [properties, setProperties] = useState([]);
  const [showAddPropertyPopup, setShowAddPropertyPopup] = useState(false);
  const [showViewPropertiesPopup, setShowViewPropertiesPopup] = useState(false);

  useEffect(() => {
    if (!map) {
      const initializeMap = () => {
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-74.5, 40],
          zoom: 9,
        });

        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          placeholder: 'Search for places...',
        });

        mapInstance.addControl(geocoder, 'top-left');

        mapInstance.on('load', () => {
          setMap(mapInstance);
          mapInstance.resize();
        });
      };

      initializeMap();
    }
  }, [map]);

  const handleAddProperty = () => {
    setShowAddPropertyPopup(true);
    setShowViewPropertiesPopup(false);

    if (map) {
      const addPropertyGeocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Search for address...',
      });

      addPropertyGeocoder.on('result', (e) => {
        const { place_name, geometry } = e.result;
        const newProperty = {
          id: properties.length + 1,
          name: place_name,
          address: place_name,
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
          dateAdded: new Date().toLocaleString(),
          notes: '',
        };
        setProperties([...properties, newProperty]);
        setShowAddPropertyPopup(false);
      });

      if (addPropertyGeocoderContainer.current) {
        addPropertyGeocoder.addTo(addPropertyGeocoderContainer.current);
      }
    }
  };

  const handleViewProperties = () => {
    setShowViewPropertiesPopup(true);
    setShowAddPropertyPopup(false);
  };

  const handleSelectProperty = (property) => {
    map.flyTo({
      center: [property.longitude, property.latitude],
      zoom: 14,
    });
    new mapboxgl.Popup()
      .setLngLat([property.longitude, property.latitude])
      .setHTML(`<h3>${property.name}</h3><p>${property.address}</p><p>${property.notes}</p>`)
      .addTo(map);
  };

  return (
    <div>
      <Menu onAddProperty={handleAddProperty} onViewProperties={handleViewProperties} />
      {showAddPropertyPopup && (
        <div className={`popup ${showAddPropertyPopup ? 'visible' : ''}`} ref={addPropertyGeocoderContainer} />
      )}
      {showViewPropertiesPopup && (
        <div className={`popup ${showViewPropertiesPopup ? 'visible' : ''}`}>
          <ul className="property-list">
            {properties.map((property) => (
              <li key={property.id} className="property-item" onClick={() => handleSelectProperty(property)}>
                {property.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div ref={mapContainer} className="map-container" />
      <div id="geocoder" className="geocoder-container"></div>
    </div>
  );
};

export default Map;