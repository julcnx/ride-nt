export function markDevTitle() {
	if (
		location.hostname === "localhost" ||
		location.hostname === "127.0.0.1"
	) {
		document.title += " (DEV)";
	}
}