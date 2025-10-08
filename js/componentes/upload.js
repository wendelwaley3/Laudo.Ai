import { styleLote, onEachLoteFeature } from './layers.js';
import { refreshDashboard, populateNucleusFilter } from './dashboard.js';
import { fillLotesTable } from './table.js';

export function initUpload(state) {
    const fileInput = document.getElementById('geojsonFileInput');
    const processBtn = document.getElementById('processAndLoadBtn');
    
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
