const GOOGLE_LAYERS = { satellite: "s", terrain: "p" };

const googleSatellite = L.tileLayer(
  `https://mt{s}.google.com/vt?lyrs=${GOOGLE_LAYERS.satellite}&x={x}&y={y}&z={z}`,
  {
    subdomains: ["0", "1", "2", "3"],
    attribution: "&copy; Google Satellite",
    maxNativeZoom: 18,
  },
);

const googleTerrain = L.tileLayer(
  `https://mt{s}.google.com/vt?lyrs=${GOOGLE_LAYERS.terrain}&x={x}&y={y}&z={z}`,
  {
    subdomains: ["0", "1", "2", "3"],
    attribution: "&copy; Google Terrain",
    maxNativeZoom: 18,
    opacity: 0.5,
  },
);

const esriFirefly = L.esri.basemapLayer("ImageryFirefly", {
  maxNativeZoom: 19,
});

const esriClarity = L.esri.basemapLayer("ImageryClarity", {
  maxNativeZoom: 17,
});

const esriWayback = L.tileLayer(
  "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}",
  {
    maxNativeZoom: 17,
  },
);

const osmStandard = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    subdomains: ["a", "b", "c"],
    attribution: "&copy; OpenStreetMap contributors",
  },
);

const worldTopoMap = L.tileLayer(
  "https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  {
    maxNativeZoom: 19,
  },
);

const customTiles = L.tileLayer("./tiles/{z}/{x}/{y}.png", {
  tileSize: 256,
  opacity: 1,
  minNativeZoom: 10,
  maxNativeZoom: 13,
  attribution: "Ride NT",
  zIndex: 3,
  className: 'overlay'
});

const googleStreetViewTiles = L.tileLayer(
  "https://mts{s}.googleapis.com/vt?hl=en-US&lyrs=svv|cb_client:apiv3&style=40,18&x={x}&y={y}&z={z}",
  {
    subdomains: ["0", "1", "2", "3"],
    attribution: "&copy; Google Street View",
    maxNativeZoom: 13,
    maxZoom: 20,
    opacity: 0.7,
    zIndex: 1,
    className: 'overlay'
  },
);

const mapillaryVector = L.vectorGrid.protobuf(
  "https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|4100327730013843|5bb78b81720791946a9a7b956c57b7cf",
  {
    transparent: true,
    maxNativeZoom: 13,
    zIndex: 1,
    className: 'overlay',
    vectorTileLayerStyles: {
      sequence: () => ({
        color: "rgb(20, 150, 60)",
        weight: 10,
        opacity: 0.7,
      }),
    },
  },
);

const kartaViewTiles = L.tileLayer(
  "https://karta-gateway.geo.azure.myteksi.net/view/api/2.0/sequence/tiles/{x}/{y}/{z}.png",
  {
    transparent: true,
    minNativeZoom: 13,
    maxNativeZoom: 20,
    className: 'overlay',
  },
);

const osmGpsTraces = L.tileLayer(
  "https://{s}.gps-tile.openstreetmap.org/lines/{z}/{x}/{y}.png",
  {
    transparent: true,
    maxNativeZoom: 18,
    zIndex: 2,
    className: 'overlay',
  },
);

export const baseLayers = {
  "Google Terrain": googleTerrain,
  "OSM Standard": osmStandard,
  "World Topo Map": worldTopoMap,
  "Google Satellite": googleSatellite,
  "ESRI Firefly": esriFirefly,
  "ESRI Clarity": esriClarity,
  "ESRI Wayback": esriWayback,
};

export const overlays = {
  "Ride NT": customTiles,
  "OpenStreetMap traces": osmGpsTraces,
  "Google Street View": googleStreetViewTiles,
  Mapillary: mapillaryVector,
  KartaView: kartaViewTiles,
};
