import { isDev } from "./dev.js";

export const mainOverlay = L.tileLayer(
  //`https://julcnx.github.io/ride-nt/tiles/{z}/{x}/{y}.png?ts=${__TILES_TIMESTAMP__}`,
  `./tiles/{z}/{x}/{y}.png?ts=${__TILES_TIMESTAMP__}`,
  {
    tileSize: 256,
    // opacity: 1,
    minNativeZoom: 10,
    maxNativeZoom: 13,
    zIndex: 3,
  }
);

const GOOGLE_LAYERS = { satellite: "s", terrain: "p", hybrid: "h", maps: "m" };

const googleSatellite = L.tileLayer(
  `https://mt{s}.google.com/vt?lyrs=${GOOGLE_LAYERS.satellite}&x={x}&y={y}&z={z}`,
  {
    subdomains: ["0", "1", "2", "3"],
    maxNativeZoom: 18,
  }
);

const googleMaps = L.tileLayer(
  `https://mt{s}.google.com/vt?lyrs=${GOOGLE_LAYERS.maps}&x={x}&y={y}&z={z}`,
  {
    subdomains: ["0", "1", "2", "3"],
    maxNativeZoom: 18,
  }
);

const googleTerrain = L.tileLayer(
  `https://mt{s}.google.com/vt?lyrs=${GOOGLE_LAYERS.terrain}&x={x}&y={y}&z={z}`,
  {
    subdomains: ["0", "1", "2", "3"],
    maxNativeZoom: 18,
    // opacity: 0.5,
  }
);

const googleHybrid = L.tileLayer(
  `https://mt{s}.google.com/vt?lyrs=${GOOGLE_LAYERS.hybrid}&x={x}&y={y}&z={z}`,
  {
    subdomains: ["0", "1", "2", "3"],
    maxNativeZoom: 18,
    transparent: true,
    zIndex: 2,
  }
);

const esriFirefly = L.esri.basemapLayer("ImageryFirefly", {
  maxNativeZoom: 18,
});

const esriClarity = L.esri.basemapLayer("ImageryClarity", {
  maxNativeZoom: 17,
});

const esriWayback = L.tileLayer(
  "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}",
  {
    maxNativeZoom: 17,
  }
);

const osmStandard = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    subdomains: ["a", "b", "c"],
  }
);

const worldTopoMap = L.tileLayer(
  "https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  {
    maxNativeZoom: 18,
  }
);

const rtsMap = L.tileLayer(`./50k/{z}/{x}/{y}.png`, {
  attribution: `50K`,
  minNativeZoom: 13,
  maxNativeZoom: 14,
});

const googleStreetViewTiles = L.tileLayer(
  "https://mts{s}.googleapis.com/vt?hl=en-US&lyrs=svv|cb_client:apiv3&style=40,18&x={x}&y={y}&z={z}",
  {
    subdomains: ["0", "1", "2", "3"],
    maxNativeZoom: 13,
    maxZoom: 20,
    // opacity: 0.7,
    zIndex: 1,
    className: "overlay",
  }
);

const mapillaryVector = L.vectorGrid.protobuf(
  "https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|4100327730013843|5bb78b81720791946a9a7b956c57b7cf",
  {
    transparent: true,
    maxNativeZoom: 13,
    zIndex: 1,
    className: "overlay",
    vectorTileLayerStyles: {
      sequence: () => ({
        color: "rgb(20, 150, 60)",
        weight: 10,
        // opacity: 0.7,
      }),
    },
  }
);

const kartaViewTiles = L.tileLayer(
  "https://karta-gateway.geo.azure.myteksi.net/view/api/2.0/sequence/tiles/{x}/{y}/{z}.png",
  {
    transparent: true,
    minNativeZoom: 13,
    maxNativeZoom: 20,
    className: "overlay",
  }
);

const stravaHeatmapTiles = L.tileLayer(
  "https://content-{s}.strava.com/identified/globalheat/all/hot/{z}/{x}/{y}.png?v=19",
  {
    subdomains: ["a"],
    maxNativeZoom: 16,
    maxZoom: 20,
    // opacity: 0.6,
    zIndex: 2,
    className: "overlay",
  }
);

const osmGpsTraces = L.tileLayer(
  "https://{s}.gps-tile.openstreetmap.org/lines/{z}/{x}/{y}.png",
  {
    transparent: true,
    maxNativeZoom: 18,
    zIndex: 2,
    className: "overlay",
  }
);

export const baseLayers = {
  "World Topo Map": worldTopoMap,
  "OSM Standard": osmStandard,
  "Google Maps": googleMaps,
  "Google Terrain": googleTerrain,
};

if (isDev()) {
  baseLayers["RTS Map"] = rtsMap;
}

export const satelliteLayers = {
  "Google Satellite": googleSatellite,
  "ESRI Firefly": esriFirefly,
  "ESRI Clarity": esriClarity,
  "ESRI Wayback": esriWayback,
};

export const overlays = {
  "OpenStreetMap traces": osmGpsTraces,
};

// Add additional layers for development mode
// These layers are not included in production to keep the map clean and focused on essential data.
// They are useful for testing and development purposes, providing additional context or data layers.
if (isDev()) {
  overlays["Google Street View"] = googleStreetViewTiles;
  overlays["Google Hybrid"] = googleHybrid;
  overlays.Mapillary = mapillaryVector;
  overlays.KartaView = kartaViewTiles;
  // overlays["Strava Heatmap"] = stravaHeatmapTiles;
}
