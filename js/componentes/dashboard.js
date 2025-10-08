Entendido. Você quer todos os códigos modulares corretos, baseados na estrutura que você já criou (sem a subpasta componentes), e com o index.html corrigido para usar css/style.css em minúsculo.

Vamos fazer isso. Abaixo estão todos os códigos, prontos para você substituir e fazer funcionar.

Ação 1: O index.html Completo e Corrigido

Este código tem o caminho para o css/style.css em minúsculo e carrega o Js/app.js como um módulo.

Substitua TODO o conteúdo do seu index.html por este código:

code
Html
play_circle
download
content_copy
expand_less
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GeoLaudo.AI - Análise REURB</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin=""/>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <div class="logo">GeoLaudo.AI</div>
        <nav>
            <a href="#" data-section="dashboard" class="active">Dashboard</a>
            <a href="#" data-section="upload">Upload de Dados</a>
            <a href="#" data-section="dados-lotes">Dados Lotes</a>
        </nav>
    </header>
    <main>
        <section id="dashboard" class="container active">
            <h2>Filtros de Análise</h2>
            <div class="filters">
                <select id="nucleusFilter">
                    <option value="all">Todos os Núcleos</option>
                </select>
                <button id="applyFiltersBtn">Aplicar Filtros</button>
            </div>
            <div class="dashboard-cards">
                <div class="card"><h3>Total de Lotes</h3><p id="totalLotes">0</p></div>
                <div class="card error"><h3>Lotes em Risco</h3><p id="lotesRisco">0</p></div>
                <div class="card warning"><h3>Lotes em APP</h3><p id="lotesApp">0</p></div>
                <div class="card info"><h3>Custo de Intervenção</h3><p id="custoEstimado">R$ 0,00</p></div>
            </div>
            <h2>Visualização Geoespacial</h2>
            <div id="mapid"></div>
        </section>
        <section id="upload" class="container">
            <h2>Upload de Camadas</h2>
            <input type="file" id="geojsonFileInput" multiple>
            <button id="processAndLoadBtn">Processar</button>
        </section>
        <section id="dados-lotes" class="container">
            <h2>Dados Detalhados</h2>
            <table id="lotesDataTable">
                <thead>
                    <tr><th>Código</th><th>Núcleo</th></tr>
                </thead>
                <tbody></tbody>
            </table>
        </section>
    </main>
    <footer><p>&copy; 2023 GeoLaudo.AI</p></footer>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
    <script type="module" src="Js/app.js"></script>
</body>
</html>
Ação 2: Os Arquivos JavaScript Modulares

1. Js/utils.js

code
JavaScript
download
content_copy
expand_less
export function formatBRL(n) { return Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
// (Outras funções de utilidade podem ser adicionadas aqui)

2. Js/map.js

code
JavaScript
download
content_copy
expand_less
export function initMap(state) {
    state.map = L.map('mapid').setView([-15.7801, -47.9292], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '&copy; OpenStreetMap' }).addTo(state.map);
    state.layers.lotes = L.featureGroup().addTo(state.map);
    state.layers.app = L.featureGroup().addTo(state.map);
    state.layers.risco = L.featureGroup().addTo(state.map);
    state.layers.poligonais = L.featureGroup().addTo(state.map);
}

3. Js/layers.js

code
JavaScript
download
content_copy
expand_less
import { formatBRL } from './utils.js';

export function styleLote(feature) {
    const grau = Number(feature.properties.grau);
    let color;
    if (grau === 1) color = '#2ecc71';
    else if (grau === 2) color = '#f1c40f';
    else if (grau === 3) color = '#e67e22';
    else if (grau >= 4) color = '#e74c3c';
    else return { fillColor: '#3498db', weight: 1, color: 'white', fillOpacity: 0.3 };
    return { fillColor: color, weight: 2, color: 'white', fillOpacity: 0.7 };
}

export function onEachLoteFeature(feature, layer) {
    const p = feature.properties;
    let content = `<b>Cód:</b> ${p.cod_lote || 'N/A'}<br><b>Núcleo:</b> ${p.desc_nucleo || 'N/A'}`;
    if (p.grau) {
        content += `<br><b>Risco:</b> ${p.grau}<br><b>Custo:</b> ${formatBRL(p.valor)}`;
    }
    layer.bindPopup(content);
}

4. Js/dashboard.js

code
JavaScript
download
content_copy
expand_less
import { formatBRL } from './utils.js';

