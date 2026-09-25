import { access, readFile, readdir, stat } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import process from 'node:process';
import { DEFAULT_SITE_URL, normalizeSiteUrl } from './seo-config.mjs';
import { SEO_ROUTES } from './seo-pages.mjs';

const root = process.cwd();
const live = process.argv.includes('--live');
const siteUrl = normalizeSiteUrl(process.env.SITE_URL || DEFAULT_SITE_URL);
const expectedRoutes = ['/', ...SEO_ROUTES];
const expectedUrls = expectedRoutes.map((route) => absolute(route));
const expectedUrlSet = new Set(expectedUrls);
const failures = [];
const warnings = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);

function absolute(route) {
  return `${siteUrl}${route === '/' ? '/' : route}`;
}

function routeFile(route) {
  if (route === '/') return resolve(root, 'dist', 'index.html');
  return resolve(root, 'dist', route.replace(/^\/+|\/+$/g, ''), 'index.html');
}

function parseAttributes(tag) {
  const attrs = new Map();
  const pattern = /([A-Za-z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  for (const match of tag.matchAll(pattern)) attrs.set(match[1].toLowerCase(), match[2] ?? match[3] ?? '');
  return attrs;
}

function findTag(html, tagName, predicate) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
  for (const match of html.matchAll(pattern)) {
    const attrs = parseAttributes(match[0]);
    if (predicate(attrs)) return attrs;
  }
  return null;
}

function meta(html, key, value) {
  return findTag(html, 'meta', (attrs) => attrs.get(key) === value)?.get('content') || '';
}

function canonical(html) {
  return findTag(html, 'link', (attrs) => (attrs.get('rel') || '').split(/\s+/).includes('canonical'))?.get('href') || '';
}

function title(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
}

function jsonLdBlocks(html, label) {
  const blocks = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch (error) {
      fail(`${label}: invalid JSON-LD (${error.message}).`);
    }
  }
  if (!blocks.length) fail(`${label}: no application/ld+json structured data found.`);
  return blocks;
}

function flattenGraph(blocks) {
  return blocks.flatMap((block) => Array.isArray(block?.['@graph']) ? block['@graph'] : [block]);
}

function routeChecks(html, route, label) {
  const expectedCanonical = absolute(route);
  const pageTitle = title(html);
  const description = meta(html, 'name', 'description');
  const robots = meta(html, 'name', 'robots').toLowerCase();
  const actualCanonical = canonical(html);
  const htmlLang = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1] || '';

  if (html.includes('__SITE_URL__')) fail(`${label}: unresolved __SITE_URL__ placeholder.`);
  if (htmlLang !== 'en-IN') fail(`${label}: html lang must be en-IN.`);
  if (!pageTitle) fail(`${label}: missing <title>.`);
  if (!description) fail(`${label}: missing meta description.`);
  if (!robots.includes('index') || !robots.includes('follow')) fail(`${label}: robots meta must allow index, follow.`);
  if (robots.includes('noindex')) fail(`${label}: unexpectedly contains noindex.`);
  if (actualCanonical !== expectedCanonical) fail(`${label}: canonical is ${actualCanonical || '(missing)'}, expected ${expectedCanonical}.`);
  if (meta(html, 'property', 'og:url') !== expectedCanonical) fail(`${label}: og:url does not match canonical.`);
  if (!meta(html, 'property', 'og:title')) fail(`${label}: missing og:title.`);
  if (!meta(html, 'property', 'og:description')) fail(`${label}: missing og:description.`);
  if (!meta(html, 'name', 'twitter:card')) fail(`${label}: missing twitter:card.`);

  const cspMeta = findTag(html, 'meta', (attrs) => (attrs.get('http-equiv') || '').toLowerCase() === 'content-security-policy')?.get('content') || '';
  if (!cspMeta) fail(`${label}: missing build-time Content-Security-Policy meta.`);
  else {
    if (!cspMeta.includes("script-src 'self'")) fail(`${label}: build-time CSP is missing script-src 'self'.`);
    if (!cspMeta.includes("script-src-attr 'none'")) fail(`${label}: build-time CSP does not block inline event handlers.`);
    if (!cspMeta.includes("'sha256-")) fail(`${label}: build-time CSP does not authorize inline JSON-LD with a SHA-256 hash.`);
  }

  if (pageTitle.length > 70) warn(`${label}: title is ${pageTitle.length} characters; review SERP truncation.`);
  if (description.length > 170) warn(`${label}: meta description is ${description.length} characters; review SERP truncation.`);

  if (route !== '/') {
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    if (h1Count !== 1) fail(`${label}: expected exactly one static H1, found ${h1Count}.`);
  }

  const nodes = flattenGraph(jsonLdBlocks(html, label));
  const ids = new Set(nodes.map((node) => node?.['@id']).filter(Boolean));
  const hotelId = `${siteUrl}/#hotel`;
  const websiteId = `${siteUrl}/#website`;
  const pageId = `${expectedCanonical}#webpage`;
  if (!ids.has(hotelId)) fail(`${label}: schema graph is missing the canonical Hotel entity ${hotelId}.`);
  if (!ids.has(websiteId)) fail(`${label}: schema graph is missing the WebSite entity ${websiteId}.`);
  if (!ids.has(pageId)) fail(`${label}: schema graph is missing the WebPage entity ${pageId}.`);

  const webPage = nodes.find((node) => node?.['@id'] === pageId);
  if (webPage?.url !== expectedCanonical) fail(`${label}: WebPage schema URL does not match canonical.`);
  if (webPage?.isPartOf?.['@id'] !== websiteId) fail(`${label}: WebPage isPartOf does not reference the canonical WebSite.`);
  if (webPage?.publisher?.['@id'] !== hotelId) fail(`${label}: WebPage publisher does not reference the canonical Hotel.`);

  if (route !== '/') {
    const breadcrumbId = `${expectedCanonical}#breadcrumb`;
    if (!ids.has(breadcrumbId)) fail(`${label}: schema graph is missing BreadcrumbList ${breadcrumbId}.`);
    if (webPage?.breadcrumb?.['@id'] !== breadcrumbId) fail(`${label}: WebPage breadcrumb reference is inconsistent.`);
  }

  return { pageTitle, actualCanonical };
}

