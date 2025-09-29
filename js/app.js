import { initMap } from './components/map.js';
import { initUpload } from './components/upload.js';
import { refreshDashboard, populateNucleusFilter } from './components/dashboard.js';
import { fillLotesTable } from './components/table.js';

// Objeto de estado global que será compartilhado entre os módulos
const state = {
    map: null,
    layers: {},
    allLotes: [],
    allRisco: [],
    nucleusSet: new Set(),
    currentNucleusFilter: 'all',
    utmOptions: { useUtm: false, zone: 23, south: true },
};

// Ponto de Entrada Principal do Aplicativo
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
    
    // Estado inicial
    document.getElementById('dashboard').classList.add('active');
    document.querySelector('nav a[data-section="dashboard"]').classList.add('active');
    populateNucleusFilter(state);
    refreshDashboard(state);
    fillLotesTable(state);
    console.log("Aplicativo modularizado iniciado!");
});
