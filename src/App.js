import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

import fontawesome from './fontawesome';

const d3 = require('d3-geo');
const axios = require('axios');

mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';

class App extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      lng: -0.925,
      lat: 0.985,
      zoom: 4.00
    };
  }

  componentDidMount() {


    // const sw = new mapboxgl.LngLat(-330.9230816156929, -85.05112899999993);
    // const ne = new mapboxgl.LngLat(330.9230816157313, 85.0511290000006);
    // const initBounds = new mapboxgl.LngLatBounds(sw, ne);

  //  console.log(initBounds);

    // Enable Fontawesome immediately
    fontawesome();

    const linkIcon = '<i class="fas fa-chevron-right"></i>';
    const granteeStyle = 'mapbox://styles/urbaninstitute/cjv8964e6apjc1fo42nrwlp2l';
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: granteeStyle,
      pitchWithRotate: false,
      center: [lng, lat],
      zoom,
      logoPosition: 'bottom-right',
      attributionControl: false
    });
    // map.addControl(new mapboxgl.AttributionControl(), 'top-left');

    //let bounds = new mapboxgl.LngLatBounds();

    //let bounds = map.getBounds();

    // Find all active markers and de-activate.
    function clearMarkers() {
      const activeMarkers = document.getElementsByClassName('marker-active');
      let i;
      for (i = 0; i < activeMarkers.length; i++) {
        activeMarkers[i].classList.remove('marker-active'); 
      }
    }
    
    // Setup albersUSA projection for markers.
    // @see https://github.com/developmentseed/dirty-reprojectors/issues/12.
    let R = 6378137.0; // radius of Earth in meters
    const projection = d3.geoAlbersUsa().translate([0, 0]).scale(R);
    const projectionMercartor = d3.geoMercator().translate([0, 0]).scale(R);
    // API URL set in .env
    axios.get(process.env.REACT_APP_API_URL)
    .then(function (response) {

      //let bounds = new mapboxgl.LngLatBounds();

      //console.log(bounds)

      // add markers to map
      response.data.features.forEach(function(marker) {

        //bounds.extend(marker.geometry.coordinates);

        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
        // set color based on challenge type.
        if (marker.properties.challengeTypeId === '1') {
            el.style.backgroundColor = '#1696d2';
        }
        else {
          el.style.backgroundColor = '#fdbf11';
        }
        // Create markup for popup.
        const markup = `
          <div class="mapboxgl-popup-body">
            <h3 class="mb-2">${marker.properties.name}</h3>
            <p class="mb-0 font-italic">${marker.properties.city}. ${marker.properties.state}</p>
            <p class="mb-0">${marker.properties.focusArea}</p>
          </div>
          <div class="mapboxgl-popup-cta">
            <a href="#" class="mapboxgl-popup-link">View Grantee ${linkIcon}</a>
          </div>
        `;

        // Create a popup object.
        let mypopup = new mapboxgl.Popup({ 
          offset: 25, 
          className: 'challenge-' + marker.properties.challengeTypeId,
          maxWidth: '175px' 
        })
          .setHTML(markup);

        // Add marker with related popop to the map.
        new mapboxgl.Marker(el)
          .setLngLat(projectionMercartor.invert(projection(marker.geometry.coordinates)))
          .setPopup(mypopup) // add popups
          .addTo(map);

         // Toggle border style on marker click.
        el.addEventListener('click', e => {
          if (!el.classList.contains('marker-active')) {
            clearMarkers();
            e.target.classList.add('marker-active');
          }
          else {
            el.classList.remove('marker-active');
          }
        })
      });

      //map.fitBounds(bounds, { padding: 5 });

      // Toggle marker borders when closing via map click.
      map.on('click', e => {
        if (e.originalEvent.target.className === 'mapboxgl-canvas') {
          clearMarkers();
        }
      });

      // map.on('move', e => {
      //   console.log(bounds);
      // });

      //map.resize();

     // console.log(map);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
  }
  render() {
    return (
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
    );
  }
}

export default App;
