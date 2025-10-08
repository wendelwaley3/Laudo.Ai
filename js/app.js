// ===================== Estado Global do Aplicativo =====================
const state = {
    map: null,
    layers: {
        lotes: null,
        app: null,
        risco: null,
        poligonais: null
    },
    allLotes: [],
    allRisco: [],
    nucleusSet: new Set(),
    currentNucleusFilter: 'all',
};

// ===================== Funções de Inicialização (Chamadas no Início) =====================

// Inicializa o mapa Leaflet
function initMap() {
    state.map = L.map('mapid').setView([-15.7801, -47.9292], 5);
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '&copy; OpenStreetMap' });
    osmLayer.addTo(state.map);
    const esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles &copy; Esri' });
    L.control.layers({ "OpenStreetMap": osmLayer, "Satélite": esriWorldImagery }).addTo(state.map);

    state.layers.lotes = L.featureGroup().addTo(state.map);
    state.layers.app = L.featureGroup().addTo(state.map);
    state.layers.risco = L.featureGroup().addTo(state.map);
    state.layers.poligonais = L.featureGroup().addTo(state.map);
}

// Configura a navegação entre as abas
function initNav() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            document.querySelectorAll('main section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            link.classList.add('active');
            if (targetId === 'dashboard' && state.map) state.map.invalidateSize();
        });
    });
}

// Configura o upload de arquivos
function initUpload() {
    const fileInput = document.getElementById('geojsonFileInput');
    const processBtn = document.getElementById('processAndLoadBtn');
    
    processBtn.addEventListener('click', async () => {
        const files = Array.from(fileInput.files || []);
        if (files.length === 0) return alert('Nenhum arquivo selecionado.');

        Object.values(state.layers).forEach(layer => layer.clearLayers());
        state.allLotes = [];
        state.allRisco = [];
        state.nucleusSet.clear();

        try {
            for (const file of files) {
                const text = await file.text();
                const geojsonData = JSON.parse(text);
                const name = file.name.toLowerCase();

                if (name.includes('risco')) {
                    state.allRisco.push(...geojsonData.features);
                } else if (name.includes('lote')) {
                    state.allLotes.push(...geojsonData.features);
                } else if (name.includes('app')) {
                    L.geoJSON(geojsonData, { style: { color: '#16a085', weight: 2 } }).addTo(state.layers.app);
                } else if (name.includes('poligonal')) {
                    L.geoJSON(geojsonData, { style: { color: '#95a5a6', weight: 1.5, fillOpacity: 0.1 } }).addTo(state.layers.poligonais);
                }
            }
            
            const lotesMap = new Map();
            state.allLotes.forEach(lote => lotesMap.set(lote.properties.cod_lote, lote));
            state.allRisco.forEach(riscoLote => {
                const codLote = riscoLote.properties.cod_lote;
                if (lotesMap.has(codLote)) {
                    Object.assign(lotesMap.get(codLote).properties, riscoLote.properties);
                }
            });
            state.allLotes = Array.from(lotesMap.values());

            L.geoJSON(state.allLotes, { style: styleLote, onEachFeature: onEachLoteFeature }).addTo(state.layers.lotes);
            state.allLotes.forEach(f => {
                if (f.properties.desc_nucleo) state.nucleusSet.add(f.properties.desc_nucleo);
            });

            const allLayersGroup = L.featureGroup(Object.values(state.layers));
            if (allLayersGroup.getLayers().length > 0) state.map.fitBounds(allLayersGroup.getBounds());

            populateNucleusFilter();
            refreshDashboard();
            fillLotesTable();

        } catch (e) {
            alert(`Erro: ${e.message}`);
            console.error(e);
        }
    });
}

// ===================== Estilos e Popups =====================
function styleLote(feature) {
    const grau = Number(feature.properties.grau);
    let color;
    if (grau === 1) color = '#2ecc71';
    else if (grau === 2) color = '#f1c40f';
    else if (grau === 3) color = '#e67e22';
    else if (grau >= 4) color = '#e74c3c';
    else return { fillColor: '#3498db', weight: 1, color: 'white', fillOpacity: 0.3 };
    return { fillColor: color, weight: 2, color: 'white', fillOpacity: 0.7 };
}

function onEachLoteFeature(feature, layer) {
    const p = feature.properties;
    let content = `<b>Cód:</b> ${p.cod_lote || 'N/A'}<br><b>Núcleo:</b> ${p.desc_nucleo || 'N/A'}`;
    if (p.grau) {
        content += `<br><b>Risco:</b> ${p.grau}`;
    }
    layer.bindPopup(content);
}

// ===================== UI Updates =====================
function filteredLotes() {
    return state.currentNucleusFilter === 'all' ? state.allLotes : state.allLotes.filter(f => f.properties.desc_nucleo === state.currentNucleusFilter);
}

function refreshDashboard() {
    const feats = filteredLotes();
    let riskCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let custoTotal = 0, lotesAppCount = 0;

    feats.forEach(f => {
        const p = f.properties;
        const grau = Number(p.grau);
        if (grau >= 1 && grau <= 4) riskCounts[grau]++;
        if (Number(p.dentro_app) > 0) lotesAppCount++;
        custoTotal += Number(p.valor) || 0;
    });

    const totalRisco = riskCounts[2] + riskCounts[3] + riskCounts[4];
    document.getElementById('totalLotes').textContent = feats.length;
    document.getElementById('lotesRisco').textContent = totalRisco;
    document.getElementById('lotesApp').textContent = lotesAppCount;
    document.getElementById('custoEstimado').textContent = custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fillLotesTable() {
    const tbody = document.querySelector('#lotesDataTable tbody');
    tbody.innerHTML = '';
    const feats = filteredLotes();
    if (feats.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhum dado.</td></tr>';
        return;
    }
    tbody.innerHTML = feats.map(f => {
        const p = f.properties;
        return `<tr>
            <td>${p.cod_lote || 'N/A'}</td>
            <td>${p.desc_nucleo || 'N/A'}</td>
            <td><button class="zoomLoteBtn" data-codlote="${p.cod_lote}">Ver</button></td>
        </tr>`;
    }).join('');
    
    tbody.querySelectorAll('.zoomLoteBtn').forEach(btn => btn.addEventListener('click', e => {
        const cod = e.target.getAttribute('data-codlote');
        state.layers.lotes.eachLayer(layer => {
            if (layer.feature.properties.cod_lote == cod) {
                state.map.fitBounds(layer.getBounds());
                layer.openPopup();
            }
        });
    }));
}

function populateNucleusFilter() {
    const filterSelect = document.getElementById('nucleusFilter');
    filterSelect.innerHTML = '<option value="all">Todos os Núcleos</option>';
    Array.from(state.nucleusSet).sort().forEach(n => {
        filterSelect.innerHTML += `<option value="${n}">${n}</option>`;
    });
}

// ===================== Ponto de Entrada Principal =====================
document.addEventListener('DOMContentLoaded', () => {
    initMap(); 
    initNav(); 
    initUpload(); 
    
    // Configura listeners
    document.getElementById('applyFiltersBtn').addEventListener('click', () => {
        state.currentNucleusFilter = document.getElementById('nucleusFilter').value; 
        refreshDashboard();
        fillLotesTable();
    });

    document.getElementById('nucleusFilter').addEventListener('change', () => {
        state.currentNucleusFilter = document.getElementById('nucleusFilter').value; 
        refreshDashboard();
        fillLotesTable();
    });

    // Estado inicial
    document.getElementById('dashboard').classList.add('active');
    document.querySelector('nav a[data-section="dashboard"]').classList.add('active');
});
