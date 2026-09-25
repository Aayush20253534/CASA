import { createHash } from 'node:crypto';
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { DEFAULT_SITE_URL, normalizeSiteUrl } from './scripts/seo-config.mjs';

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('base64');
}

function injectProductionCsp(html) {
  const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1])
    .filter((source) => source.trim().length > 0);
  const hashes = [...new Set(inlineScripts.map((source) => `'sha256-${sha256(source)}'`))];
  const scriptSources = ["'self'", ...hashes].join(' ');
  const policy = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "form-action 'self'",
    `script-src ${scriptSources}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
    "media-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
  const escaped = policy.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const meta = `<meta http-equiv="Content-Security-Policy" content="${escaped}" />`;

  if (html.includes('http-equiv="Content-Security-Policy"')) return html;
  return html.replace(/(<meta name="viewport"[^>]*\/>)/i, `$1\n    ${meta}`);
}

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
          const resolvedHtml = html.replaceAll('__SITE_URL__', siteUrl);
          return mode === 'production' ? injectProductionCsp(resolvedHtml) : resolvedHtml;
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
