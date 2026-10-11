const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes a site path with the configured base (currently '/'), e.g. url('about') -> '/about'. */
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;

/**
 * Normalises a page's path for comparison and canonical URLs.
 * With build.format 'file', Astro reports paths like /about.html or /index.html; this returns /about or ''.
 */
export const cleanPath = (path: string) => path.replace(/(\/index)?\.html$/, '').replace(/\/$/, '');
