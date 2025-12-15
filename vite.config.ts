import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@modules": path.resolve(__dirname, "src/modules"),
      "@libs": path.resolve(__dirname, "src/libs"),
    },
  },
});