function filteredLotes(state) {
    return state.currentNucleusFilter === 'all' ? state.allLotes : state.allLotes.filter(f => f.properties.desc_nucleo === state.currentNucleusFilter);
}

export function refreshDashboard(state) {
    const feats = filteredLotes(state);
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
    document.getElementById('custoEstimado').textContent = formatBRL(custoTotal);
}

export function populateNucleusFilter(state) {
    const filterSelect = document.getElementById('nucleusFilter');
    filterSelect.innerHTML = '<option value="all">Todos os Núcleos</option>';
    Array.from(state.nucleusSet).sort().forEach(n => {
        filterSelect.innerHTML += `<option value="${n}">${n}</option>`;
    });
}

5. Js/table.js

code
JavaScript
download
content_copy
expand_less
function filteredLotes(state) {
    return state.currentNucleusFilter === 'all' ? state.allLotes : state.allLotes.filter(f => f.properties.desc_nucleo === state.currentNucleusFilter);
}

export function fillLotesTable(state) {
    const tbody = document.querySelector('#lotesDataTable tbody');
    tbody.innerHTML = '';
    const feats = filteredLotes(state);
    if (feats.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">Nenhum dado.</td></tr>';
        return;
    }
    tbody.innerHTML = feats.map(f => {
        const p = f.properties;
        return `<tr>
            <td>${p.cod_lote || 'N/A'}</td>
            <td>${p.desc_nucleo || 'N/A'}</td>
        </tr>`;
    }).join('');
}

6. Js/upload.js```javascript
import { styleLote, onEachLoteFeature } from './layers.js';
import { refreshDashboard, populateNucleusFilter } from './dashboard.js';
import { fillLotesTable } from './table.js';

export function initUpload(state) {
const fileInput = document.getElementById('geojsonFileInput');
const processBtn = document.getElementById('processAndLoadBtn');

code
Code
download
content_copy
expand_less
processBtn.addEventListener('click', async () => {
    const files = Array.from(fileInput.files || []);
    if (files.length === 0) return alert('Nenhum arquivo selecionado.');

    Object.values(state.layers).forEach(layer => layer.clearLayers());
    state.allLotes = [];
    state.allRisco = [];

    try {
        for (const file of files) {
            const text = await file.text();
            let geojsonData = JSON.parse(text);

            const name = file.name.toLowerCase();
            if (name.includes('risco')) {
                state.allRisco.push(...geojsonData.features);
            } else if (name.includes('lote')) {
                state.allLotes.push(...geojsonData.features);
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

        const allLayersGroup = L.featureGroup(Object.values(state.layers));
        if (allLayersGroup.getLayers().length > 0) state.map.fitBounds(allLayersGroup.getBounds());

        populateNucleusFilter(state);
        refreshDashboard(state);
        fillLotesTable(state);

    } catch (e) {
        console.error(e);
        alert(`Erro: ${e.message}`);
    }
});

}

code
Code
download
content_copy
expand_less
**7. `Js/app.js` (O Orquestrador Principal, Corrigido para sua Estrutura)**
```javascript
// **CORREÇÃO AQUI**: Removemos 'components/' dos caminhos de importação
import { initMap } from './map.js';
import { initUpload } from './upload.js';
import { refreshDashboard, populateNucleusFilter } from './dashboard.js';
import { fillLotesTable } from './table.js';

const state = {
    map: null,
    layers: {},
    allLotes: [],
    allRisco: [],
    nucleusSet: new Set(),
    currentNucleusFilter: 'all',
};

document.addEventListener('DOMContentLoaded', () => {
    initMap(state);
    initUpload(state);

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

    document.getElementById('applyFiltersBtn').addEventListener('click', () => {
        state.currentNucleusFilter = document.getElementById('nucleusFilter').value; 
        refreshDashboard(state);
        fillLotesTable(state);
    });

    document.getElementById('nucleusFilter').addEventListener('change', () => {
        state.currentNucleusFilter = document.getElementById('nucleusFilter').value; 
        refreshDashboard(state);
        fillLotesTable(state);
    });
    
    document.getElementById('dashboard').classList.add('active');
    document.querySelector('nav a[data-section="dashboard"]').classList.add('active');
});
Instruções Finais:

Substitua o index.html pelo código completo.

Substitua CADA UM dos arquivos .js com os códigos correspondentes.

Faça o upload de todos os arquivos alterados para o seu repositório no GitHub.

Com esta estrutura, o aplicativo deve carregar corretamente.
