import { profile } from '../data/profile';
import { url } from '../lib/url';

const links = [
  { path: '', label: 'Home' },
  { path: 'about', label: 'About' },
  { path: 'contact', label: 'Contact' },
];

const trim = (path: string) => path.replace(/\/$/, '');

export default function Nav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="site-nav" aria-label="Main">
      <a className="brand" href={url()}>
        {profile.name}
      </a>
      <ul>
        {links.map(({ path, label }) => {
          const href = url(path);
          const current = trim(href) === trim(currentPath);
          return (
            <li key={label}>
              <a href={href} aria-current={current ? 'page' : undefined}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
