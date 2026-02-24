import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync } from "fs";

export default defineConfig({
  root: resolve(__dirname, "src"), // Make sure this is an absolute path
  build: {
    outDir: resolve(__dirname, "dist"), // Use absolute path
    emptyOutDir: true, // Add this to clear the output directory
    rollupOptions: {
      input: readdirSync(resolve(__dirname, "src"))
        .filter((file) => file.endsWith(".html"))
        .reduce((acc, file) => {
          const name = file.replace(".html", "");
          acc[name] = resolve(__dirname, "src", file);
          return acc;
        }, {}),
    },
  },
  server: {
    port: 5173,
  },
  publicDir: resolve(__dirname, "assets"), // Use absolute path for public directory
});
