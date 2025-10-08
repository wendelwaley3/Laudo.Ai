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
});```

---

### **Instruções:**

1.  **Substitua o `index.html`** pelo código completo que forneci.
2.  **Substitua o `Js/app.js`** pelo código orquestrador principal.
3.  **Verifique se os outros arquivos `.js` modulares** (`map.js`, `upload.js`, `dashboard.js`, etc.) estão com os códigos que te enviei anteriormente.
4.  **Salve todos os arquivos.**
5.  **Faça o upload de todos os arquivos alterados** para o seu repositório no GitHub.

**Resultado Esperado:**

*   A interface completa e estilizada será restaurada.
*   O mapa base irá aparecer.
*   As abas e o botão de upload voltarão a funcionar.
