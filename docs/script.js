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
    const prediosGeo = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        // Popup con todas las propiedades
        let contenido = '<b>Predio:</b><br>';
        for (let clave in feature.properties) {
          contenido += `<b>${clave}:</b> ${feature.properties[clave]}<br>`;
        }
        layer.bindPopup(contenido);
      },
      style: {
        color: '#ff5733',
        weight: 1,
        fillOpacity: 0.3
      }
    });

    prediosGeo.addTo(prediosLayer);

    // Buscador vinculado a un campo del GeoJSON (ej. "NOMBRE" o "ID")
    const searchControl = new L.Control.Search({
      layer: prediosGeo,
      propertyName: 'Name', // CAMBIA esto por el campo correcto de tu GeoJSON
      marker: false,
      moveToLocation: function (latlng, title, map) {
        map.setView(latlng, 18);
      }
    });

    // Al encontrar el predio, resalta y abre popup
    searchControl.on('search:locationfound', function(e) {
      e.layer.setStyle({ fillColor: '#ffff00', color: '#ff0000' });
      if (e.layer._popup) e.layer.openPopup();
      setTimeout(() => {
        prediosGeo.resetStyle(e.layer);
      }, 2000);
    });

    map.addControl(searchControl);
  });
