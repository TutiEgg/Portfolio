import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Actions passes the repository name so assets resolve under /<repo>/.
// Manual production builds fall back to relative paths, which also work on
// project pages such as https://<user>.github.io/<repo>/.
const repoName = process.env.VITE_REPO_NAME;

export default defineConfig({
  base:
    process.env.NODE_ENV === 'production'
      ? repoName
        ? `/${repoName}/`
        : './'
      : '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    css: true,
  },
});
