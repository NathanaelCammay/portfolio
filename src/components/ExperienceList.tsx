import type { Role } from '../data/profile';

export default function ExperienceList({ roles }: { roles: Role[] }) {
  return (
    <ol className="entries">
      {roles.map((role) => (
        <li className="entry" key={`${role.company}-${role.period}`}>
          <div className="entry-meta">{role.period}</div>
          <div>
            <h3>
              {role.title} <span className="at">· {role.company}</span>
            </h3>
            <p>{role.summary}</p>
            <ul className="tech" aria-label="Technologies">
              {role.tech.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
