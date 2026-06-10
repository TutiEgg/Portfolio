import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Adjust `base` to match the GitHub Pages repository name,
// e.g. 'https://<user>.github.io/<repo-name>/'.
// For a user/organization site (served at the domain root) set base: '/'.
const repoName = process.env.VITE_REPO_NAME ?? 'portfolio';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    css: true,
  },
});
