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
  },
);

const mapillaryVector = L.vectorGrid.protobuf(
  "https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|4100327730013843|5bb78b81720791946a9a7b956c57b7cf",
  {
    transparent: true,
    maxNativeZoom: 13,
    zIndex: 1,
    vectorTileLayerStyles: {
      sequence: () => ({
        color: "rgb(20, 150, 60)",
        weight: 10,
        opacity: 0.7,
      }),
    },
  },
);

const osmGpsTraces = L.tileLayer(
  "https://{s}.gps-tile.openstreetmap.org/lines/{z}/{x}/{y}.png",
  {
    transparent: true,
    maxNativeZoom: 18,
    zIndex: 2,
  },
);

export const baseLayers = {
  "Google Terrain": googleTerrain,
  "Google Satellite": googleSatellite,
  "OSM Standard": osmStandard,
  "World Topo Map": worldTopoMap,
};

export const overlays = {
  "Ride NT": customTiles,
  "Google Street View": googleStreetViewTiles,
  Mapillary: mapillaryVector,
  "OpenStreetMap traces": osmGpsTraces,
};
