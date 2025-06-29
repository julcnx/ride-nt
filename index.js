// === PASSWORD STORAGE ===
const PASSWORD = "rident123";
const STORAGE_KEY_AUTH = "tmt_auth";
const STORAGE_KEY_VIEW = "tmt_map_view";
const STORAGE_KEY_BASE = "tmt_base_layer";
const STORAGE_KEY_OVERLAYS = "tmt_overlays";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function isPasswordValid() {
  const stored = localStorage.getItem(STORAGE_KEY_AUTH);
  if (!stored) return false;
  try {
    const { password, expires } = JSON.parse(stored);
    return password === PASSWORD && Date.now() < expires;
  } catch {
    return false;
  }
}

function storePassword() {
  const expires = Date.now() + ONE_WEEK_MS;
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify({ password: PASSWORD, expires }));
}

if (!isPasswordValid()) {
  const input = prompt("Enter password to view the map:");
  if (input !== PASSWORD) {
    alert("Incorrect password. Access denied.");
    document.body.innerHTML = "<h2 style='text-align:center;margin-top:20%'>Access Denied</h2>";
    throw new Error("Unauthorized");
  }
  storePassword();
}

// === MAP INITIALIZATION ===
document.getElementById('map').style.display = 'block';

const GOOGLE_LAYERS = {
  satellite: 'y',
  terrain: 'p'
};

const map = L.map('map', {
  minZoom: 9,
});

// Restore previous position
const savedView = localStorage.getItem(STORAGE_KEY_VIEW);
if (savedView) {
  try {
    const { center, zoom } = JSON.parse(savedView);
    map.setView(center, zoom);
  } catch (e) {
    console.warn('Invalid saved view in localStorage');
  }
} else {
  map.setView([18.79, 98.98], 10);
}

// Base Layers
const googleSatellite = L.tileLayer(
  'https://mt{s}.google.com/vt?lyrs=' + GOOGLE_LAYERS.satellite + '&x={x}&y={y}&z={z}', {
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Satellite'
  }
);

const googleTerrain = L.tileLayer(
  'https://mt{s}.google.com/vt?lyrs=' + GOOGLE_LAYERS.terrain + '&x={x}&y={y}&z={z}', {
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Terrain',
    opacity: 0.7
  }
);

const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  subdomains: ['a', 'b', 'c'],
  attribution: '&copy; OpenStreetMap contributors'
});

// Overlays
const customTiles = L.tileLayer('./tiles/{z}/{x}/{y}.png', {
  tileSize: 256,
  opacity: 1,
  minNativeZoom: 10,
  maxNativeZoom: 13,
  attribution: 'GPX Overlay'
});

const googleStreetViewTiles = L.tileLayer(
  'https://mts{s}.googleapis.com/vt?hl=en-US&lyrs=svv|cb_client:apiv3&style=40,18&x={x}&y={y}&z={z}', {
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google Street View',
    maxZoom: 20,
    opacity: 0.7
  }
);

const baseLayers = {
  'Google Terrain': googleTerrain,
  'Google Satellite': googleSatellite,
  'OSM Standard': osmStandard
};

const overlays = {
  'TMT Overlay': customTiles,
  'Google Street View': googleStreetViewTiles
};

// Add layers control expanded
L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

// === Restore base layer and overlays ===
let currentBaseLayer;

// Restore base layer
const savedBaseLayerName = localStorage.getItem(STORAGE_KEY_BASE);
if (savedBaseLayerName && baseLayers[savedBaseLayerName]) {
  baseLayers[savedBaseLayerName].addTo(map);
  currentBaseLayer = baseLayers[savedBaseLayerName];
} else {
  // Default to Google Terrain
  googleTerrain.addTo(map);
  currentBaseLayer = googleTerrain;
}

// Restore overlays
const savedOverlaysJSON = localStorage.getItem(STORAGE_KEY_OVERLAYS);
let savedOverlays = [];
try {
  savedOverlays = savedOverlaysJSON ? JSON.parse(savedOverlaysJSON) : [];
} catch {}

// If no saved overlays, enable 'TMT Overlay' by default
if (!savedOverlays.length) {
  customTiles.addTo(map);
  savedOverlays = ['TMT Overlay'];
} else {
  Object.entries(overlays).forEach(([name, layer]) => {
    if (savedOverlays.includes(name)) {
      layer.addTo(map);
    }
  });
}

// Track current base layer
map.on('baselayerchange', function (e) {
  currentBaseLayer = e.layer;
  // Save selected base layer name
  const selectedName = Object.entries(baseLayers).find(([k,v]) => v === currentBaseLayer)?.[0];
  if (selectedName) localStorage.setItem(STORAGE_KEY_BASE, selectedName);
});

// Track overlays toggle changes to save
map.on('overlayadd overlayremove', function () {
  const activeOverlays = Object.entries(overlays)
    .filter(([name, layer]) => map.hasLayer(layer))
    .map(([name]) => name);
  localStorage.setItem(STORAGE_KEY_OVERLAYS, JSON.stringify(activeOverlays));
});

