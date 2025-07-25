// Crear el mapa
var map = L.map('map').setView([19.4326, -99.1332], 13);

// Capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Grupos para capas
var alcaldiasLayer = L.layerGroup();
var prediosLayer = L.layerGroup();

// Cargar alcaldías
fetch('./data/ALC_REPROJECT.geojson')
  .then(res => res.json())
  .then(data => {
    var alcaldiasGeo = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        let contenido = '<b>Alcaldía:</b><br>';
        for (let clave in feature.properties) {
          contenido += `<b>${clave}:</b> ${feature.properties[clave]}<br>`;
        }
        layer.bindPopup(contenido);
      },
      style: { color: '#3388ff', weight: 1, fillOpacity: 0.1 }
    });
    alcaldiasGeo.addTo(alcaldiasLayer);
  });

// Cargar predios
fetch('./data/PREDIOS_SERVIMET_4326.geojson')
  .then(res => res.json())
  .then(data => {
    var prediosGeo = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        let contenido = '<b>Predio:</b><br>';
        for (let clave in feature.properties) {
          contenido += `<b>${clave}:</b> ${feature.properties[clave]}<br>`;
        }
        layer.bindPopup(contenido);
      },
      style: { color: '#ff5733', weight: 1, fillOpacity: 0.3 }
    });
    prediosGeo.addTo(prediosLayer);

    // ---- BUSCADOR EN PREDIOS ----
    var searchControl = new L.Control.Search({
      layer: prediosGeo,
      propertyName: 'NOMBRE', // CAMBIA por el campo a buscar (ej: "ID", "CLAVE")
      marker: false,
      moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 18);
      }
    });

    searchControl.on('search:locationfound', function(e) {
      e.layer.setStyle({ fillColor: '#ffff00', color: '#ff0000' });
      if (e.layer._popup) e.layer.openPopup();
      setTimeout(() => {
        prediosGeo.resetStyle(e.layer);
      }, 2000);
    });

    map.addControl(searchControl);
  });

// Agregar capa inicial
alcaldiasLayer.addTo(map);

// Control de capas
L.control.layers(null, {
  "Alcaldías CDMX": alcaldiasLayer,
  "Predios SERVIMET": prediosLayer
}).addTo(map);
