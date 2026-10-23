import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import babel from "@rolldown/plugin-babel"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
})
