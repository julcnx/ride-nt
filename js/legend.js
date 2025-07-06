export function addLegend(map) {
	const legend = L.control({ position: "bottomright" });

	legend.onAdd = function () {
		const container = L.DomUtil.create("div", "info legend");
		container.style.position = "relative";
		container.style.transition = "all 0.3s ease";
		container.style.fontSize = "14px";
		container.style.color = "#333";
		container.style.maxWidth = "250px";

		const opacity = 1;
		const storageKey = "rideNT-legend-visible";
		let isVisible = localStorage.getItem(storageKey) !== "false"; // default true

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

		// --- Full panel content
		const panel = document.createElement("div");
		panel.style.background = "rgba(255, 255, 255, 0.95)";
		panel.style.borderRadius = "6px";
		panel.style.padding = "8px";
		panel.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
		panel.style.display = "none";
		panel.style.flexDirection = "column";

		const header = document.createElement("div");
		header.style.display = "flex";
		header.style.justifyContent = "space-between";
		header.style.alignItems = "center";
		header.style.marginBottom = "6px";

		const title = document.createElement("span");
		title.textContent = "RideNT Legend";
		title.style.fontWeight = "bold";

		const collapseBtn = document.createElement("a");
		collapseBtn.href = "#";
		collapseBtn.innerHTML = "🔽";
		collapseBtn.title = "Collapse legend";
		collapseBtn.style.fontSize = "18px";
		collapseBtn.style.textDecoration = "none";
		collapseBtn.style.cursor = "pointer";
		collapseBtn.style.padding = "4px";

		collapseBtn.onclick = (e) => {
			e.preventDefault();
			isVisible = false;
			updateVisibility();
		};

		header.appendChild(title);
		header.appendChild(collapseBtn);

		const content = document.createElement("div");
		content.innerHTML = `
			${colorBox(PAVED_COLOR)} Paved<br>
			${colorBox("rgba(0,140,60,OPACITY)")} Fast dirt<br>
			${colorBox("rgba(255,179,0,OPACITY)")} Moderate dirt<br>
			${colorBox("rgba(255,40,40,OPACITY)")} Slow / Technical<br>
			${colorBox("rgba(128,0,128,OPACITY)")} Very technical<br>
			${colorBox(MAYBE_COLOR)} Potential trail<br>
			<br>
			<span class="caption">Speeds are approximate, based on dry GPX tracks with climate & rider factors considered. Accuracy not guaranteed.</span>
		`;

		panel.appendChild(header);
		panel.appendChild(content);

		// --- Floating icon button (only shown when collapsed)
		const iconBtn = document.createElement("a");
		iconBtn.href = "#";
		iconBtn.innerHTML = "❓";
		iconBtn.title = "Show legend";
		iconBtn.style.display = "none";
		iconBtn.style.textDecoration = "none";
		iconBtn.style.fontSize = "20px";
		iconBtn.style.width = "36px";
		iconBtn.style.height = "36px";
		iconBtn.style.textAlign = "center";
		iconBtn.style.lineHeight = "36px";
		iconBtn.style.borderRadius = "6px";
		iconBtn.style.background = "white";
		iconBtn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
		iconBtn.style.cursor = "pointer";

		iconBtn.onclick = (e) => {
			e.preventDefault();
			isVisible = true;
			updateVisibility();
		};

		function updateVisibility() {
			localStorage.setItem(storageKey, isVisible);
			panel.style.display = isVisible ? "flex" : "none";
			iconBtn.style.display = isVisible ? "none" : "inline-block";
		}

		updateVisibility();

		container.appendChild(panel);
		container.appendChild(iconBtn);

		return container;
	};

	legend.addTo(map);
}
