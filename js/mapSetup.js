import { regionBounds } from "./config.js";
import { baseLayers, overlays } from "./layers.js";

const STORAGE_KEY_VIEW = "rident_map_view";
const STORAGE_KEY_BASE = "rident_base_layer";
const STORAGE_KEY_OVERLAYS = "rident_overlays";

export function initializeMap() {
  document.getElementById("map").style.display = "block";

  const map = createMap();
  setInitialView(map);

  const overlaysControl = L.control
    .layers(baseLayers, overlays, { collapsed: true, autoZIndex: false })
    .addTo(map);

  const currentBaseLayer = restoreLayerSelection(map, baseLayers, overlays);
  setupEventListeners(map, baseLayers, overlays);

  return { map, baseLayers, overlays, currentBaseLayer, overlaysControl };
}

function createMap() {
  const map = L.map("map", {
    minZoom: 9,
    maxBounds: L.latLngBounds(regionBounds),
  });
  map.attributionControl.setPrefix("");
  return map;
}

function setInitialView(map) {
  const hashMatch = location.hash.match(/^#(\d+)\/([-\d.]+)\/([-\d.]+)$/);
  if (hashMatch) {
    const zoom = +hashMatch[1];
    const lat = +hashMatch[2];
    const lng = +hashMatch[3];
    map.setView([lat, lng], zoom);
    return;
  }

  const saved = localStorage.getItem(STORAGE_KEY_VIEW);
  if (saved) {
    try {
      const { center, zoom } = JSON.parse(saved);
      map.setView(center, zoom);
      return;
    } catch {}
  }

  map.setView([18.79, 98.98], 10);
}

function restoreLayerSelection(map, baseLayers, overlays) {
  let currentBaseLayer;

  const baseName = localStorage.getItem(STORAGE_KEY_BASE);
  if (baseName && baseLayers[baseName]) {
    baseLayers[baseName].addTo(map);
    currentBaseLayer = baseLayers[baseName];
  } else {
    baseLayers["Google Terrain"].addTo(map);
    currentBaseLayer = baseLayers["Google Terrain"];
  }

  const overlayJSON = localStorage.getItem(STORAGE_KEY_OVERLAYS);
  let savedOverlays = [];
  try {
    savedOverlays = overlayJSON ? JSON.parse(overlayJSON) : [];
  } catch {}

  if (!savedOverlays.length) {
    overlays["Ride NT"].addTo(map);
  } else {
    for (const [name, layer] of Object.entries(overlays)) {
      if (savedOverlays.includes(name)) {
        layer.addTo(map);
      }
    }
  }

  return currentBaseLayer;
}

function setupEventListeners(map, baseLayers, overlays) {
  map.on("baselayerchange", (e) => {
    const selectedName = Object.entries(baseLayers).find(
      ([_, v]) => v === e.layer
    )?.[0];
    if (selectedName) localStorage.setItem(STORAGE_KEY_BASE, selectedName);
  });

  map.on("overlayadd overlayremove", () => {
    const activeOverlays = Object.entries(overlays)
      .filter(([_, layer]) => map.hasLayer(layer))
      .map(([name]) => name);
    localStorage.setItem(STORAGE_KEY_OVERLAYS, JSON.stringify(activeOverlays));
  });

  map.on("moveend zoomend", () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const hash = `#${zoom}/${center.lat.toFixed(6)}/${center.lng.toFixed(6)}`;
    location.hash = hash;
    localStorage.setItem(STORAGE_KEY_VIEW, JSON.stringify({ center, zoom }));
  });
}
