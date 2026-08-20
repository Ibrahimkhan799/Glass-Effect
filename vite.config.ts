import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  appType: "spa",
  resolve: {
    alias: {
      "glass-effect": path.resolve(__dirname, "src/index.ts"),
    },
  },
  build: {
    outDir: "dist-site",
    emptyOutDir: true,
  },
  preview: {
    port: 4173,
  },
});
