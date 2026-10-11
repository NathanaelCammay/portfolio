import { useEffect, useState } from 'react';

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

// Desktop-only nav that highlights the section currently being read.
// It renders as plain anchor links first, so it works before (and without) JavaScript.
export default function SectionNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      // The current section is the last one whose top has scrolled above 40% of the viewport.
      const line = window.innerHeight * 0.4;
      const current = atBottom
        ? targets[targets.length - 1]
        : targets.filter((el) => el.getBoundingClientRect().top <= line).pop();
      setActive(current?.id ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="section-nav" aria-label="Sections">
      <ol>
        {sections.map(({ id, label }, i) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
              <span>
                <span className="num">0{i + 1}</span> {label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
