import { readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = fileURLToPath(new URL('.', import.meta.url));
const ignoredDirectories = new Set(['.git', '.kilo', '.kilicode', '.vercel', 'dist', 'legacy', 'node_modules', 'public']);

function findHtmlPages(directory = root) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : findHtmlPages(resolve(directory, entry.name));
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) return [];
    return [resolve(directory, entry.name)];
  });
}

const pages = Object.fromEntries(findHtmlPages().map((file) => {
  const key = relative(root, file).replaceAll('\\', '/').replace(/\.html$/, '');
  return [key, file];
}));

export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: pages } },
  server: { host: '0.0.0.0' },
});
