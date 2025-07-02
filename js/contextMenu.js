export function addContextMenu(map, googleSatellite, currentBaseLayer) {
  const contextMenu = document.getElementById("context-menu");

  function addMenuItem(label, action) {
    const item = document.createElement("div");
    item.innerText = label;
    item.onclick = () => {
      action();
      contextMenu.style.display = "none";
    };
    contextMenu.appendChild(item);
  }

  map.on("contextmenu", function (e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    contextMenu.innerHTML = "";

    addMenuItem("Edit in OpenStreetMap", () => {
      window.open(
        `https://www.openstreetmap.org/edit?editor=id&lat=${lat}&lon=${lng}&zoom=18`,
        "_blank",
      );
    });

    addMenuItem("Copy Coordinates", () => {
      navigator.clipboard.writeText(`${lat}, ${lng}`).then(() => {
        alert("Coordinates copied to clipboard.");
      });
    });

    addMenuItem("Open in Google Maps", () => {
      const isSatellite = currentBaseLayer === googleSatellite;
      const mapType = isSatellite ? "&t=k" : "";
      window.open(
        `https://maps.google.com/?q=${lat},${lng}${mapType}`,
        "_blank",
      );
    });

    addMenuItem("Open in Google Street View", () => {
      window.open(
        `https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}`,
        "_blank",
      );
    });

    contextMenu.style.left = e.originalEvent.pageX + "px";
    contextMenu.style.top = e.originalEvent.pageY + "px";
    contextMenu.style.display = "block";
  });

  map.on("click", () => (contextMenu.style.display = "none"));
  document.addEventListener(
    "click",
    () => (contextMenu.style.display = "none"),
  );
}
