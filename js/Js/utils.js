export function formatBRL(n) {
    return Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ensurePolygonClosed(coords) {
    if (!coords || coords.length === 0) return coords;
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
        coords.push(first);
    }
    return coords;
}

function utmToLngLat(x, y, zone, south) {
    if (isNaN(x) || isNaN(y)) return null;
    const def = `+proj=utm +zone=${Number(zone)} ${south ? '+south ' : ''}+datum=WGS84 +units=m +no_defs`;
    return proj4(def, proj4.WGS84, [x, y]);
}

export function reprojectGeoJSONFromUTM(geojson, zone, south) {
    const converted = JSON.parse(JSON.stringify(geojson));
    const convertGeometryCoords = (coords, geomType) => {
        if (!coords || coords.length === 0) return coords;
        try {
            if (geomType === 'Point') return utmToLngLat(coords[0], coords[1], zone, south);
            if (geomType === 'LineString' || geomType === 'MultiPoint') return coords.map(c => utmToLngLat(c[0], c[1], zone, south)).filter(Boolean);
            if (geomType === 'Polygon') return coords.map(ring => ensurePolygonClosed(ring.map(c => utmToLngLat(c[0], c[1], zone, south)).filter(Boolean)));
            if (geomType === 'MultiLineString') return coords.map(line => line.map(c => utmToLngLat(c[0], c[1], zone, south)).filter(Boolean));
            if (geomType === 'MultiPolygon') return coords.map(poly => poly.map(ring => ensurePolygonClosed(ring.map(c => utmToLngLat(c[0], c[1], zone, south)).filter(Boolean))));
        } catch (e) { return null; }
        return coords;
    };
    if (converted.type === 'FeatureCollection') {
        converted.features.forEach(f => {
            if (f.geometry) f.geometry.coordinates = convertGeometryCoords(f.geometry.coordinates, f.geometry.type);
        });
    }
    return converted;
}
