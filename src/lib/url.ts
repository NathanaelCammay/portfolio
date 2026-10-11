const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes a site path with the configured base (currently '/'), e.g. url('about') -> '/about'. */
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;
