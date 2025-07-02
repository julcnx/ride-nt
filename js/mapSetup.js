export const STORAGE_KEY_VIEW = "rident_map_view";
export const STORAGE_KEY_BASE = "rident_base_layer";
export const STORAGE_KEY_OVERLAYS = "rident_overlays";

import { regionBounds } from './config.js';

export function initializeMap() {
  document.getElementById('map').style.display = 'block';

  const GOOGLE_LAYERS = {
    satellite: 'y',
    terrain: 'p'
  };

  const map = L.map('map', {
    minZoom: 9,
    maxBounds: L.latLngBounds(regionBounds)
  });

  map.attributionControl.setPrefix('');

  const savedView = localStorage.getItem(STORAGE_KEY_VIEW);
  if (savedView) {
    try {
      const { center, zoom } = JSON.parse(savedView);
      map.setView(center, zoom);
    } catch {
      map.setView([18.79, 98.98], 10);
    }
  } else {
    map.setView([18.79, 98.98], 10);
  }

  const googleSatellite = L.tileLayer(
    `https://mt{s}.google.com/vt?lyrs=${GOOGLE_LAYERS.satellite}&x={x}&y={y}&z={z}`, {
      subdomains: ['0', '1', '2', '3'],
      attribution: '&copy; Google Satellite',
    }
  );

  const googleTerrain = L.tileLayer(
    `https://mt{s}.google.com/vt?lyrs=${GOOGLE_LAYERS.terrain}&x={x}&y={y}&z={z}`, {
      subdomains: ['0', '1', '2', '3'],
      attribution: '&copy; Google Terrain',
      opacity: 0.5
    }
  );

  const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    subdomains: ['a', 'b', 'c'],
    attribution: '&copy; OpenStreetMap contributors'
  });

  const customTiles = L.tileLayer('./tiles/{z}/{x}/{y}.png', {
    tileSize: 256,
    opacity: 1,
    minNativeZoom: 10,
    maxNativeZoom: 13,
    attribution: 'GPX Overlay',
    zIndex: 3
  });

  const googleStreetViewTiles = L.tileLayer(
    'https://mts{s}.googleapis.com/vt?hl=en-US&lyrs=svv|cb_client:apiv3&style=40,18&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      attribution: '&copy; Google Street View',
      maxNativeZoom: 13,
      maxZoom: 20,
      opacity: 0.7,
      zIndex: 1
    }
  );

  const baseLayers = {
    'Google Terrain': googleTerrain,
    'Google Satellite': googleSatellite,
    'OSM Standard': osmStandard
  };

  const overlays = {
    'Ride NT': customTiles,
    'Google Street View': googleStreetViewTiles
  };

  const overlaysControl = L.control.layers(baseLayers, overlays, { collapsed: false, autoZIndex: false }).addTo(map);

  let currentBaseLayer;

  const savedBaseLayerName = localStorage.getItem(STORAGE_KEY_BASE);
  if (savedBaseLayerName && baseLayers[savedBaseLayerName]) {
    baseLayers[savedBaseLayerName].addTo(map);
    currentBaseLayer = baseLayers[savedBaseLayerName];
  } else {
    googleTerrain.addTo(map);
    currentBaseLayer = googleTerrain;
  }

  const savedOverlaysJSON = localStorage.getItem(STORAGE_KEY_OVERLAYS);
  let savedOverlays = [];
  try {
    savedOverlays = savedOverlaysJSON ? JSON.parse(savedOverlaysJSON) : [];
  } catch {}

  if (!savedOverlays.length) {
    customTiles.addTo(map);
    savedOverlays = ['Ride NT'];
  } else {
    Object.entries(overlays).forEach(([name, layer]) => {
      if (savedOverlays.includes(name)) {
        layer.addTo(map);
      }
    });
  }

  map.on('baselayerchange', e => {
    currentBaseLayer = e.layer;
    const selectedName = Object.entries(baseLayers).find(([k,v]) => v === currentBaseLayer)?.[0];
    if (selectedName) localStorage.setItem(STORAGE_KEY_BASE, selectedName);
  });

  map.on('overlayadd overlayremove', () => {
    const activeOverlays = Object.entries(overlays)
      .filter(([name, layer]) => map.hasLayer(layer))
      .map(([name]) => name);
    localStorage.setItem(STORAGE_KEY_OVERLAYS, JSON.stringify(activeOverlays));
  });

  map.on('moveend zoomend', () => {
    const view = {
      center: map.getCenter(),
      zoom: map.getZoom()
    };
    localStorage.setItem(STORAGE_KEY_VIEW, JSON.stringify(view));
  });

  return { map, baseLayers, overlays, currentBaseLayer, overlaysControl };
}