import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { DEFAULT_SITE_URL, normalizeSiteUrl } from './seo-config.mjs';
import { SEO_ROUTES, renderSeoPage } from './seo-pages.mjs';

const mode = process.argv[2] || 'production';
const env = loadEnv(mode, process.cwd(), '');
const siteUrl = normalizeSiteUrl(env.SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL);
const publicDir = resolve(process.cwd(), 'public');

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
const sitemapRoutes = ['/', ...SEO_ROUTES];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n  </url>`).join('\n')}\n</urlset>\n`;

await mkdir(publicDir, { recursive: true });
const seoPages = SEO_ROUTES.map(async (path) => {
  const outputDir = resolve(publicDir, path.replace(/^\/+|\/+$/g, ''));
  await mkdir(outputDir, { recursive: true });
  await writeFile(resolve(outputDir, 'index.html'), renderSeoPage(path, siteUrl), 'utf8');
});

await Promise.all([
  writeFile(resolve(publicDir, 'robots.txt'), robots, 'utf8'),
  writeFile(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf8'),
  ...seoPages,
]);

console.log(`[seo] Generated robots.txt, sitemap.xml and ${SEO_ROUTES.length} crawlable landing pages for ${siteUrl}`);
