const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

export function assetPath(path) {
  if (!path || typeof path !== 'string') return path;
  if (
    ABSOLUTE_URL_PATTERN.test(path) ||
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('#')
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return `${normalizedBase}${normalizedPath}`;
}
