import { promptPassword } from "./auth.js";
import { initializeMap } from "./mapSetup.js";
import { addLegend } from "./legend.js";
import { addContextMenu } from "./contextMenu.js";
import { enableGpxDragAndDrop } from "./gpxDragDrop.js";
import { addKeyboardShortcuts } from "./keyboard.js";

promptPassword();

const { map, baseLayers, overlays, currentBaseLayer, overlaysControl } =
	initializeMap();

addLegend(map);
addContextMenu(map, baseLayers["Google Satellite"], currentBaseLayer);
addKeyboardShortcuts(
	map,
	overlays,
	baseLayers["Google Satellite"],
	currentBaseLayer,
);

enableGpxDragAndDrop(map, overlaysControl, overlays);
