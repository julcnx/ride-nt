import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/ride-nt/",
  root: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "js/index.js"),
      },
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name].js",
        assetFileNames: ({ name }) => {
          if (/\.css$/.test(name || "")) {
            return "css/[name][extname]";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        include: [path.resolve(__dirname, "css/index.css")],
      },
    },
  },
  server: {
    open: "/index.html",
  },
});
