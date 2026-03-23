import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Google Sign-In / GIS use postMessage from the OAuth context; COOP: same-origin blocks it.
    // same-origin-allow-popups matches Google’s guidance for Sign In With Google on the web.
    // headers: {
    //   "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    // },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
