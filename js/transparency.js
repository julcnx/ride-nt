export let baseLayerTransparency = 0;

export function addBaseLayerTransparencyControl(
  map,
  mainOverlay,
  overlays,
  satelliteLayers
) {
  const baseControl = L.control({ position: "topleft" }); // Or 'topleft' if needed

  baseControl.onAdd = function () {
    const div = L.DomUtil.create(
      "div",
      "leaflet-control leaflet-top-center leaflet-control-layers leaflet-control-layers-expanded transparency-toolbar"
    );

    // --- Dropdown ---
    const select = L.DomUtil.create("select", "", div);
    select.className = "transparency-select";

    Object.keys(satelliteLayers).forEach((label) => {
      const option = document.createElement("option");
      option.value = label;
      option.textContent = label;
      select.appendChild(option);
    });

    const savedName = localStorage.getItem("rident_satellite");
    const defaultName =
      savedName && satelliteLayers[savedName]
        ? savedName
        : Object.keys(satelliteLayers)[0];

    select.value = defaultName;

    let currentSatelliteLayer = satelliteLayers[defaultName];
    currentSatelliteLayer.addTo(map);
    currentSatelliteLayer.setOpacity(baseLayerTransparency / 100);
    currentSatelliteLayer.setZIndex(1);

    // --- Slider ---
    const input = L.DomUtil.create("input", "", div);
    input.className = "transparency-slider";
    input.type = "range";
    input.min = 0;
    input.max = 100;
    input.step = 1;
    input.value = baseLayerTransparency;

    // --- Handlers ---
    L.DomEvent.on(input, "input", (e) => {
      const value = parseFloat(e.target.value);
      baseLayerTransparency = value;

      const effectiveOpacity = (100 - value) / 100;

      // const overlayPane = document.querySelector(
      //   ".leaflet-pane.leaflet-overlay-pane"
      // );
      // overlayPane.style.opacity = effectiveOpacity;

      // mainOverlay.setOpacity(effectiveOpacity);

      // Update all overlays
      // Object.values(overlays).forEach((layer) => {
      //   if (typeof layer.setOpacity === "function") {
      //     layer.setOpacity(effectiveOpacity);
      //   }
      // });

      if (currentSatelliteLayer) {
        currentSatelliteLayer.setOpacity(baseLayerTransparency / 100);
      }

      input.blur(); // Remove focus to prevent slider from sticking
    });

    L.DomEvent.on(select, "change", (e) => {
      const selectedName = e.target.value;
      if (map.hasLayer(currentSatelliteLayer)) {
        map.removeLayer(currentSatelliteLayer);
      }
      currentSatelliteLayer = satelliteLayers[selectedName];
      currentSatelliteLayer.addTo(map);
      currentSatelliteLayer.setOpacity(baseLayerTransparency / 100);
      currentSatelliteLayer.setZIndex(1);
      localStorage.setItem("rident_satellite", selectedName);
    });

    L.DomEvent.disableClickPropagation(div);

    select.blur();
    return div;
  };

  baseControl.addTo(map);
}
