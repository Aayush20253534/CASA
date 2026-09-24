export const DEFAULT_SITE_URL = 'https://casa-mauve-three.vercel.app';

export function normalizeSiteUrl(value = DEFAULT_SITE_URL) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`SITE_URL must be a valid absolute URL. Received: ${value}`);
  }

  if (url.protocol !== 'https:') {
    throw new Error(`SITE_URL must use HTTPS in production. Received: ${value}`);
  }

  if (url.username || url.password || url.search || url.hash) {
    throw new Error('SITE_URL must contain only the public origin/path, without credentials, query parameters or a fragment.');
  }

  const pathname = url.pathname.replace(/\/+$/, '');
  return `${url.origin}${pathname === '/' ? '' : pathname}`;
}
