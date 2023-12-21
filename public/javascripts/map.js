camp.replaceAll('"');     ///without removing double quotes json.parse wont work
mapboxgl.accessToken=mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: JSON.parse(camp), // starting position [lng, lat]
  zoom: 10, // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
.setLngLat(JSON.parse(camp))
.setPopup
(
  new mapboxgl.Popup({offset:25})
  .setHTML(`<h5>${mark}</h5>`)
      
)
.addTo(map);