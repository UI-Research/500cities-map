import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import fontawesome from "./fontawesome";
const d3 = require("d3-geo");
const axios = require("axios");

mapboxgl.accessToken =
  "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      lng: -0.925,
      lat: 0.985,
      zoom: 4.0,
    };
  }

  componentDidMount() {
    // Enable Fontawesome immediately
    fontawesome();
    const linkIcon = '<i class="fas fa-chevron-right"></i>';
    const granteeStyle =
      "mapbox://styles/urbaninstitute/cjv8964e6apjc1fo42nrwlp2l";
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: granteeStyle,
      pitchWithRotate: false,
      center: [lng, lat],
      zoom: 4,
      logoPosition: "bottom-right",
      attributionControl: false,
      boxZoom: false,
      trackResize: true,
      dragRotate: false,
      renderWorldCopies: false,
      scrollZoom: true,
      dragPan: true,
      doubleClickZoom: true,
      touchZoomRotate: false,
    });
    // Find all active markers and de-activate.
    function clearMarkers() {
      const activeMarkers = document.getElementsByClassName("marker-active");
      let i;
      for (i = 0; i < activeMarkers.length; i++) {
        activeMarkers[i].classList.remove("marker-active");
      }
    }
    // Setup albersUSA projection for markers.
    // @see https://github.com/developmentseed/dirty-reprojectors/issues/12.
    let R = 6378137.0; // radius of Earth in meters
    const projection = d3.geoAlbersUsa().translate([0, 0]).scale(R);
    const projectionMercartor = d3.geoMercator().translate([0, 0]).scale(R);
    // API URL set in .env
    axios
      .get(process.env.REACT_APP_API_URL)
      .then(function (response) {
        let dups = [];
        let myOffset = [];
        // Get map bounds so we can contain the map on resize.
        let boundbox = map.getBounds();
        // add markers to map
        response.data.features.forEach(function (marker) {
          // Look for duplicate locations and offset the second one.
          const latLnString = marker.geometry.coordinates.join("+");
          myOffset = [0, 0];
          if (dups.includes(latLnString)) {
            myOffset = [-8, -8];
          } else {
            dups.push(latLnString);
          }
          // create a HTML element for each feature
          const el = document.createElement("div");
          el.className = "marker";
          // Add class "challenge-tid" to each marker
          el.classList.add("challenge-" + marker.properties.challengeTypeId);
          // set color based on challenge type.
          if (marker.properties.challengeTypeId === "1") {
            el.style.backgroundColor = "#fdbf11";
          } else if (marker.properties.challengeTypeId === "2") {
            el.style.backgroundColor = "#1696d2";
          } else if (marker.properties.challengeTypeId === "59") {
            el.style.backgroundColor = "#0A4C6A";
          } else {
            el.style.backgroundColor = "#55B748";
          }
          // Create markup for popup.
          const markup = `
          <div class="mapboxgl-popup-body">
            <h3 class="mb-2">${marker.properties.name}</h3>
            <p class="mb-0 font-italic">${marker.properties.city}. ${marker.properties.state}</p>
            <p class="mb-0">${marker.properties.focusArea}</p>
          </div>
          <div class="mapboxgl-popup-cta">
            <a href="${marker.properties.link}" class="mapboxgl-popup-link">View Grantee ${linkIcon}</a>
          </div>
        `;
          // Create a popup object.
          let mypopup = new mapboxgl.Popup({
            offset: 25,
            className: "challenge-" + marker.properties.challengeTypeId,
            maxWidth: "175px",
          }).setHTML(markup);

          // Add marker with related popop to the map.
          new mapboxgl.Marker(el, {
            offset: myOffset,
          })
            .setLngLat(
              projectionMercartor.invert(
                projection(marker.geometry.coordinates)
              )
            )
            .setPopup(mypopup) // add popups
            .addTo(map);
          // Toggle border style on marker click.
          el.addEventListener("mouseover", (e) => {
            if (
              !el.classList.contains(
                "marker-active",
                "challenge-" + marker.properties.challengeTypeId
              )
            ) {
              clearMarkers();
              e.target.classList.add("marker-active");
            } else {
              el.classList.remove("marker-active");
            }
          });
        });
        // Toggle marker borders when closing via map click.
        map.on("click", (e) => {
          if (e.originalEvent.target.className === "mapboxgl-canvas") {
            clearMarkers();
          }
        });
        // Contain map in bounding box.
        map.on("resize", (e) => {
          e.target.fitBounds(boundbox);
        });
      })
      .catch(function (error) {
        // handle error. Display alert.
        console.log(error);
        document
          .getElementsByClassName("error-message")[0]
          .classList.remove("d-none");
      })
      .finally(function () {
        // always executed. Remove loading icon.
        document
          .getElementsByClassName("loading-icon")[0]
          .classList.add("d-none");
        map.resize();
      });
  }
  render() {
    return (
      <>
        <div
          ref={(el) => (this.mapContainer = el)}
          className="absolute top right left bottom border"
        />
        <div className="loading-icon" role="status">
          <i className="fas fa-circle-notch fa-spin fa-4x text-primary"></i>
        </div>
        <div className="error-message d-none">
          <div className="alert alert-danger" role="alert">
            There was a problem loading Grantees.
          </div>
        </div>
      </>
    );
  }
}

export default App;
