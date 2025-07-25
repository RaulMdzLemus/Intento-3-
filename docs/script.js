// Crear el mapa centrado en CDMX
var map = L.map('map').setView([19.4326, -99.1332], 13);

// Agregar capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Crear grupos vacíos
var alcaldiasLayer = L.layerGroup();
var prediosLayer = L.layerGroup();

// Cargar alcaldías
fetch('data/ALC_REPROJECT.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: (f, l) => l.bindPopup(f.properties.nombre || '')
    }).addTo(alcaldiasLayer);
  });

// Cargar predios
fetch('data/PREDIOS SERVIMET 4326.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data).addTo(prediosLayer);
  });

// Agregar solo una capa por defecto
alcaldiasLayer.addTo(map);

// Control de capas (para encender/apagar)
L.control.layers(null, {
  "Alcaldías CDMX": alcaldiasLayer,
  "Predios SERVIMET": prediosLayer
}).addTo(map);
