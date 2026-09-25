import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const checkDist = process.argv.includes('--dist');
const failures = [];
const fail = (message) => failures.push(message);
const read = (path) => readFile(resolve(root, path), 'utf8');
const readJson = async (path) => JSON.parse(await read(path));

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

function trackedFiles() {
  try {
    return execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
      .split('\0')
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function checkSource() {
  const pkg = await readJson('package.json');
  const lock = await readJson('package-lock.json');
  const vercel = await readJson('vercel.json');

  if (pkg.private !== true) fail('package.json must remain private=true.');
  if (!pkg.engines?.node?.includes('22.12')) fail('package.json must enforce the supported Node 22.12+ runtime.');
  if (lock.lockfileVersion !== 3) fail('package-lock.json must use lockfileVersion 3.');
  if (!pkg.scripts?.['security:check']) fail('security:check script is missing.');

  const globalHeaders = vercel.headers?.find((rule) => rule.source === '/(.*)')?.headers || [];
  const headers = new Map(globalHeaders.map(({ key, value }) => [key.toLowerCase(), value]));
  const csp = headers.get('content-security-policy') || '';
  for (const directive of ["frame-ancestors 'none'", "object-src 'none'", "form-action 'self'", "script-src-attr 'none'"]) {
    if (!csp.includes(directive)) fail(`CSP header is missing: ${directive}`);
  }
  if (csp.includes("script-src 'unsafe-inline'")) fail('CSP must not enable unsafe-inline JavaScript.');
  if (headers.get('cross-origin-opener-policy') !== 'same-origin') fail('COOP must be same-origin.');
  if (headers.get('x-content-type-options') !== 'nosniff') fail('X-Content-Type-Options must be nosniff.');
  if (headers.get('x-frame-options') !== 'DENY') fail('X-Frame-Options must be DENY.');

  const tracked = trackedFiles();
  for (const path of tracked) {
    if (/^\.env(?:\.|$)/.test(path) && path !== '.env.example') fail(`Tracked environment file: ${path}`);
    if (/\.(?:pem|key|p12|pfx)$/i.test(path)) fail(`Tracked credential/key file: ${path}`);
  }

  const codeFiles = tracked.filter((path) => ['.js', '.jsx', '.mjs', '.html'].includes(extname(path)) && path !== 'scripts/security-check.mjs');
  const secretFiles = tracked.filter((path) => ['.js', '.jsx', '.mjs', '.html', '.json', '.yml', '.yaml', '.md', '.txt'].includes(extname(path)) && !['scripts/security-check.mjs', 'package-lock.json'].includes(path));
  const forbidden = [
    [/\beval\s*\(/, 'eval()'],
    [/new\s+Function\s*\(/, 'Function constructor'],
    [/document\.write\s*\(/, 'document.write()'],
    [/dangerouslySetInnerHTML\s*=/, 'dangerouslySetInnerHTML'],
    [/\.innerHTML\s*=/, 'innerHTML assignment'],
    [/javascript\s*:/i, 'javascript: URL'],
  ];
  const secretPatterns = [
    [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key'],
    [/(?:^|[^A-Za-z0-9])ghp_[A-Za-z0-9]{30,}/m, 'GitHub token'],
    [/(?:^|[^A-Za-z0-9])github_pat_[A-Za-z0-9_]{20,}/m, 'GitHub fine-grained token'],
    [/(?:^|[^A-Za-z0-9])AKIA[0-9A-Z]{16}/m, 'AWS access key'],
    [/(?:^|[^A-Za-z0-9])xox[baprs]-[A-Za-z0-9-]{20,}/m, 'Slack token'],
  ];

  for (const path of codeFiles) {
    const source = await read(path);
    for (const [pattern, label] of forbidden) if (pattern.test(source)) fail(`${path}: forbidden ${label}.`);
  }

  for (const path of secretFiles) {
    const source = await read(path);
    for (const [pattern, label] of secretPatterns) if (pattern.test(source)) fail(`${path}: possible ${label}.`);
  }
}

async function checkBuild() {
  const dist = resolve(root, 'dist');
  const files = await walk(dist);
  const htmlFiles = files.filter((path) => path.endsWith('.html'));
  if (!htmlFiles.length) fail('No built HTML files found in dist/. Run npm run build first.');
  if (files.some((path) => path.endsWith('.map'))) fail('Production build contains source maps.');

  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const name = relative(root, file);
    if (html.includes('__SITE_URL__')) fail(`${name}: unresolved SITE_URL placeholder.`);
    const meta = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"\s*\/>/i);
    if (!meta) {
      fail(`${name}: missing build-time CSP meta policy.`);
      continue;
    }
    const csp = meta[1].replaceAll('&quot;', '"').replaceAll('&amp;', '&');
    if (!csp.includes("script-src 'self'")) fail(`${name}: CSP script-src is missing self.`);
    if (!csp.includes("script-src-attr 'none'")) fail(`${name}: CSP does not block inline event handlers.`);
    if (csp.includes("script-src 'unsafe-inline'")) fail(`${name}: CSP allows unsafe-inline JavaScript.`);
    if (/<script(?![^>]*\bsrc=)[^>]*>\s*[\s\S]+?<\/script>/i.test(html) && !/script-src[^;]*'sha256-/i.test(csp)) {
      fail(`${name}: inline script exists without a CSP SHA-256 hash.`);
    }
  }
}

try {
  if (checkDist) await checkBuild();
  else await checkSource();
} catch (error) {
  fail(error?.stack || String(error));
}

if (failures.length) {
  console.error('[security] Failed checks:');
  failures.forEach((message) => console.error(` - ${message}`));
  process.exit(1);
}

console.log(`[security] ${checkDist ? 'Production build' : 'Source'} checks passed.`);
