import { regionBounds } from "./config.js";
import {
  mainOverlay,
  baseLayers,
  satelliteLayers,
  overlays,
} from "./layers.js";
import { baseLayerTransparency } from "./transparency.js";

const STORAGE_KEY_VIEW = "rident_map_view";
const STORAGE_KEY_BASE = "rident_base_layer";
const STORAGE_KEY_SATELLITE = "rident_satellite";
const STORAGE_KEY_OVERLAYS = "rident_overlays";

export function initializeMap() {
  document.getElementById("map").style.display = "block";

  const map = createMap();
  setInitialView(map);

  const layersControl = L.control
    .layers(baseLayers, overlays, {
      collapsed: true,
      autoZIndex: false,
      position: "topright",
    })
    .addTo(map);

  const currentBaseLayer = restoreLayerSelection(
    map,
    baseLayers,
    overlays,
    satelliteLayers
  );
  setupEventListeners(map, baseLayers, overlays);

  return {
    map,
    mainOverlay,
    baseLayers,
    satelliteLayers,
    overlays,
    currentBaseLayer,
    layersControl,
  };
}

function createMap() {
  const map = L.map("map", {
    minZoom: 9,
    maxBounds: L.latLngBounds(regionBounds),
    layers: [mainOverlay],
    zoomControl: false,
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

function restoreLayerSelection(map, baseLayers, overlays, satelliteLayers) {
  let currentBaseLayer;

  // Restore or fallback base layer
  const baseName = localStorage.getItem(STORAGE_KEY_BASE);
  if (baseName && baseLayers[baseName]) {
    baseLayers[baseName].addTo(map);
    currentBaseLayer = baseLayers[baseName];
  } else {
    baseLayers["World Topo Map"].addTo(map);
    currentBaseLayer = baseLayers["World Topo Map"];
  }

  // Restore overlays
  const overlayJSON = localStorage.getItem(STORAGE_KEY_OVERLAYS);
  let savedOverlays = [];
  try {
    savedOverlays = overlayJSON ? JSON.parse(overlayJSON) : [];
  } catch {}

  if (savedOverlays.length) {
    for (const [name, layer] of Object.entries(overlays)) {
      if (savedOverlays.includes(name)) {
        layer.addTo(map);
      }
    }
  }

  // Restore or default satellite layer
  const satName = localStorage.getItem(STORAGE_KEY_SATELLITE);
  let currentSatelliteLayer;
  if (satName && satelliteLayers[satName]) {
    currentSatelliteLayer = satelliteLayers[satName];
  } else {
    currentSatelliteLayer = satelliteLayers["Google Satellite"];
  }

  if (currentSatelliteLayer) {
    currentSatelliteLayer.setOpacity(baseLayerTransparency / 100.0);
    currentSatelliteLayer.addTo(map);
  }

  return currentBaseLayer;
}

function setupEventListeners(map, baseLayers, overlays) {
  map.on("baselayerchange", (e) => {
    const selectedBaseLayer = Object.entries(baseLayers).find(
      ([_, v]) => v === e.layer
    );
    if (selectedBaseLayer) {
      localStorage.setItem(STORAGE_KEY_BASE, selectedBaseLayer[0]);
      selectedBaseLayer[1].setZIndex(0);
    }

    const selectedSatLayer = Object.entries(satelliteLayers).find(
      ([_, v]) => v === e.layer
    );
    if (selectedSatLayer) {
      localStorage.setItem(STORAGE_KEY_SATELLITE, selectedSatLayer[0]);
      selectedSatLayer[1].setZIndex(1);
      selectedSatLayer[1].setOpacity(baseLayerTransparency / 100);
    }
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
