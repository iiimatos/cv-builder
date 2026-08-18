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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="border-b border-zinc-300 pb-1 text-[11px] font-bold uppercase tracking-normal text-zinc-950">
        {title}
      </h2>
      {children}
    </section>
  )
}

function InlineList({ items }: { items: string[] }) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) return null

  return (
    <p className="text-[11px] leading-5 text-zinc-700">
      {filtered.join(" | ")}
    </p>
  )
}

function BulletList({ items }: { items: string[] }) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) return null

  return (
    <ul className="list-disc space-y-0.5 pl-4 text-[10px] leading-4 text-zinc-700">
      {filtered.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function ExperienceItem({
  item,
  bodyText,
}: {
  item: CVData["experience"][number]
  bodyText: string
}) {
  return (
    <article className="space-y-1.5 break-inside-avoid">
      <div className="flex justify-between gap-4">
        <div>
          <h3 className="text-[13px] font-bold">{item.position}</h3>
          <p className="text-[12px] font-semibold text-zinc-700">{item.company}</p>
        </div>
        <p className="text-right text-[10px] font-semibold text-zinc-500">
          {dateRange(item.startDate, item.endDate, item.current)}
        </p>
      </div>
      {item.location ? (
        <p className="text-[10px] text-zinc-500">{item.location}</p>
      ) : null}
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
      <InlineList items={item.technologies} />
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
  const dense = data.settings.spacing === "compact" || data.settings.fontSize === "compact"
  const bodyText = dense ? "text-[11px] leading-[1.45]" : "text-[12px] leading-[1.55]"
  const sectionSpace = dense ? "space-y-3.5" : "space-y-4"
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
          className="h-[297mm] overflow-hidden bg-white px-12 py-10 text-zinc-950"
        >
          <header className="space-y-2 text-center">
            <h1 className="text-[30px] font-bold leading-none">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <p className="text-[13px] font-semibold text-zinc-700">
              {data.personal.professionalTitle}
            </p>
            <p className="text-[10px] leading-4 text-zinc-600">
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
                  <div className={dense ? "space-y-3" : "space-y-3.5"}>
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

              <div className="grid grid-cols-2 gap-8">
                <Section title="Educación">
                  <div className="space-y-2">
                    {data.education.map((item) => (
                      <article key={item.id} className="break-inside-avoid">
                        <h3 className="text-[11px] font-bold">{item.degree}</h3>
                        <p className="text-[10px] text-zinc-700">{item.institution}</p>
                        <p className="text-[10px] text-zinc-500">
                          {dateRange(item.startDate, item.endDate)}
                        </p>
                      </article>
                    ))}
                  </div>
                </Section>
                <Section title="Habilidades">
                  <div className="space-y-1.5">
                    {data.skills.map((category) => (
                      <p key={category.id} className="text-[10px] leading-4 text-zinc-700">
                        <span className="font-bold text-zinc-950">{category.name}: </span>
                        {category.skills.join(", ")}
                      </p>
                    ))}
                  </div>
                </Section>
              </div>

              {(data.languages.length > 0 || showSpecializations) ? (
                <div className="grid grid-cols-2 gap-8">
                  {data.languages.length > 0 ? (
                    <Section title="Idiomas">
                      <InlineList
                        items={data.languages.map((item) => `${item.language}: ${item.level}`)}
                      />
                    </Section>
                  ) : null}

                  {showSpecializations ? (
                    <Section title="Áreas de especialización">
                      <BulletList items={data.specializations} />
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
  const bodyText = dense ? "text-[11px] leading-[1.45]" : "text-[12px] leading-[1.55]"
  const sectionSpace = dense ? "space-y-3.5" : "space-y-4"

  return (
    <A4Page>
      <article
        ref={pageRef}
        className="h-[297mm] overflow-hidden bg-white px-12 py-10 text-zinc-950"
      >
        <header className="space-y-2 text-center">
          <h1 className="text-[30px] font-bold leading-none">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <p className="text-[13px] font-semibold text-zinc-700">
            {data.personal.professionalTitle}
          </p>
          <p className="text-[10px] leading-4 text-zinc-600">
            {contacts.join(" | ")}
          </p>
        </header>

        <main className={cn("pt-6", sectionSpace)}>
          {data.summary.trim() ? (
            <Section title="Resumen profesional">
              <CVMarkdown className={cn(bodyText, "text-zinc-700")}>{data.summary}</CVMarkdown>
            </Section>
          ) : null}

          <Section title="Experiencia">
            <div className={dense ? "space-y-3" : "space-y-3.5"}>
              {data.experience.map((item) => (
                <ExperienceItem key={item.id} item={item} bodyText={bodyText} />
              ))}
            </div>
          </Section>

          {data.settings.showProjects && data.projects.length > 0 ? (
            <Section title="Proyectos">
              <div className="space-y-2.5">
                {data.projects.map((project) => (
                  <article key={project.id} className="space-y-1">
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

          <div className="grid grid-cols-2 gap-8">
            <Section title="Educación">
              <div className="space-y-2">
                {data.education.map((item) => (
                  <article key={item.id}>
                    <h3 className="text-[11px] font-bold">{item.degree}</h3>
                    <p className="text-[10px] text-zinc-700">{item.institution}</p>
                    <p className="text-[10px] text-zinc-500">
                      {dateRange(item.startDate, item.endDate)}
                    </p>
                  </article>
                ))}
              </div>
            </Section>
            <Section title="Habilidades">
              <div className="space-y-1.5">
                {data.skills.map((category) => (
                  <p key={category.id} className="text-[10px] leading-4 text-zinc-700">
                    <span className="font-bold text-zinc-950">{category.name}: </span>
                    {category.skills.join(", ")}
                  </p>
                ))}
              </div>
            </Section>
          </div>

          {(data.languages.length > 0 ||
            (data.settings.showSpecializations && data.specializations.length > 0)) ? (
            <div className="grid grid-cols-2 gap-8">
              {data.languages.length > 0 ? (
                <Section title="Idiomas">
                  <InlineList
                    items={data.languages.map((item) => `${item.language}: ${item.level}`)}
                  />
                </Section>
              ) : null}

              {data.settings.showSpecializations && data.specializations.length > 0 ? (
                <Section title="Áreas de especialización">
                  <BulletList items={data.specializations} />
                </Section>
              ) : null}
            </div>
          ) : null}
        </main>
      </article>
    </A4Page>
  )
}
