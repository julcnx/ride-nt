export function addLegend(map) {
  const legend = L.control({ position: 'bottomright' });

  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'info legend');
    div.style.background = 'rgba(255, 255, 255, 0.9)';
    div.style.padding = '8px';
    div.style.borderRadius = '5px';
    div.style.fontSize = '14px';
    div.style.color = '#333';
    div.style.lineHeight = '1.4';
    div.style.width = '250px';

    const opacity = 1;

    function colorBox(color) {
      return `<span style="
        display:inline-block;
        width:14px;
        height:10px;
        margin-right:8px;
        background-color:${color.replace('OPACITY', opacity)};
        vertical-align:middle;
      "></span>`;
    }

    const PAVED_COLOR = 'rgba(51, 102, 255, 1)';
    const MAYBE_COLOR = 'rgba(160,160,160,1)';

    let html = '<b>RideNT Legend</b><br/><br/>';
    html += `${colorBox(PAVED_COLOR)} Paved<br>`;
    html += `${colorBox('rgba(0,140,60,OPACITY)')} Very fast dirt <span class="caption">&gt; 30km/h</span> <br>`;
    html += `${colorBox('rgba(255,179,0,OPACITY)')} Moderate/Fast dirt <span class="caption">15-30 km/h</span><br>`;
    html += `${colorBox('rgba(255,40,40,OPACITY)')} Slow dirt <span class="caption">7-15 km/h</span><br>`;
    html += `${colorBox('rgba(128,0,128,OPACITY)')} Very technical <span class="caption">&lt; 7 km/h</span><br>`;
    html += `${colorBox(MAYBE_COLOR)} Potential trail<br>`;
    html += `<br><span class="caption">Speeds are approximate, calculated from GPX trails in dry conditions, with climate season and rider speed factors considered, but accuracy is not guaranteed.</span>`;

    div.innerHTML = html;
    return div;
  };

  legend.addTo(map);
}

export function addContextMenu(map, googleSatellite, currentBaseLayer) {
  const contextMenu = document.getElementById('context-menu');

  function addMenuItem(label, action) {
    const item = document.createElement('div');
    item.innerText = label;
    item.onclick = () => {
      action();
      contextMenu.style.display = 'none';
    };
    contextMenu.appendChild(item);
  }

  map.on('contextmenu', function (e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    contextMenu.innerHTML = '';

    addMenuItem('Edit in OpenStreetMap', () => {
      window.open(`https://www.openstreetmap.org/edit?editor=id&lat=${lat}&lon=${lng}&zoom=18`, '_blank');
    });

    addMenuItem('Copy Coordinates', () => {
      navigator.clipboard.writeText(`${lat}, ${lng}`).then(() => {
        alert('Coordinates copied to clipboard.');
      });
    });

    addMenuItem('Open in Google Maps', () => {
      const isSatellite = currentBaseLayer === googleSatellite;
      const mapType = isSatellite ? '&t=k' : ''; 
      window.open(`https://maps.google.com/?q=${lat},${lng}${mapType}`, '_blank');
    });

    addMenuItem('Open in Google Street View', () => {
      window.open(`https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}`, '_blank');
    });

    contextMenu.style.left = e.originalEvent.pageX + 'px';
    contextMenu.style.top = e.originalEvent.pageY + 'px';
    contextMenu.style.display = 'block';
  });

  map.on('click', () => contextMenu.style.display = 'none');
  document.addEventListener('click', () => contextMenu.style.display = 'none');
}

export function addKeyboardShortcuts(map, overlays, googleSatellite, currentBaseLayer) {
  function toggleOverlays() {
    const anyVisible = Object.values(overlays).some(layer => map.hasLayer(layer));
    if (anyVisible) {
      Object.values(overlays).forEach(layer => map.removeLayer(layer));
    } else {
      Object.values(overlays).forEach(layer => map.addLayer(layer));
    }
  }

  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

    if (e.key.toLowerCase() === 'o') {
      toggleOverlays();
    } else if (e.key === 'Delete') {
      localStorage.clear();
      location.reload();
    }
  });
}