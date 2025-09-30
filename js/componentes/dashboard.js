import { formatBRL } from '../utils.js';

function filteredLotes(state) {
    return state.currentNucleusFilter === 'all' ? state.allLotes : state.allLotes.filter(f => f.properties.desc_nucleo === state.currentNucleusFilter);
}

export function refreshDashboard(state) {
    const feats = filteredLotes(state);
    let riskCounts = { 'Baixo': 0, 'Médio': 0, 'Alto': 0, 'Muito Alto': 0 };
    let custoTotal = 0, lotesAppCount = 0, custoMin = Infinity, custoMax = -Infinity;
    let tiposUsoCounts = {};

    feats.forEach(f => {
        const p = f.properties;
        const grau = Number(p.grau);
        if (grau === 1) riskCounts['Baixo']++;
        else if (grau === 2) riskCounts['Médio']++;
        else if (grau === 3) riskCounts['Alto']++;
        else if (grau >= 4) riskCounts['Muito Alto']++;
        
        if (Number(p.dentro_app) > 0) lotesAppCount++;
        
        const valorCusto = Number(p.valor || 0);
        if (valorCusto > 0) {
            custoTotal += valorCusto;
            if (valorCusto < custoMin) custoMin = valorCusto;
            if (valorCusto > custoMax) custoMax = valorCusto;
        }

        const tipoUso = p.tipo_uso || 'Não informado';
        tiposUsoCounts[tipoUso] = (tiposUsoCounts[tipoUso] || 0) + 1;
    });

    const totalRisco = riskCounts['Médio'] + riskCounts['Alto'] + riskCounts['Muito Alto'];
    
    // Atualiza os Cards
    document.getElementById('totalLotes').textContent = feats.length;
    document.getElementById('lotesRisco').textContent = totalRisco;
    document.getElementById('lotesApp').textContent = lotesAppCount;
    document.getElementById('custoEstimado').textContent = formatBRL(custoTotal);

    // Atualiza a Análise de Riscos
    const riskAnalysisList = document.getElementById('riskAnalysisSummary');
    riskAnalysisList.innerHTML = '';
    for (const level of ['Baixo', 'Médio', 'Alto', 'Muito Alto']) {
        const count = riskCounts[level];
        const li = document.createElement('li');
        li.textContent = `${level} Risco: ${count} lotes`;
        riskAnalysisList.appendChild(li);
    }

    // Atualiza o Resumo de Intervenções
    document.getElementById('minCustoIntervencao').textContent = `Custo Mínimo de Intervenção: ${custoMin === Infinity ? 'N/D' : formatBRL(custoMin)}`;
    document.getElementById('maxCustoIntervencao').textContent = `Custo Máximo de Intervenção: ${custoMax === -Infinity ? 'N/D' : formatBRL(custoMax)}`;

    // Atualiza a Análise de Tipos de Uso
    const tiposUsoList = document.getElementById('tiposUsoSummary');
    tiposUsoList.innerHTML = '';
    const sortedTiposUso = Object.entries(tiposUsoCounts).sort(([,a],[,b]) => b - a);
    for (const [tipo, count] of sortedTiposUso) {
        const percentage = feats.length > 0 ? ((count / feats.length) * 100).toFixed(1) : 0;
        const li = document.createElement('li');
        li.textContent = `${tipo}: ${count} unidades (${percentage}%)`;
        tiposUsoList.appendChild(li);
    }
}

export function populateNucleusFilter(state) {
    const filterSelect = document.getElementById('nucleusFilter');
    filterSelect.innerHTML = '<option value="all">Todos os Núcleos</option>';
    Array.from(state.nucleusSet).sort().forEach(n => {
        filterSelect.innerHTML += `<option value="${n}">${n}</option>`;
    });
}
