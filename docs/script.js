// Crear el mapa centrado en CDMX
var map = L.map('map').setView([19.4326, -99.1332], 13);

// Agregar capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Añadir buscador al mapa
L.Control.geocoder({
  defaultMarkGeocode: true
}).addTo(map);

// Crear grupos vacíos
var alcaldiasLayer = L.layerGroup();
var prediosLayer = L.layerGroup();

// Cargar alcaldías con nombres visibles
fetch('data/ALC_REPROJECT.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        const nombre = feature.properties.nombre || '';
        layer.bindPopup(nombre);
        // Mostrar nombre como etiqueta permanente
        layer.bindTooltip(nombre, {
          permanent: true,
          direction: 'center',
          className: 'nombre-etiqueta'
        }).openTooltip();
      },
      style: {
        color: '#3388ff',
        weight: 1,
        fillOpacity: 0.1
      }
