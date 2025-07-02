export function addLegend(map) {
	const legend = L.control({ position: "bottomright" });

	legend.onAdd = function () {
		const div = L.DomUtil.create("div", "info legend");
		div.style.background = "rgba(255, 255, 255, 0.9)";
		div.style.padding = "8px";
		div.style.borderRadius = "5px";
		div.style.fontSize = "14px";
		div.style.color = "#333";
		div.style.lineHeight = "1.4";
		div.style.width = "200px";
		div.style.position = "relative";
		div.style.transition = "all 0.3s ease";

		const opacity = 1;

		function colorBox(color) {
			return `<span style="
				display:inline-block;
				width:14px;
				height:10px;
				margin-right:8px;
				background-color:${color.replace("OPACITY", opacity)};
				vertical-align:middle;
			"></span>`;
		}

		const PAVED_COLOR = "rgba(51, 102, 255, 1)";
		const MAYBE_COLOR = "rgba(160,160,160,1)";

		const storageKey = "rideNT-legend-visible";
		let isVisible = localStorage.getItem(storageKey) !== "false"; // default true

		// --- Header with title and toggle button
		const header = document.createElement("div");
		header.style.display = "flex";
		header.style.justifyContent = "space-between";
		header.style.alignItems = "center";
		header.style.cursor = "pointer";

		const title = document.createElement("span");
		title.textContent = "RideNT Legend";

		const toggleBtn = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"svg",
		);
		toggleBtn.setAttribute("width", "20");
		toggleBtn.setAttribute("height", "20");
		toggleBtn.setAttribute("viewBox", "0 0 24 24");
		toggleBtn.style.transition = "transform 0.2s ease";
		toggleBtn.innerHTML = `<path fill="#333" d="M7 10l5 5 5-5z"/>`; // down

		header.appendChild(title);
		header.appendChild(toggleBtn);

		// --- Collapsible content
		const content = document.createElement("div");
		content.id = "legend-content";
		content.innerHTML = `
			${colorBox(PAVED_COLOR)} Paved<br>
			${colorBox("rgba(0,140,60,OPACITY)")} Fast dirt <span class="caption">&gt; 30km/h</span> <br>
			${colorBox("rgba(255,179,0,OPACITY)")} Moderate dirt <span class="caption">15–30 km/h</span><br>
			${colorBox("rgba(255,40,40,OPACITY)")} Slow / Technical <span class="caption">7–15 km/h</span><br>
			${colorBox("rgba(128,0,128,OPACITY)")} Very technical <span class="caption">&lt; 7 km/h</span><br>
			${colorBox(MAYBE_COLOR)} Potential trail<br>
			<br>
			<span class="caption">Speeds are approximate, calculated from GPX trails in dry conditions, with climate season and rider speed factors considered, but accuracy is not guaranteed.</span>
		`;

		const updateVisibility = () => {
			content.style.display = isVisible ? "block" : "none";
			title.style.fontWeight = isVisible ? "bold" : "normal";
			header.style.marginBottom = isVisible ? "6px" : "0px";
			toggleBtn.innerHTML = isVisible
				? `<path fill="#333" d="M7 10l5 5 5-5z"/>` // down
				: `<path fill="#333" d="M7 14l5-5 5 5z"/>`; // up
			localStorage.setItem(storageKey, isVisible);
		};

		header.onclick = () => {
			isVisible = !isVisible;
			updateVisibility();
		};

		updateVisibility();

		div.appendChild(header);
		div.appendChild(content);
		return div;
	};

	legend.addTo(map);
}
