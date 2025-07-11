import { isDev } from "./dev.js";
import { promptPassword } from "./auth.js";
import { initializeMap } from "./mapSetup.js";
import { addLegend } from "./legend.js";
import { addContextMenu } from "./contextMenu.js";
import { enableGpxDragAndDrop } from "./gpxDragDrop.js";
import { addKeyboardShortcuts } from "./keyboard.js";
import { addHighlightPen } from "./draw.js";
import { addBaseLayerTransparencyControl } from "./transparency.js";

if (isDev()) {
  document.title = "🤖" + document.title;
}

const {
  map,
  mainOverlay,
  baseLayers,
  satelliteLayers,
  overlays,
  currentBaseLayer,
  layersControl,
} = initializeMap();

addLegend(map);

addContextMenu(map, baseLayers, currentBaseLayer);
addKeyboardShortcuts(
  map,
  mainOverlay,
  overlays,
  baseLayers["Google Satellite"],
  currentBaseLayer
);
addHighlightPen(map);

enableGpxDragAndDrop(map, layersControl, overlays);
addBaseLayerTransparencyControl(map, mainOverlay, overlays, satelliteLayers);

window.addEventListener("load", promptPassword);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") promptPassword();
});
