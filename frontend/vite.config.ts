import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Setze hier den Repository-Namen ein, z.B. base: '/coach_os/'
  base: '/coach_max/',
});
