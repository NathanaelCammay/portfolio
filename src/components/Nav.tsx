import { profile } from '../data/profile';
import { cleanPath, url } from '../lib/url';

const links = [
  { path: '', label: 'Home' },
  { path: 'projects', label: 'Projects' },
  { path: 'about', label: 'About' },
  { path: 'contact', label: 'Contact' },
];

export default function Nav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="site-nav" aria-label="Main">
      <a className="brand" href={url()}>
        {profile.name}
      </a>
      <ul>
        {links.map(({ path, label }) => {
          const href = url(path);
          const exact = cleanPath(href) === cleanPath(currentPath);
          // Highlight "Projects" on individual project pages too.
          const section = path !== '' && cleanPath(currentPath).startsWith(`${cleanPath(href)}/`);
          return (
            <li key={label}>
              <a href={href} aria-current={exact ? 'page' : section ? 'true' : undefined}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
