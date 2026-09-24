import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { DEFAULT_SITE_URL, normalizeSiteUrl } from './scripts/seo-config.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = normalizeSiteUrl(env.SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL);

  return {
    appType: 'mpa',
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
        input: {
          main: resolve(process.cwd(), 'index.html'),
          rooms: resolve(process.cwd(), 'rooms/index.html'),
          banquetEvents: resolve(process.cwd(), 'banquet-events/index.html'),
          location: resolve(process.cwd(), 'location/index.html'),
          nearby: resolve(process.cwd(), 'nearby/index.html'),
          nearbyTriveniSangam: resolve(process.cwd(), 'nearby/triveni-sangam/index.html'),
          nearbyAnandBhawan: resolve(process.cwd(), 'nearby/anand-bhawan/index.html'),
          nearbyPrayagrajJunction: resolve(process.cwd(), 'nearby/prayagraj-junction/index.html'),
        },
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
