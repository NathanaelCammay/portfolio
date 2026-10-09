const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes a site path with the configured base, e.g. url('about') -> '/portfolio/about'. */
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;
