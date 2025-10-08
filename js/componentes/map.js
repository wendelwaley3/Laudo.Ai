export function initMap(state) {
    state.map = L.map('mapid').setView([-15.7801, -47.9292], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '&copy; OpenStreetMap' }).addTo(state.map);
    state.layers.lotes = L.featureGroup().addTo(state.map);
    state.layers.app = L.featureGroup().addTo(state.map);
    state.layers.risco = L.featureGroup().addTo(state.map);
    state.layers.poligonais = L.featureGroup().addTo(state.map);
}
