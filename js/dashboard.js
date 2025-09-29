function refreshDashboard() {
    const feats = filteredLotes();
    const totalLotesCount = feats.length;

    let lotesRiscoAltoMuitoAlto = 0; 
    let lotesAppCount = 0;
    let custoTotal = 0;
    let custoMin = Infinity;
    let custoMax = -Infinity;
    let riskCounts = { 'Baixo': 0, 'Médio': 0, 'Alto': 0, 'Muito Alto': 0 };
    let tiposUsoCounts = {};

    feats.forEach(f => {
        const p = f.properties || {};
        
        const risco = String(p.risco || p.status_risco || p.grau || '').toLowerCase();
        if (risco && risco !== 'n/a' && risco !== '') {
            if (risco.includes('baixo') || risco === '1') riskCounts['Baixo']++;
            else if (risco.includes('médio') || risco === '2') riskCounts['Médio']++;
            else if (risco.includes('alto') && !risco.includes('muito') || risco === '3') riskCounts['Alto']++;
            else if (risco.includes('muito alto') || risco === '4') riskCounts['Muito Alto']++;
        }
        if (risco.includes('alto') || risco === '3' || risco.includes('muito alto') || risco === '4') {
            lotesRiscoAltoMuitoAlto++;
        }
        
        const dentroApp = Number(p.dentro_app || p.app || 0); 
        if (dentroApp > 0) lotesAppCount++;

        const valorCusto = Number(p.valor || p.custo_intervencao || 0); 
        if (!isNaN(valorCusto) && valorCusto > 0) { 
            custoTotal += valorCusto;
            if (valorCusto < custoMin) custoMin = valorCusto;
            if (valorCusto > custoMax) custoMax = valorCusto;
        }

        const tipoUso = p.tipo_uso || 'Não informado';
        tiposUsoCounts[tipoUso] = (tiposUsoCounts[tipoUso] || 0) + 1;
    });

    // Atualiza os Cards
    document.getElementById('totalLotes').textContent = totalLotesCount;
    document.getElementById('lotesRisco').textContent = lotesRiscoAltoMuitoAlto;
    document.getElementById('lotesApp').textContent = lotesAppCount;
    document.getElementById('custoEstimado').textContent = formatBRL(custoTotal);

    // Atualiza a Análise de Riscos
    const riskAnalysisList = document.getElementById('riskAnalysisSummary');
    riskAnalysisList.innerHTML = '';
    const riskMapping = {
        'Baixo': { text: 'Baixo Risco', class: 'risk-low' },
        'Médio': { text: 'Médio Risco', class: 'risk-medium' },
        'Alto': { text: 'Alto Risco', class: 'risk-high' },
        'Muito Alto': { text: 'Muito Alto Risco', class: 'risk-very-high' }
    };
    for (const level of ['Baixo', 'Médio', 'Alto', 'Muito Alto']) {
        const count = riskCounts[level];
        const li = document.createElement('li');
        li.className = riskMapping[level].class;
        li.textContent = `${riskMapping[level].text}: ${count} lotes`;
        riskAnalysisList.appendChild(li);
    }

    // Atualiza o Resumo de Intervenções
    document.getElementById('minCustoIntervencao').textContent = `Custo Mínimo de Intervenção: ${custoMin === Infinity ? 'N/D' : formatBRL(custoMin)}`;
    document.getElementById('maxCustoIntervencao').textContent = `Custo Máximo de Intervenção: ${custoMax === -Infinity ? 'N/D' : formatBRL(custoMax)}`;
    document.getElementById('areasIdentificadas').textContent = `${lotesRiscoAltoMuitoAlto} áreas de risco identificadas`;
    document.getElementById('areasIntervencao').textContent = `${lotesRiscoAltoMuitoAlto} áreas demandam intervenção estrutural`;

    // Atualiza a Análise de Tipos de Uso
    const tiposUsoList = document.getElementById('tiposUsoSummary');
    tiposUsoList.innerHTML = '';
    if (Object.keys(tiposUsoCounts).length > 0) {
        const sortedTiposUso = Object.entries(tiposUsoCounts).sort(([,a],[,b]) => b - a);
        for (const [tipo, count] of sortedTiposUso) {
            const percentage = totalLotesCount > 0 ? ((count / totalLotesCount) * 100).toFixed(1) : 0;
            const li = document.createElement('li');
            li.textContent = `${tipo}: ${count} unidades (${percentage}%)`;
            tiposUsoList.appendChild(li);
        }
    } else {
        tiposUsoList.innerHTML = "<li>Nenhum dado de tipo de uso disponível.</li>";
    }
}
