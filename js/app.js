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
