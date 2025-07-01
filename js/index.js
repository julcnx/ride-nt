import { promptPassword } from './auth.js';
import { initializeMap } from './mapSetup.js';
import { addLegend, addContextMenu, addKeyboardShortcuts } from './controls.js';
import { enableGpxDragAndDrop } from './gpxDragDrop.js';

promptPassword();

const { map, baseLayers, overlays, currentBaseLayer, overlaysControl } = initializeMap();

addLegend(map);
addContextMenu(map, baseLayers['Google Satellite'], currentBaseLayer);
addKeyboardShortcuts(map, overlays, baseLayers['Google Satellite'], currentBaseLayer);

enableGpxDragAndDrop(map, overlaysControl);
