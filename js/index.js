import { isDev } from "./dev.js";
import { promptPassword } from "./auth.js";
import { initializeMap } from "./mapSetup.js";
import { addLegend } from "./legend.js";
import { addContextMenu } from "./contextMenu.js";
import { enableGpxDragAndDrop } from "./gpxDragDrop.js";
import { addKeyboardShortcuts } from "./keyboard.js";
import { addHighlightPen } from "./draw.js";

if (isDev()) {
  document.title = "🤖" + document.title;
}

const { map, baseLayers, overlays, currentBaseLayer, overlaysControl } =
  initializeMap();

addLegend(map);
addContextMenu(map, baseLayers, currentBaseLayer);
addKeyboardShortcuts(
  map,
  overlays,
  baseLayers["Google Satellite"],
  currentBaseLayer
);
addHighlightPen(map);

enableGpxDragAndDrop(map, overlaysControl, overlays);

window.addEventListener("load", promptPassword);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") promptPassword();
});
