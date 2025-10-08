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
