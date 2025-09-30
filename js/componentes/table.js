export function fillLotesTable(state) {
    const tbody = document.querySelector('#lotesDataTable tbody');
    tbody.innerHTML = '';
    if (state.allLotes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">Nenhum dado.</td></tr>';
        return;
    }
    tbody.innerHTML = state.allLotes.map(f => {
        const p = f.properties;
        return `<tr>
            <td>${p.cod_lote || 'N/A'}</td>
            <td>${p.desc_nucleo || 'N/A'}</td>
        </tr>`;
    }).join('');
}
