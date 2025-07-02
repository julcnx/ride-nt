export function addKeyboardShortcuts(
  map,
  overlays,
  googleSatellite,
  currentBaseLayer,
) {
  function toggleOverlays() {
    const anyVisible = Object.values(overlays).some((layer) =>
      map.hasLayer(layer),
    );
    if (anyVisible) {
      Object.values(overlays).forEach((layer) => map.removeLayer(layer));
    } else {
      Object.values(overlays).forEach((layer) => map.addLayer(layer));
    }
  }

  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable)
    )
      return;

    if (e.key.toLowerCase() === "o") {
      toggleOverlays();
    } else if (e.key === "Delete") {
      localStorage.clear();
      location.reload();
    }
  });
}
