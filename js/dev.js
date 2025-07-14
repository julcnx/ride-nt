export function isDev() {
  return location.protocol.startsWith("file");
}
