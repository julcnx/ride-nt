import { isDev } from "./dev.js";

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
        `https://www.openstreetmap.org/edit?editor=id&lat=${lat}&lon=${lng}&zoom=${Math.max(
          16,
          map.getZoom()
        )}`
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
        alert("Coordinates copied to clipboard.");
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
