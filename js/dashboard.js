import { formatBRL } from '../utils.js';

function filteredLotes(state) {
    return state.currentNucleusFilter === 'all' ? state.allLotes : state.allLotes.filter(f => f.properties.desc_nucleo === state.currentNucleusFilter);
}

export function refreshDashboard(state) {
    const feats = filteredLotes(state);
    let riskCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let custoTotal = 0, lotesAppCount = 0;

    feats.forEach(f => {
        const p = f.properties;
        const grau = Number(p.grau);
        if (grau >= 1 && grau <= 4) riskCounts[grau]++;
        if (Number(p.dentro_app) > 0) lotesAppCount++;
        custoTotal += Number(p.valor) || 0;
    });

    const totalRisco = riskCounts[2] + riskCounts[3] + riskCounts[4];
    document.getElementById('totalLotes').textContent = feats.length;
    document.getElementById('lotesRisco').textContent = totalRisco;
    document.getElementById('lotesApp').textContent = lotesAppCount;
    document.getElementById('custoEstimado').textContent = formatBRL(custoTotal);

    const riskAnalysisList = document.getElementById('riskAnalysisSummary');
    riskAnalysisList.innerHTML = '';
    const riskMapping = {
        1: { text: 'Baixo Risco' },
        2: { text: 'Médio Risco' },
        3: { text: 'Alto Risco' },
        4: { text: 'Muito Alto Risco' }
    };
    for (const level of [1, 2, 3, 4]) {
        const count = riskCounts[level];
        const li = document.createElement('li');
        li.textContent = `${riskMapping[level].text}: ${count} lotes`;
        riskAnalysisList.appendChild(li);
    }
}

export function populateNucleusFilter(state) {
    const filterSelect = document.getElementById('nucleusFilter');
    filterSelect.innerHTML = '<option value="all">Todos os Núcleos</option>';
    Array.from(state.nucleusSet).sort().forEach(n => {
        filterSelect.innerHTML += `<option value="${n}">${n}</option>`;
    });
}
