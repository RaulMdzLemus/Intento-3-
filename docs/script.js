// Crear el mapa centrado en CDMX
var map = L.map('map').setView([19.4326, -99.1332], 13);

// Añadir buscador por direcciones (Leaflet Control Geocoder)
L.Control.geocoder({
  defaultMarkGeocode: true
}).addTo(map);

// Agregar capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Crear grupos vacíos para capas
var alcaldiasLayer = L.layerGroup();
var prediosLayer = L.layerGroup();

// Cargar alcaldías con popup de propiedades
fetch('data/PREDIOS_SERVIMET_4326.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        let props = feature.properties;
        let contenido = '<b>Información del objeto:</b><br>';

        for (let clave in props) {
          contenido += `<b>${clave}:</b> ${props[clave]}<br>`;
        }

        layer.bindPopup(contenido);
      },
      style: {
        color: '#3388ff',
        weight: 1,
        fillOpacity: 0.1
      }
    }).addTo(alcaldiasLayer);
  });

// Cargar predios con popup de todas las propiedades
fetch('data/PREDIOS SERVIMET 4326.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        let props = feature.properties;
        let contenido = '<b>Información del predio:</b><br>';

        for (let clave in props) {
          contenido += `<b>${clave}:</b> ${props[clave]}<br>`;
        }

        layer.bindPopup(contenido);
      },
      style: {
        color: '#ff5733',
        weight: 1,
        fillOpacity: 0.3
      }
    }).addTo(prediosLayer);
  });

// Agregar capa inicial
alcaldiasLayer.addTo(map);

// Control de capas para activar/desactivar visibilidad
L.control.layers(null, {
  "Alcaldías CDMX": alcaldiasLayer,
  "Predios SERVIMET": prediosLayer
}).addTo(map);

