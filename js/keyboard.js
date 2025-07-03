export function addKeyboardShortcuts(
  map,
  overlays,
  googleSatellite,
  currentBaseLayer,
) {
  function toggleOverlays() {
    const el = document.getElementById('map');
    el.classList.toggle('hide-overlays'); // toggles the 'hidden' class on/off
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
