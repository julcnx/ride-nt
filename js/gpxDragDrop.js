import { regionBounds } from './config.js';

export function enableGpxDragAndDrop(map, overlaysControl, overlays = {}) {
  const mapContainer = map.getContainer();
  const bounds = L.latLngBounds(regionBounds);

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    mapContainer.addEventListener(eventName, e => e.preventDefault(), false);
  });

  mapContainer.addEventListener('drop', e => {
    e.preventDefault();
    if (!e.dataTransfer.files.length) return;

    for (const file of e.dataTransfer.files) {
      if (!file.name.toLowerCase().endsWith('.gpx')) continue;

      const reader = new FileReader();
      reader.onload = (event) => {
        const gpxText = event.target.result;
        const gpxLayer = new L.GPX(gpxText, {
          async: true,
          polyline_options: {
            color: 'rgba(255, 255, 0, 0.5)',
            weight: 20,
          },
          gpx_options: {
            joinTrackSegments: false
          },
          markers: {
            startIcon: null,
            endIcon: null
          },
        });

        gpxLayer.on('loaded', () => {
          const gpxBounds = gpxLayer.getBounds();
          if (bounds.intersects(gpxBounds)) {
            gpxLayer.addTo(map);

            // Add to overlays and control
            const name = file.name.replace(/\.gpx$/i, '');
            overlays[name] = gpxLayer;
            overlaysControl.addOverlay(gpxLayer, name);

            map.fitBounds(gpxBounds);
          } else {
            alert(`GPX file "${file.name}" is outside the allowed bounds and will not be displayed.`);
          }
        });
      };
      reader.readAsText(file);
    }
  });
}
