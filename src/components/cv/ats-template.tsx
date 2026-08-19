import type { RefObject } from "react"

import { A4Page } from "@/components/cv/a4-page"
import { CVMarkdown } from "@/components/cv/cv-markdown"
import { cn } from "@/lib/utils"
import type { CVData } from "@/types/cv"

interface AtsTemplateProps {
  data: CVData
  pageRef?: RefObject<HTMLElement | null>
}

function dateRange(startDate?: string, endDate?: string, current?: boolean) {
  return [startDate, current ? "Actualidad" : endDate].filter(Boolean).join(" - ")
}

function Section({
  title,
  children,
  dense = false,
}: {
  title: string
  children: React.ReactNode
  dense?: boolean
}) {
  return (
    <section className={dense ? "space-y-1.5" : "space-y-2.5"}>
      <h2
        className={cn(
          "border-b border-zinc-400 pb-1 font-bold uppercase tracking-normal text-zinc-950",
          dense ? "text-[11px]" : "text-[12px]"
        )}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function InlineList({ items, className }: { items: string[]; className?: string }) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) return null

  return (
    <p className={cn("text-[11px] leading-5 text-zinc-800", className)}>
      {filtered.join(" | ")}
    </p>
  )
}

function ExperienceItem({
  item,
  bodyText,
  dense = false,
}: {
  item: CVData["experience"][number]
  bodyText: string
  dense?: boolean
}) {
  return (
    <article className={cn("break-inside-avoid", dense ? "space-y-1" : "space-y-1.5")}>
      <h3
        className={cn(
          "font-bold text-zinc-950",
          dense ? "text-[12px] leading-4" : "text-[13px] leading-5"
        )}
      >
        {item.position}
      </h3>
      <p
        className={cn(
          "font-semibold text-zinc-800",
          dense ? "text-[10px] leading-3.5" : "text-[11px] leading-4"
        )}
      >
        {item.company}
        {item.location ? ` | ${item.location}` : ""}
        {dateRange(item.startDate, item.endDate, item.current)
          ? ` | ${dateRange(item.startDate, item.endDate, item.current)}`
          : ""}
      </p>
      {item.description ? (
        <CVMarkdown className={cn(bodyText, "text-zinc-700")}>
          {item.description}
        </CVMarkdown>
      ) : null}
      <ul className={cn("list-disc pl-4 text-zinc-700", bodyText)}>
        {item.bullets.filter(Boolean).map((bullet) => (
          <li key={bullet}>
            <CVMarkdown>{bullet}</CVMarkdown>
          </li>
        ))}
      </ul>
      {item.technologies.length > 0 ? (
        <p
          className={cn(
            "text-zinc-800",
            dense ? "text-[10px] leading-[1.35]" : "text-[11px] leading-5"
          )}
        >
          <span className="font-bold text-zinc-950">Tecnologías: </span>
          {item.technologies.join(", ")}
        </p>
      ) : null}
    </article>
  )
}

