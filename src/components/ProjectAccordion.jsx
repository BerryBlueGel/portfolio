import { useState } from 'react'
import './ProjectAccordion.css'

export default function ProjectAccordion({ projects }) {
  const [active, setActive] = useState(0)

  return (
    <div className="project-accordion" role="list" aria-label="项目图层">
      {projects.map((project, index) => {
        const expanded = active === index

        return (
          <article
            role="listitem"
            className={`project-panel ${expanded ? 'is-active' : ''}`}
            key={project.id}
            onMouseEnter={() => setActive(index)}
          >
            <a
              className="project-panel__surface"
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-labelledby={`project-title-${project.id}`}
              onFocus={() => setActive(index)}
            >
              <img
                className="project-panel__poster"
                src={project.image}
                alt={project.alt}
                width={1774}
                height={887}
                loading="lazy"
                decoding="async"
              />
              <div className="project-panel__veil" aria-hidden="true" />
              {expanded && <p className="project-panel__description">{project.description}</p>}
              <div className="project-panel__caption">
                <span className="project-panel__number" aria-hidden="true">
                  {project.id} / {String(projects.length).padStart(2, '0')}
                </span>
                <div>
                  <h3 id={`project-title-${project.id}`}>{project.title}</h3>
                  {expanded && <p className="project-panel__stack">{project.subtitle}</p>}
                </div>
              </div>
            </a>
          </article>
        )
      })}
    </div>
  )
}
