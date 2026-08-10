import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built site works from any path, including a plain
// double-clicked file, not just the domain root.
export default defineConfig({
  base: './',
  plugins: [react()],
});
