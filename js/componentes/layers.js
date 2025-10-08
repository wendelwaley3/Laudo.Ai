import { formatBRL } from './utils.js';

export function styleLote(feature) {
    const grau = Number(feature.properties.grau);
    let color;
    if (grau === 1) color = '#2ecc71';
    else if (grau === 2) color = '#f1c40f';
    else if (grau === 3) color = '#e67e22';
    else if (grau >= 4) color = '#e74c3c';
    else return { fillColor: '#3498db', weight: 1, color: 'white', fillOpacity: 0.3 };
    return { fillColor: color, weight: 2, color: 'white', fillOpacity: 0.7 };
}

export function onEachLoteFeature(feature, layer) {
    const p = feature.properties;
    let content = `<b>Cód:</b> ${p.cod_lote || 'N/A'}<br><b>Núcleo:</b> ${p.desc_nucleo || 'N/A'}`;
    if (p.grau) {
        content += `<br><b>Risco:</b> ${p.grau}<br><b>Custo:</b> ${formatBRL(p.valor)}`;
    }
    layer.bindPopup(content);
}
