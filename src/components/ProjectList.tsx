interface Project {
  href: string;
  title: string;
  summary: string;
  stack: string[];
  year: number;
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="entries">
      {projects.map((project) => (
        <li className="entry" key={project.href}>
          <div className="entry-meta">{project.year}</div>
          <div>
            <h3>
              <a className="stretched" href={project.href}>
                {project.title}
                <span className="arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </h3>
            <p>{project.summary}</p>
            <ul className="tech" aria-label="Stack">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
