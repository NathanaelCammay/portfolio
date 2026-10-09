interface Props {
  title: string;
  summary: string;
  stack: string[];
  href: string;
}

export default function ProjectCard({ title, summary, stack, href }: Props) {
  return (
    <article className="card">
      <h2>
        <a href={href}>{title}</a>
      </h2>
      <p className="muted">{summary}</p>
      <ul className="tags" aria-label="Stack">
        {stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </article>
  );
}
