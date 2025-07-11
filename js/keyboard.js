export function addKeyboardShortcuts(
  map,
  mainOverlay,
  overlays,
  googleSatellite,
  currentBaseLayer
) {
  function toggleOverlays(all = false) {
    const el = document.getElementById("map");
    if (el.classList.contains("hide-overlays")) {
      // If overlays are hidden, show them
      el.classList.remove("hide-overlays");
      mainOverlay.setOpacity(1);
    } else {
      el.classList.toggle("hide-overlays"); // toggles the 'hidden' class on/off
      mainOverlay.setOpacity(all ? 0 : 1);
    }
  }

  function toggleSatellite() {
    const slider = document.querySelector(".transparency-slider");
    if (!slider) return;

    const current = parseInt(slider.value, 10);
    slider.value = current === 100 ? "0" : "100";

    // Trigger the input event so it behaves reactively
    slider.dispatchEvent(new Event("input", { bubbles: true }));
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

    if (e.key.toLowerCase() === "a") {
      toggleOverlays(true);
    } else if (e.key.toLowerCase() === "q") {
      toggleOverlays(false);
    } else if (e.key.toLowerCase() === "s") {
      toggleSatellite();
    } else if (e.key === "Delete") {
      localStorage.clear();
      location.reload();
    }
  });
}
