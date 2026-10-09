import { profile } from '../data/profile';
import { url } from '../lib/url';

const links = [
  { path: '', label: 'Home' },
  { path: 'projects', label: 'Projects' },
  { path: 'about', label: 'About' },
  { path: 'contact', label: 'Contact' },
];

// With build.format 'file', Astro reports paths like /portfolio/about.html or /portfolio/index.html.
const trim = (path: string) => path.replace(/(\/index)?\.html$/, '').replace(/\/$/, '');

export default function Nav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="site-nav" aria-label="Main">
      <a className="brand" href={url()}>
        {profile.name}
      </a>
      <ul>
        {links.map(({ path, label }) => {
          const href = url(path);
          const exact = trim(href) === trim(currentPath);
          // Highlight "Projects" on individual project pages too.
          const section = path !== '' && trim(currentPath).startsWith(`${trim(href)}/`);
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
