export function addHighlightPen(map) {
  const drawnLines = [];
  let currentLine = null;
  let drawing = false;

  const polylineOptions = (map) => {
    const zoom = map.getZoom();
    const baseWeight = 25;
    const scaledWeight = Math.max(4, baseWeight - (18 - zoom) * 2);
    return {
      color: 'yellow',
      weight: scaledWeight,
      opacity: 0.5,
    };
  };

  const controls = L.control({ position: 'bottomleft' });

  controls.onAdd = function () {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

    const drawBtn = L.DomUtil.create('a', '', container);
    drawBtn.href = '#';
    drawBtn.innerHTML = '🖊️';
    drawBtn.title = 'Toggle highlighter';
    drawBtn.style.padding = '6px 10px';
    drawBtn.style.fontSize = '20px';

    const clearBtn = L.DomUtil.create('a', '', container);
    clearBtn.href = '#';
    clearBtn.innerHTML = '🧽';
    clearBtn.title = 'Clear highlights';
    clearBtn.style.padding = '6px 10px';
    clearBtn.style.fontSize = '20px';

    drawBtn.onclick = (e) => {
      e.preventDefault();
      drawing = !drawing;
      updateDrawButton();
    };

    clearBtn.onclick = (e) => {
      e.preventDefault();
      drawnLines.forEach((line) => map.removeLayer(line));
      drawnLines.length = 0;
      saveToUrl();
    };

    function updateDrawButton() {
      if (drawing) {
        drawBtn.style.background = '#ff0';
        drawBtn.style.color = 'black';
      } else {
        drawBtn.style.background = 'white';
        drawBtn.style.color = '';
      }
    }

    return container;
  };

  controls.addTo(map);

  function disableMapInteractions() {
    map.dragging.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.scrollWheelZoom.disable();
  }

  function enableMapInteractions() {
    map.dragging.enable();
    map.doubleClickZoom.enable();
    map.boxZoom.enable();
    map.scrollWheelZoom.enable();
  }

  function getLatLngFromEvent(e) {
    if (e.latlng) return e.latlng;
    if (e.touches && e.touches.length > 0) {
      return map.containerPointToLatLng(
        map.mouseEventToContainerPoint(e.touches[0])
      );
    }
    return null;
  }

  function startDrawing(e) {
    if (!drawing) return;
    const latlng = getLatLngFromEvent(e);
    if (!latlng) return;

    disableMapInteractions();

    currentLine = L.polyline([latlng], polylineOptions(map)).addTo(map);
    drawnLines.push(currentLine);

    // prevent scrolling while drawing
    if (e.preventDefault) e.preventDefault();
  }

  function continueDrawing(e) {
    if (!drawing || !currentLine) return;
    const latlng = getLatLngFromEvent(e);
    if (!latlng) return;
    currentLine.addLatLng(latlng);
    if (e.preventDefault) e.preventDefault();
  }

  function endDrawing(e) {
    if (drawing && currentLine) {
      currentLine = null;
      saveToUrl();
      enableMapInteractions();
    }
    if (e.preventDefault) e.preventDefault();
  }

  // Mouse events
  map.on('mousedown', startDrawing);
  map.on('mousemove', continueDrawing);
  map.on('mouseup', endDrawing);

  // Touch events (on the map container)
  const mapContainer = map.getContainer();
  mapContainer.addEventListener('touchstart', startDrawing, { passive: false });
  mapContainer.addEventListener('touchmove', continueDrawing, { passive: false });
  mapContainer.addEventListener('touchend', endDrawing, { passive: false });

  map.on('zoomend', () => {
    drawnLines.forEach((line) => line.setStyle(polylineOptions(map)));
  });

  window.addEventListener('keydown', (e) => {
    // 'd' key toggles drawing mode
    if (e.key.toLowerCase() === 'd') {
      drawing = !drawing;
      updateDrawButton();
    }

    // Ctrl+Z or Cmd+Z to undo last drawn line
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      if (drawnLines.length > 0) {
        const lastLine = drawnLines.pop();
        map.removeLayer(lastLine);
        saveToUrl();
      }
    }
  });

  function updateDrawButton() {
    const drawBtn = document.querySelector('.leaflet-bar a[title="Toggle highlighter"]');
    if (!drawBtn) return;
    if (drawing) {
      drawBtn.style.background = '#ff0';
      drawBtn.style.color = 'black';
    } else {
      drawBtn.style.background = 'white';
      drawBtn.style.color = '';
    }
  }

  function saveToUrl() {
    if (!drawnLines.length) {
      updateUrlParam(null);
      return;
    }

    const encoded = drawnLines
      .map((line) =>
        polyline.encode(line.getLatLngs().map((p) => [p.lat, p.lng]))
      )
      .join(';');

    updateUrlParam(encoded);
  }

  function updateUrlParam(value) {
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set('data', value);
    } else {
      params.delete('data');
    }

    const newUrl =
      window.location.pathname +
      (params.toString() ? '?' + params.toString() : '') +
      window.location.hash;

    window.history.replaceState(null, '', newUrl);
  }

  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('data');
    if (!raw) return;

    const segments = raw.split(';');
    segments.forEach((encoded) => {
      try {
        const coords = polyline.decode(encoded).map(([lat, lng]) =>
          L.latLng(lat, lng)
        );
        const line = L.polyline(coords, polylineOptions(map)).addTo(map);
        drawnLines.push(line);
      } catch (e) {
        console.warn('Invalid polyline segment:', encoded);
      }
    });
  }

  loadFromUrl();
}
