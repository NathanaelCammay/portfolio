import type { Role } from '../data/profile';

export default function Experience({ roles }: { roles: Role[] }) {
  return (
    <>
      {roles.map((role) => (
        <article className="entry" key={`${role.company}-${role.period}`}>
          <div className="entry-head">
            <h3>
              {role.title} · {role.company}
            </h3>
            <span className="muted">{role.period}</span>
          </div>
          <ul>
            {role.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      ))}
    </>
  );
}
