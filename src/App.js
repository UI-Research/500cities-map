import React from 'react';
import ReactMapGL from 'react-map-gl';

// import mapboxgl from 'mapbox-gl'
// import Tooltip from './components/tooltip'


class Application extends React.Component {

  // setTooltip(features) {
  //   if (features.length) {
  //     ReactDOM.render(
  //       React.createElement(
  //         Tooltip, {
  //           features
  //         }
  //       ),
  //       this.tooltipContainer
  //     );
  //   } else {
  //     ReactDOM.unmountComponentAtNode(this.tooltipContainer);
  //   }
  // }

//   componentDidMount() {

//     // Container to put React generated content in.
//     this.tooltipContainer = document.createElement('div');

//     const map = new mapboxgl.Map({
//       container: this.mapContainer,
//       style: 'mapbox://styles/urbaninstitute/cjm9fzb762tdd2ro26791vasq',
//     });

// //     let R = 6378137.0; // radius of Earth in meters
// // const projection = d3.geoAlbersUsa().translate([0, 0]).scale(R);
// // const projectionMercartor = d3.geoMercator().translate([0, 0]).scale(R);


//     const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
//       offset: [-120, 0]
//     }).setLngLat([0,0]).addTo(map);
    
//     map.on('mousemove', (e) => {
//       const features = map.queryRenderedFeatures(e.point);
//       tooltip.setLngLat(e.lngLat);
//       map.getCanvas().style.cursor = features.length ? 'pointer' : '';
//       this.setTooltip(features);
//     });
//   }

  render() {
    return (
      <ReactMapGL
        mapboxApiAccessToken="pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ"
        mapStyle="mapbox://styles/urbaninstitute/cjm9fzb762tdd2ro26791vasq"
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}
      />
    );
  }
}

export default Application;