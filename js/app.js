// **CORREÇÃO AQUI**: Removemos 'components/' dos caminhos de importação
import { reprojectGeoJSONFromUTM } from './utils.js';
import { initMap } from './map.js';
import { styleApp, onEachAppFeature, stylePoligonal, onEachPoligonalFeature, styleLote, onEachLoteFeature } from './layers.js';
import { populateNucleusFilter, refreshDashboard } from './dashboard.js';
import { fillLotesTable } from './table.js';
import { initUpload } from './upload.js';
import { initNav } from './nav.js'; // Assumindo que você criará um nav.js
import { initGeneralInfoForm } from './info.js'; // Assumindo que você criará um info.js
import { initLegendToggles } from './legend.js'; // Assumindo que você criará um legend.js
import { gerarRelatorio } from './report.js'; // Assumindo que você criará um report.js

// Objeto de estado global que será compartilhado entre os módulos
const state = {
    map: null,
    layers: {},
    allLotes: [],
    allRisco: [],
    nucleusSet: new Set(),
    currentNucleusFilter: 'all',
    utmOptions: { useUtm: false, zone: 23, south: true },
    generalProjectInfo: {},
    lastReportText: '',
};

// Ponto de Entrada Principal do Aplicativo
document.addEventListener('DOMContentLoaded', () => {
    initMap(state);
    initNav(state);
    initUpload(state);
    initLegendToggles(state);
    initGeneralInfoForm(state);
    
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
    
    document.getElementById('generateReportBtn').addEventListener('click', () => gerarRelatorio(state));
    
    // Estado inicial
    document.getElementById('dashboard').classList.add('active');
    document.querySelector('nav a[data-section="dashboard"]').classList.add('active');
    populateNucleusFilter(state);
    refreshDashboard(state);
    fillLotesTable(state);
    console.log("Aplicativo modularizado iniciado!");
});
import { initMap } from './components/map.js';
import { initUpload } from './components/upload.js';
import { refreshDashboard, populateNucleusFilter } from './components/dashboard.js';
import { fillLotesTable } from './components/table.js';

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
