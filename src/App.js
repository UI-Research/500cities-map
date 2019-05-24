import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

const d3 = require('d3-geo');
const axios = require('axios');

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
    
    // TODO: this should be webpack config override.
    axios.get("http://urban-500cities.lndo.site/grantee-feature-feed")
    .then(function (response) {
      
      // handle success
      console.log(response);

      // add markers to map
      response.data.features.forEach(function(marker) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
        // make a marker for each feature and add to the map

        var html = '<h3 class="text-secondary">' + marker.properties.name + '</h3><p>' + marker.properties.focusArea + '</p><p>' + marker.properties.city + ', ' + marker.properties.state + '</p>';


        new mapboxgl.Marker(el)
          .setLngLat(projectionMercartor.invert(projection(marker.geometry.coordinates)))
          .setPopup(new mapboxgl.Popup({ offset: 25, className: 'challenge-' + marker.properties.challengeTypeId }) // add popups
            .setHTML(html))
          .addTo(map);
      });
      
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
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