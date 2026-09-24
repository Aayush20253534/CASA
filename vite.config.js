import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { DEFAULT_SITE_URL, normalizeSiteUrl } from './scripts/seo-config.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = normalizeSiteUrl(env.SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL);

  return {
    plugins: [
      react(),
      {
        name: 'casa-seo-html',
        transformIndexHtml(html) {
          return html.replaceAll('__SITE_URL__', siteUrl);
        },
      },
    ],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
            if (id.includes('node_modules/react')) return 'react';
          },
        },
      },
    },
  };
});
