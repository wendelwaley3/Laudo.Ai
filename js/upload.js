
import { reprojectGeoJSONFromUTM } from '../utils.js';
import { styleApp, onEachAppFeature, stylePoligonal, onEachPoligonalFeature, styleLote, onEachLoteFeature } from './layers.js';
import { populateNucleusFilter, refreshDashboard } from './dashboard.js';
import { fillLotesTable } from './table.js';

export function initUpload(state) {
    const fileInput = document.getElementById('geojsonFileInput');
    const selectBtn = document.getElementById('selectFilesVisibleButton');
    const processBtn = document.getElementById('processAndLoadBtn');
    const fileListEl = document.getElementById('fileList');
    const statusEl = document.getElementById('uploadStatus');
    const useUtmCheck = document.getElementById('useUtmCheckbox');

    if (selectBtn) selectBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        fileListEl.innerHTML = Array.from(fileInput.files).map(f => `<li>${f.name}</li>`).join('') || '<li>Nenhum arquivo selecionado.</li>';
    });

    processBtn.addEventListener('click', async () => {
        const files = Array.from(fileInput.files || []);
        if (files.length === 0) {
            statusEl.textContent = 'Nenhum arquivo selecionado.';
            statusEl.className = 'status-message error';
            return;
        }
        statusEl.textContent = 'Processando...';
        statusEl.className = 'status-message info';

        Object.values(state.layers).forEach(layer => layer.clearLayers());
        state.allLotes = [];
        state.allRisco = [];
        state.nucleusSet.clear();

        try {
            for (const file of files) {
                const text = await file.text();
                let geojsonData = JSON.parse(text);

                if (useUtmCheck.checked) {
                    const zone = document.getElementById('utmZoneInput').value;
                    const south = document.getElementById('utmHemisphereSelect').value === 'S';
                    geojsonData = reprojectGeoJSONFromUTM(geojsonData, zone, south);
                }

                const name = file.name.toLowerCase();
                if (name.includes('risco')) {
                    state.allRisco.push(...geojsonData.features);
                } else if (name.includes('lote')) {
                    state.allLotes.push(...geojsonData.features);
                } else if (name.includes('app')) {
                    L.geoJSON(geojsonData, { style: styleApp, onEachFeature: onEachAppFeature }).addTo(state.layers.app);
                } else if (name.includes('poligonal')) {
                    L.geoJSON(geojsonData, { style: stylePoligonal, onEachFeature: onEachPoligonalFeature }).addTo(state.layers.poligonais);
                }
            }
            
            const lotesMap = new Map();
            state.allLotes.forEach(lote => lotesMap.set(lote.properties.cod_lote, lote));
            state.allRisco.forEach(riscoLote => {
                const codLote = riscoLote.properties.cod_lote;
                if (lotesMap.has(codLote)) {
                    Object.assign(lotesMap.get(codLote).properties, riscoLote.properties);
                } else {
                    lotesMap.set(codLote, riscoLote);
                }
            });
            state.allLotes = Array.from(lotesMap.values());

            L.geoJSON(state.allLotes, { style: styleLote, onEachFeature: onEachLoteFeature }).addTo(state.layers.lotes);
            state.allLotes.forEach(f => {
                if (f.properties.desc_nucleo) state.nucleusSet.add(f.properties.desc_nucleo);
            });

            const allLayersGroup = L.featureGroup(Object.values(state.layers));
            if (allLayersGroup.getLayers().length > 0) state.map.fitBounds(allLayersGroup.getBounds(), { padding: [20, 20] });

            populateNucleusFilter(state);
            refreshDashboard(state);
            fillLotesTable(state);

            statusEl.textContent = 'Dados carregados com sucesso!';
            statusEl.className = 'status-message success';
        } catch (e) {
            statusEl.textContent = `Erro: ${e.message}`;
            statusEl.className = 'status-message error';
            console.error(e);
        }
    });
}
