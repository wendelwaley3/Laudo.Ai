import { formatBRL } from '../utils.js';

export function stylePoligonal() { return { fillColor: '#95a5a6', color: '#7f8c8d', weight: 1.5, opacity: 0.8, fillOpacity: 0.1, dashArray: '5, 5' }; }
export function styleApp() { return { fillColor: '#16a085', color: '#117a65', weight: 2, opacity: 1, fillOpacity: 0.6, dashArray: '4, 4' }; }

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

export function onEachPoligonalFeature(feature, layer) {
    const p = feature.properties;
    layer.bindPopup(`<h3>Poligonal</h3><b>Município:</b> ${p.municipio || 'N/A'}`);
}
export function onEachAppFeature(feature, layer) {
    layer.bindPopup(`<h3>APP</h3><b>ID:</b> ${feature.properties.id || 'N/A'}`);
}
export function onEachLoteFeature(feature, layer) {
    const p = feature.properties;
    let content = `<h3>Detalhes do Lote</h3>`;
    content += `<b>Código:</b> ${p.cod_lote || 'N/A'}<br>`;
    content += `<b>Núcleo:</b> ${p.desc_nucleo || 'N/A'}<br>`;
    if (p.grau) {
        content += `<b>Grau de Risco:</b> ${p.grau}<br>`;
        content += `<b>Custo:</b> ${formatBRL(p.valor)}<br>`;
    }
    layer.bindPopup(content);
}
