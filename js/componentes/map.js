export function initMap(state) {
    state.map = L.map('mapid').setView([-15.7801, -47.9292], 5);
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '&copy; OpenStreetMap' });
    osmLayer.addTo(state.map);
    const esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles &copy; Esri' });
    L.control.layers({ "OpenStreetMap": osmLayer, "Satélite": esriWorldImagery }).addTo(state.map);

    state.map.createPane('poligonalPane').style.zIndex = 450;
    state.map.createPane('lotesPane').style.zIndex = 500;
    state.map.createPane('appPane').style.zIndex = 550;
    state.map.createPane('riscoPane').style.zIndex = 600;

    state.layers.poligonais = L.featureGroup([], { pane: 'poligonalPane' }).addTo(state.map);
    state.layers.lotes = L.featureGroup([], { pane: 'lotesPane' }).addTo(state.map);
    state.layers.app = L.featureGroup([], { pane: 'appPane' }).addTo(state.map);
    state.layers.risco = L.featureGroup([], { pane: 'riscoPane' }).addTo(state.map);
}
