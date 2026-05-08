mapboxgl.accessToken =mapboxToken;
const defaultCoords = [11, 11];
const finalCoords =Array.isArray(listing.geometry.coordinates) && listing.geometry.coordinates.length === 2? listing.geometry.coordinates: defaultCoords;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: finalCoords, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl
    .Marker({color:"red"})
    .setLngLat(finalCoords)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.location}, ${listing.country}</h4><p>Exact Location provided after booking</p>`))
    .addTo(map);