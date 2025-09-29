function filteredLotes(state) {
    return state.currentNucleusFilter === 'all' ? state.allLotes : state.allLotes.filter(f => f.properties.desc_nucleo === state.currentNucleusFilter);
}

export function fillLotesTable(state) {
    const tbody = document.querySelector('#lotesDataTable tbody');
    tbody.innerHTML = '';
    const feats = filteredLotes(state);
    if (feats.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Nenhum dado.</td></tr>';
        return;
    }
    tbody.innerHTML = feats.map(f => {
        const p = f.properties;
        return `<tr>
            <td>${p.cod_lote || 'N/A'}</td>
            <td>${p.desc_nucleo || 'N/A'}</td>
            <td>${p.tipo_uso || 'N/A'}</td>
            <td>${p.area_m2 ? p.area_m2.toLocaleString('pt-BR') : 'N/A'}</td>
            <td>${p.grau || 'N/A'}</td>
            <td>${Number(p.dentro_app) > 0 ? 'Sim' : 'Não'}</td>
            <td><button class="zoomLoteBtn small-btn" data-codlote="${p.cod_lote}">Ver</button></td>
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