export function MultiPageAtsTemplate({ data, pageRef }: AtsTemplateProps) {
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.settings.showLocation ? data.personal.location : "",
    ...(data.settings.showLinks ? data.personal.links.map((link) => link.url) : []),
  ].filter(Boolean)
  const bodyText = "text-[11px] leading-5"
  const sectionSpace = "space-y-4"
  const [firstExperience, ...remainingExperience] = data.experience
  const showProjects = data.settings.showProjects && data.projects.length > 0
  const showSpecializations =
    data.settings.showSpecializations && data.specializations.length > 0
  const hasSecondPage =
    remainingExperience.length > 0 ||
    showProjects ||
    data.education.length > 0 ||
    data.skills.length > 0 ||
    data.languages.length > 0 ||
    showSpecializations

  return (
    <div className="space-y-8">
      <A4Page>
        <article
          ref={pageRef}
          className="h-[297mm] overflow-hidden bg-white px-14 py-10 text-zinc-950"
        >
          <header className="space-y-1.5 border-b border-zinc-400 pb-4 text-left">
            <h1 className="text-[26px] font-bold leading-none">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <p className="text-[12px] font-semibold text-zinc-800">
              {data.personal.professionalTitle}
            </p>
            <p className="text-[10px] leading-4 text-zinc-700">
              {contacts.join(" | ")}
            </p>
          </header>

          <main className={cn("pt-6", sectionSpace)}>
            {data.summary.trim() ? (
              <Section title="Resumen profesional">
                <CVMarkdown className={cn(bodyText, "text-zinc-700")}>
                  {data.summary}
                </CVMarkdown>
              </Section>
            ) : null}

            {firstExperience ? (
              <Section title="Experiencia">
                <ExperienceItem item={firstExperience} bodyText={bodyText} />
              </Section>
            ) : null}
          </main>
        </article>
      </A4Page>

      {hasSecondPage ? (
        <A4Page>
          <article className="h-[297mm] overflow-hidden bg-white px-12 py-10 text-zinc-950">
            <main className={sectionSpace}>
              {remainingExperience.length > 0 ? (
                <Section title="Experiencia">
                  <div className="space-y-3.5">
                    {remainingExperience.map((item) => (
                      <ExperienceItem key={item.id} item={item} bodyText={bodyText} />
                    ))}
                  </div>
                </Section>
              ) : null}

              {showProjects ? (
                <Section title="Proyectos">
                  <div className="space-y-2.5">
                    {data.projects.map((project) => (
                      <article key={project.id} className="space-y-1 break-inside-avoid">
                        <h3 className="text-[12px] font-bold">{project.name}</h3>
                        {project.description ? (
                          <CVMarkdown className={cn(bodyText, "text-zinc-700")}>
                            {project.description}
                          </CVMarkdown>
                        ) : null}
                        <InlineList items={project.technologies} />
                      </article>
                    ))}
                  </div>
                </Section>
              ) : null}

              <div className="space-y-4">
                <Section title="Educación">
                  <div className="space-y-2.5">
                    {data.education.map((item) => (
                      <article key={item.id} className="break-inside-avoid">
                        <h3 className="text-[11px] font-bold text-zinc-950">{item.degree}</h3>
                        <p className="text-[11px] leading-5 text-zinc-800">
                          {item.institution}
                          {dateRange(item.startDate, item.endDate)
                            ? ` | ${dateRange(item.startDate, item.endDate)}`
                            : ""}
                        </p>
                      </article>
                    ))}
                  </div>
                </Section>
                <Section title="Habilidades">
                  <div className="space-y-1">
                    {data.skills.map((category) => (
                      <p key={category.id} className="text-[11px] leading-5 text-zinc-800">
                        <span className="font-bold text-zinc-950">{category.name}: </span>
                        {category.skills.join(", ")}
                      </p>
                    ))}
                  </div>
                </Section>
              </div>

              {(data.languages.length > 0 || showSpecializations) ? (
                <div className="space-y-4">
                  {data.languages.length > 0 ? (
                    <Section title="Idiomas">
                      <InlineList
                        items={data.languages.map((item) => `${item.language}: ${item.level}`)}
                      />
                    </Section>
                  ) : null}

                  {showSpecializations ? (
                    <Section title="Áreas de especialización">
                      <InlineList items={data.specializations} />
                    </Section>
                  ) : null}
                </div>
              ) : null}
            </main>
          </article>
        </A4Page>
      ) : null}
    </div>
  )
}

