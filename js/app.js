import { initMap } from './components/map.js';
// Futuramente, importaremos as outras funções aqui
// import { initUpload } from './components/upload.js';

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
    console.log("Aplicativo modularizado iniciado!");
    
    // Inicializa o mapa, passando o objeto 'state' para que ele possa ser modificado
    initMap(state);

    // Futuramente, chamaremos as outras funções de inicialização aqui
    // initNav(state);
    // initUpload(state);
});
