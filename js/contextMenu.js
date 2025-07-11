import { isDev } from "./dev.js";

function showToast(message, duration = 2000) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "rgba(0,0,0,0.8)";
  toast.style.color = "#fff";
  toast.style.padding = "8px 12px";
  toast.style.borderRadius = "6px";
  toast.style.fontSize = "14px";
  toast.style.zIndex = 9999;
  toast.style.opacity = 0;
  toast.style.transition = "opacity 0.3s ease";

  document.body.appendChild(toast);

  // fade in
  requestAnimationFrame(() => {
    toast.style.opacity = 1;
  });

  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

export function addContextMenu(map, baseLayers, currentBaseLayer) {
  const contextMenu = document.getElementById("context-menu");

  function addMenuItem(label, action) {
    const item = document.createElement("div");
    item.innerText = label;
    item.style.padding = "4px 8px";
    item.style.cursor = "pointer";
    item.onmouseenter = () => (item.style.background = "#eee");
    item.onmouseleave = () => (item.style.background = "");
    item.onmousedown = () => {
      action();
      contextMenu.style.display = "none";
    };
    contextMenu.appendChild(item);
  }

  function addSeparator() {
    const hr = document.createElement("hr");
    hr.style.margin = "0";
    contextMenu.appendChild(hr);
  }

  map.on("contextmenu", function (e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    const z = map.getZoom();
    contextMenu.innerHTML = "";

    addMenuItem("Edit in OpenStreetMap", () => {
      window.open(
        `https://www.openstreetmap.org/id?#map=${Math.max(
          16,
          map.getZoom()
        )}/${lat}/${lng}`
      );
    });

    addSeparator();

    addMenuItem("Open in Google Maps", () => {
      const isSatellite = currentBaseLayer === baseLayers["Google Satellite"];
      const params = new URLSearchParams({
        api: 1,
        map_action: "map",
        basemap: isSatellite ? "satellite" : "terrain",
        center: [lat, lng].join(","),
        zoom: z,
      });
      window.open(`https://www.google.com/maps/@?${unescape(params)}`);
    });

    addMenuItem("Open in Google Street View", () => {
      window.open(`https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}`);
    });

    addMenuItem("Open in Komoot", () => {
      window.open(`https://www.komoot.com/plan/@${lat},${lng},${z}z?sport=mtb`);
    });

    if (isDev()) {
      addMenuItem("Open in Mapillary", () => {
        const params = new URLSearchParams({ lat, lng, z });
        window.open(`https://www.mapillary.com/app/?${unescape(params)}`);
      });
    }

    addSeparator();

    addMenuItem("Copy Coordinates", () => {
      navigator.clipboard.writeText(`${lat}, ${lng}`).then(() => {
        showToast("Coordinates copied to clipboard.");
      });
    });

    addMenuItem("Copy Bounding Box", () => {
      const bounds = map.getBounds();
      const minLon = bounds.getSouth().toFixed(6);
      const minLat = bounds.getEast().toFixed(6);
      const maxLon = bounds.getNorth().toFixed(6);
      const maxLat = bounds.getWest().toFixed(6);
      const bboxString = `${maxLon},${maxLat},${minLon},${minLat}`;

      navigator.clipboard.writeText(bboxString).then(() => {
        showToast("Bounding box copied to clipboard.");
      });
    });

    // Position and show menu
    contextMenu.style.left = e.originalEvent.pageX + "px";
    contextMenu.style.top = e.originalEvent.pageY + "px";
    contextMenu.style.display = "block";
  });

  const hideMenu = () => (contextMenu.style.display = "none");

  map.on("mousedown", hideMenu);
  document.addEventListener("mousedown", hideMenu);
}
