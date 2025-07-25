// Crear el mapa centrado en CDMX
var map = L.map('map').setView([19.4326, -99.1332], 13);

// Añadir capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Crear grupos de capas
var alcaldiasLayer = L.layerGroup().addTo(map);
var prediosLayer = L.layerGroup();

// Cargar ALCALDÍAS
fetch('data/ALC_REPROJECT.geojson')
  .then(res => res.json())
  .then(data => {
    const capaAlcaldias = L.geoJSON(data, {
      style: {
        color: 'blue',
        weight: 1,
        fillOpacity: 0.1
      },
      onEachFeature: function (feature, layer) {
        let popup = '';
        for (let prop in feature.properties) {
          popup += `<b>${prop}:</b> ${feature.properties[prop]}<br>`;
        }
        layer.bindPopup(popup);
      }
    });
    capaAlcaldias.addTo(alcaldiasLayer);
  });

// Cargar PREDIOS
fetch('data/BOLSAINMOBILIARIA_SERVIMET.geojson')
  .then(res => res.json())
  .then(data => {
    const capaPredios = L.geoJSON(data, {
      style: {
        color: 'orange',
        weight: 1,
        fillOpacity: 0.3
      },
      onEachFeature: function (feature, layer) {
        let popup = '';
        for (let prop in feature.properties) {
          popup += `<b>${prop}:</b> ${feature.properties[prop]}<br>`;
        }
        layer.bindPopup(popup);
      }
    });
    capaPredios.addTo(prediosLayer);
  });

// Agregar control de capas (encendido y apagado)
L.control.layers(null, {
  "Alcaldías CDMX": alcaldiasLayer,
  "Predios SERVIMET": prediosLayer
}).addTo(map);