export function AtsTemplate({ data, pageRef }: AtsTemplateProps) {
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.settings.showLocation ? data.personal.location : "",
    ...(data.settings.showLinks ? data.personal.links.map((link) => link.url) : []),
  ].filter(Boolean)
  const dense = data.settings.spacing === "compact" || data.settings.fontSize === "compact"
  const bodyText = dense ? "text-[10px] leading-[1.35]" : "text-[12px] leading-[1.55]"
  const sectionSpace = dense ? "space-y-2.5" : "space-y-4"

  return (
    <A4Page>
      <article
        ref={pageRef}
        className={cn(
          "h-[297mm] overflow-hidden bg-white text-zinc-950",
          dense ? "px-11 py-7" : "px-14 py-10"
        )}
      >
        <header
          className={cn(
            "border-b border-zinc-400 text-left",
            dense ? "space-y-1 pb-3" : "space-y-1.5 pb-4"
          )}
        >
          <h1 className={cn("font-bold leading-none", dense ? "text-[24px]" : "text-[26px]")}>
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <p
            className={cn(
              "font-semibold text-zinc-800",
              dense ? "text-[11px]" : "text-[12px]"
            )}
          >
            {data.personal.professionalTitle}
          </p>
          <p
            className={cn(
              "text-zinc-700",
              dense ? "text-[9px] leading-3.5" : "text-[10px] leading-4"
            )}
          >
            {contacts.join(" | ")}
          </p>
        </header>

        <main className={cn(dense ? "pt-4" : "pt-6", sectionSpace)}>
          {data.summary.trim() ? (
            <Section title="Resumen profesional" dense={dense}>
              <CVMarkdown className={cn(bodyText, "text-zinc-700")}>{data.summary}</CVMarkdown>
            </Section>
          ) : null}

          <Section title="Experiencia" dense={dense}>
            <div className={dense ? "space-y-2.5" : "space-y-3.5"}>
              {data.experience.map((item) => (
                <ExperienceItem key={item.id} item={item} bodyText={bodyText} dense={dense} />
              ))}
            </div>
          </Section>

          {data.settings.showProjects && data.projects.length > 0 ? (
            <Section title="Proyectos" dense={dense}>
              <div className={dense ? "space-y-2" : "space-y-2.5"}>
                {data.projects.map((project) => (
                  <article key={project.id} className="space-y-1">
                    <h3 className={cn("font-bold", dense ? "text-[11px]" : "text-[12px]")}>
                      {project.name}
                    </h3>
                    {project.description ? (
                      <CVMarkdown className={cn(bodyText, "text-zinc-700")}>
                        {project.description}
                      </CVMarkdown>
                    ) : null}
                    <InlineList
                      items={project.technologies}
                      className={dense ? "text-[10px] leading-[1.35]" : undefined}
                    />
                  </article>
                ))}
              </div>
            </Section>
          ) : null}

          <div className={dense ? "space-y-2.5" : "space-y-4"}>
            <Section title="Educación" dense={dense}>
              <div className={dense ? "space-y-1.5" : "space-y-2.5"}>
                {data.education.map((item) => (
                  <article key={item.id}>
                    <h3
                      className={cn(
                        "font-bold text-zinc-950",
                        dense ? "text-[10px]" : "text-[11px]"
                      )}
                    >
                      {item.degree}
                    </h3>
                    <p
                      className={cn(
                        "text-zinc-800",
                        dense ? "text-[10px] leading-[1.35]" : "text-[11px] leading-5"
                      )}
                    >
                      {item.institution}
                      {dateRange(item.startDate, item.endDate)
                        ? ` | ${dateRange(item.startDate, item.endDate)}`
                        : ""}
                    </p>
                  </article>
                ))}
              </div>
            </Section>
            <Section title="Habilidades" dense={dense}>
              <div className="space-y-1">
                {data.skills.map((category) => (
                  <p
                    key={category.id}
                    className={cn(
                      "text-zinc-800",
                      dense ? "text-[10px] leading-[1.35]" : "text-[11px] leading-5"
                    )}
                  >
                    <span className="font-bold text-zinc-950">{category.name}: </span>
                    {category.skills.join(", ")}
                  </p>
                ))}
              </div>
            </Section>
          </div>

          {(data.languages.length > 0 ||
            (data.settings.showSpecializations && data.specializations.length > 0)) ? (
            <div className={dense ? "space-y-2.5" : "space-y-4"}>
              {data.languages.length > 0 ? (
                <Section title="Idiomas" dense={dense}>
                  <InlineList
                    items={data.languages.map((item) => `${item.language}: ${item.level}`)}
                    className={dense ? "text-[10px] leading-[1.35]" : undefined}
                  />
                </Section>
              ) : null}

              {data.settings.showSpecializations && data.specializations.length > 0 ? (
                <Section title="Áreas de especialización" dense={dense}>
                  <InlineList
                    items={data.specializations}
                    className={dense ? "text-[10px] leading-[1.35]" : undefined}
                  />
                </Section>
              ) : null}
            </div>
          ) : null}
        </main>
      </article>
    </A4Page>
  )
}