function localReferences(html) {
  const refs = [];
  for (const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*>/gi)) {
    const attrs = parseAttributes(match[0]);
    const value = attrs.get('href') || attrs.get('src');
    if (value) refs.push(value);
  }
  return refs;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function validateLocalReferences(html, route, label) {
  for (const ref of localReferences(html)) {
    if (/^(?:#|mailto:|tel:|data:|blob:)/i.test(ref)) continue;
    let url;
    try {
      url = new URL(ref, absolute(route));
    } catch {
      fail(`${label}: malformed URL reference ${ref}.`);
      continue;
    }
    if (url.origin !== new URL(siteUrl).origin) continue;

    const path = url.pathname;
    if (path.endsWith('/')) {
      const routeUrl = `${siteUrl}${path}`;
      if (!expectedUrlSet.has(routeUrl)) fail(`${label}: internal document link points to unknown route ${path}.`);
      continue;
    }

    const diskPath = resolve(root, 'dist', path.replace(/^\//, ''));
    if (!await exists(diskPath)) fail(`${label}: referenced build asset does not exist: ${path}.`);
  }
}

function extractSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function compareSitemap(xml, label) {
  const urls = extractSitemapUrls(xml);
  const actual = new Set(urls);
  if (urls.length !== actual.size) fail(`${label}: contains duplicate <loc> entries.`);
  for (const url of expectedUrls) if (!actual.has(url)) fail(`${label}: missing ${url}.`);
  for (const url of actual) if (!expectedUrlSet.has(url)) fail(`${label}: unexpected URL ${url}.`);
}

function robotsChecks(text, label) {
  if (!/User-agent:\s*\*/i.test(text)) fail(`${label}: missing User-agent: *.`);
  if (!/Allow:\s*\//i.test(text)) fail(`${label}: missing Allow: /.`);
  if (/Disallow:\s*\/\s*$/im.test(text)) fail(`${label}: blocks the entire site.`);
  if (!text.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) fail(`${label}: sitemap URL does not match SITE_URL.`);
}

async function walk(dir) {
  const output = [];
  for (const entry of await readdir(dir)) {
    const full = resolve(dir, entry);
    const info = await stat(full);
    if (info.isDirectory()) output.push(...await walk(full));
    else output.push(full);
  }
  return output;
}

async function checkDist() {
  const dist = resolve(root, 'dist');
  if (!await exists(dist)) {
    fail('dist/ does not exist. Run npm run build first.');
    return;
  }

  const titles = new Map();
  const canonicals = new Map();
  for (const route of expectedRoutes) {
    const file = routeFile(route);
    const label = relative(root, file);
    if (!await exists(file)) {
      fail(`${label}: expected route output is missing.`);
      continue;
    }
    const html = await readFile(file, 'utf8');
    const result = routeChecks(html, route, label);
    await validateLocalReferences(html, route, label);

    if (result.pageTitle) {
      if (titles.has(result.pageTitle)) fail(`${label}: duplicate title also used by ${titles.get(result.pageTitle)}.`);
      else titles.set(result.pageTitle, label);
    }
    if (result.actualCanonical) {
      if (canonicals.has(result.actualCanonical)) fail(`${label}: duplicate canonical also used by ${canonicals.get(result.actualCanonical)}.`);
      else canonicals.set(result.actualCanonical, label);
    }
  }

  const sitemapPath = resolve(dist, 'sitemap.xml');
  const robotsPath = resolve(dist, 'robots.txt');
  if (!await exists(sitemapPath)) fail('dist/sitemap.xml is missing.');
  else compareSitemap(await readFile(sitemapPath, 'utf8'), 'dist/sitemap.xml');
  if (!await exists(robotsPath)) fail('dist/robots.txt is missing.');
  else robotsChecks(await readFile(robotsPath, 'utf8'), 'dist/robots.txt');

  const files = await walk(dist);
  if (files.some((file) => file.endsWith('.map'))) fail('dist/ contains production source maps.');
  if (files.some((file) => /(?:^|[\\/])\.env(?:\.|$)/.test(file))) fail('dist/ contains an environment file.');
}

const REQUIRED_LIVE_HEADERS = new Map([
  ['strict-transport-security', /max-age=/i],
  ['x-content-type-options', /^nosniff$/i],
  ['x-frame-options', /^DENY$/i],
  ['referrer-policy', /strict-origin-when-cross-origin/i],
  ['permissions-policy', /camera=\(\).*microphone=\(\)/i],
  ['cross-origin-opener-policy', /^same-origin$/i],
  ['origin-agent-cluster', /^\?1$/i],
  ['x-permitted-cross-domain-policies', /^none$/i],
]);

async function fetchText(url, label) {
  let response;
  try {
    response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
  } catch (error) {
    fail(`${label}: request failed (${error.message}).`);
    return null;
  }
  if (!response.ok) fail(`${label}: HTTP ${response.status}.`);
  return { response, text: await response.text() };
}

async function checkLive() {
  const rootUrl = await fetchText(`${siteUrl}/`, 'live homepage');
  if (rootUrl) {
    for (const [header, pattern] of REQUIRED_LIVE_HEADERS) {
      const value = rootUrl.response.headers.get(header) || '';
      if (!pattern.test(value)) fail(`live homepage: ${header} is missing or invalid (${value || 'missing'}).`);
    }
    const csp = rootUrl.response.headers.get('content-security-policy') || '';
    for (const directive of ["frame-ancestors 'none'", "object-src 'none'", "script-src-attr 'none'"]) {
      if (!csp.includes(directive)) fail(`live homepage: CSP header is missing ${directive}.`);
    }
  }

  const titles = new Map();
  for (const route of expectedRoutes) {
    const url = absolute(route);
    const result = await fetchText(url, `live ${route}`);
    if (!result) continue;
    const contentType = result.response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('text/html')) fail(`live ${route}: expected text/html, got ${contentType || 'missing'}.`);
    const checked = routeChecks(result.text, route, `live ${route}`);
    if (checked.pageTitle) {
      if (titles.has(checked.pageTitle)) fail(`live ${route}: duplicate title also used by ${titles.get(checked.pageTitle)}.`);
      else titles.set(checked.pageTitle, route);
    }
  }

  const robots = await fetchText(`${siteUrl}/robots.txt`, 'live robots.txt');
  if (robots) robotsChecks(robots.text, 'live robots.txt');
  const sitemap = await fetchText(`${siteUrl}/sitemap.xml`, 'live sitemap.xml');
  if (sitemap) compareSitemap(sitemap.text, 'live sitemap.xml');
}

try {
  if (live) await checkLive();
  else await checkDist();
} catch (error) {
  fail(error?.stack || String(error));
}

for (const message of warnings) console.warn(`[release] Warning: ${message}`);

if (failures.length) {
  console.error('[release] Failed checks:');
  for (const message of failures) console.error(` - ${message}`);
  process.exit(1);
}

console.log(`[release] ${live ? 'Live deployment' : 'Production build'} verification passed for ${expectedRoutes.length} routes.`);
if (!live) console.log(`[release] Run SITE_URL=${siteUrl} npm run release:check:live after deployment.`);
