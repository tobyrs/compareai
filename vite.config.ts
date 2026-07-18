import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // production build is served at https://tobyrs.github.io/compareai/
  base: command === "build" ? "/compareai/" : "/",
}));