// Save map view on move/zoom
map.on('moveend zoomend', () => {
  const view = {
    center: map.getCenter(),
    zoom: map.getZoom()
  };
  localStorage.setItem(STORAGE_KEY_VIEW, JSON.stringify(view));
});

// === CONTEXT MENU ===
const contextMenu = document.getElementById('context-menu');

function addMenuItem(label, action) {
  const item = document.createElement('div');
  item.innerText = label;
  item.onclick = () => {
    action();
    contextMenu.style.display = 'none';
  };
  contextMenu.appendChild(item);
}

map.on('contextmenu', function (e) {
  const lat = e.latlng.lat.toFixed(6);
  const lng = e.latlng.lng.toFixed(6);
  contextMenu.innerHTML = '';

  addMenuItem('Edit in OpenStreetMap', () => {
    window.open(`https://www.openstreetmap.org/edit?editor=id&lat=${lat}&lon=${lng}&zoom=18`, '_blank');
  });

  addMenuItem('Copy Coordinates', () => {
    navigator.clipboard.writeText(`${lat}, ${lng}`).then(() => {
      alert('Coordinates copied to clipboard.');
    });
  });

  addMenuItem('Open in Google Maps', () => {
    const isSatellite = currentBaseLayer === googleSatellite;
    const mapType = isSatellite ? '&t=k' : ''; // 'k' = satellite
    window.open(`https://maps.google.com/?q=${lat},${lng}${mapType}`, '_blank');
  });

  addMenuItem('Open in Google Street View', () => {
    window.open(`https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}`, '_blank');
  });

  contextMenu.style.left = e.originalEvent.pageX + 'px';
  contextMenu.style.top = e.originalEvent.pageY + 'px';
  contextMenu.style.display = 'block';
});

map.on('click', () => contextMenu.style.display = 'none');
document.addEventListener('click', () => contextMenu.style.display = 'none');

// === Toggle overlays on 'O' key press ===
function toggleOverlays() {
  const anyVisible = Object.values(overlays).some(layer => map.hasLayer(layer));
  if (anyVisible) {
    Object.values(overlays).forEach(layer => map.removeLayer(layer));
  } else {
    Object.values(overlays).forEach(layer => map.addLayer(layer));
  }
}

document.addEventListener('keydown', (e) => {
  const active = document.activeElement;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

  if (e.key.toLowerCase() === 'o') {
    toggleOverlays();
  } else if (e.key === 'Delete') {
    // Clear only the keys we use, then reload
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_VIEW);
    localStorage.removeItem(STORAGE_KEY_BASE);
    localStorage.removeItem(STORAGE_KEY_OVERLAYS);
    location.reload();
  }
});

// === Legend with speed colors ===

const SPEED_COLOR_CONFIG = [
  { max: 7, color: 'rgba(128, 0, 128, OPACITY)' },     // Magenta (very technical)
  { max: 15, color: 'rgba(255, 40, 40, OPACITY)' },    // Red (slow dirt)
  { max: 30, color: 'rgba(255, 179, 0, OPACITY)' },    // Amber (moderate/fast dirt)
  { max: Infinity, color: 'rgba(0, 140, 60, OPACITY)' } // Dark green (very fast dirt)
];

const MAYBE_COLOR = 'rgba(160,160,160,1)';
const PAVED_COLOR = 'rgba(51, 102, 255, 1)'; // Confirmed vibrant blue

const legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
  const div = L.DomUtil.create('div', 'info legend');
  div.style.background = 'rgba(255, 255, 255, 0.9)';
  div.style.padding = '8px';
  div.style.borderRadius = '5px';
  div.style.fontSize = '14px';
  div.style.color = '#333';
  div.style.lineHeight = '1.4';
  div.style.width = '250px';

  const opacity = 1; // full opacity for legend swatches

  function colorBox(color) {
    return `<span style="
      display:inline-block;
      width:14px;
      height:10px;
      margin-right:8px;
      background-color:${color.replace('OPACITY', opacity)};
      vertical-align:middle;
    "></span>`;
  }

  let html = '<b>RideNT Legend</b><br/><br/>';

  html += `${colorBox(PAVED_COLOR)} Paved<br>`;
  // html += `<hr style="margin:6px 0">`;
  html += `${colorBox('rgba(0,140,60,OPACITY)')} Very fast dirt <span class="caption">&gt;30km/h</span> <br>`;
  html += `${colorBox('rgba(255,179,0,OPACITY)')} Moderate/Fast dirt <span class="caption">15-30 km/h</span><br>`;
  html += `${colorBox('rgba(255,40,40,OPACITY)')} Slow dirt <span class="caption">7-15 km/h</span><br>`;
  html += `${colorBox('rgba(128,0,128,OPACITY)')} Very technical <span class="caption">&lt;7 km/h</span><br>`;
  html += `${colorBox(MAYBE_COLOR)} Potential trail<br>`;
  html += `<br><span class="caption">Speeds are approximate, calculated from GPX trails in dry conditions, with weather and rider speed factors considered, but accuracy is not guaranteed.</span>`;

  div.innerHTML = html;
  return div;
};

legend.addTo(map);