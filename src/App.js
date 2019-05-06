import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

const d3 = require('d3-geo');

mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';

class App extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      lng: -1.9209,
      lat: 2.5328,
      zoom: 3.71
    };
  }

  componentDidMount() {

    const granteeStyle = 'mapbox://styles/urbaninstitute/cjv8964e6apjc1fo42nrwlp2l';
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: granteeStyle,
      center: [lng, lat],
      zoom
    });

    // Setup albersUSA projection for markers.
    // @see https://github.com/developmentseed/dirty-reprojectors/issues/12.
    let R = 6378137.0; // radius of Earth in meters
    const projection = d3.geoAlbersUsa().translate([0, 0]).scale(R);
    const projectionMercartor = d3.geoMercator().translate([0, 0]).scale(R);
    
    const geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-77.032, 38.913]
        },
        properties: {
          title: 'Mapbox',
          description: 'Washington, D.C.'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-159.8175044, 22.0506879]
        },
        properties: {
          title: 'Kauai',
          description: 'Does a point on the island show up?'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.414, 37.776]
        },
        properties: {
          title: 'Mapbox',
          description: 'San Francisco, California'
        }
      }]
    };

    // add markers to map
    geojson.features.forEach(function(marker) {

      // create a HTML element for each feature
      const el = document.createElement('div');
      el.className = 'marker';

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(projectionMercartor.invert(projection(marker.geometry.coordinates)))
        .setPopup(new mapboxgl.Popup({ offset: 25, className: 'bg-info' }) // add popups
          .setHTML('<h3 class="text-secondary">' + marker.properties.title + '</h3><p class="lead">' + marker.properties.description + '</p>'))
        .addTo(map);
    });

    map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    );
  }
  
}

export default App;