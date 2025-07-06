import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const tilesFolder = path.resolve(__dirname, 'public/tiles');

let tilesTimestamp = '0';
try {
  const stats = fs.statSync(tilesFolder);
  tilesTimestamp = String(stats.mtimeMs); // or stats.ctimeMs for creation time
} catch (e) {
  // folder might not exist yet, keep timestamp = '0'
  console.warn('Tiles folder not found:', e.message);
}

export default defineConfig({
  base: '/ride-nt/',
  define: {
    __TILES_TIMESTAMP__: JSON.stringify(tilesTimestamp),
  },
});
