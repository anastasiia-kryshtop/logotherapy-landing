import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "assets",
  server: {
    open: false,
    port: 5173,
  },
});
