import { initMap } from './map.js';
import { initUpload } from './upload.js';
import { refreshDashboard, populateNucleusFilter } from './dashboard.js';
import { fillLotesTable } from './table.js';
import { initNav } from './nav.js';
import { initLegendToggles } from './layers.js';

// Objeto de estado global que será compartilhado
const state = {
    map: null,
    layers: {},
    allLotes: [],
    allRisco: [],
    nucleusSet: new Set(),
    currentNucleusFilter: 'all',
};

// Ponto de Entrada Principal do Aplicativo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todos os módulos na ordem correta
    initMap(state);
    initNav(state);
    initUpload(state);
    initLegendToggles(state);
    
    // Configura os listeners dos filtros
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
    
    // Define o estado inicial da UI
    document.getElementById('dashboard').classList.add('active');
    document.querySelector('nav a[data-section="dashboard"]').classList.add('active');
    populateNucleusFilter(state);
    refreshDashboard(state);
    fillLotesTable(state);
    console.log("Aplicativo modularizado iniciado!");
});
