import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import glsl from 'vite-plugin-glsl';
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./ui-src",
  plugins: [reactRefresh(), viteSingleFile(), glsl()],
  assetsInclude: ['**/*.glb'],
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: "../dist",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});