import type { RefObject } from "react"

import { A4Page } from "@/components/cv/a4-page"
import { CVMarkdown } from "@/components/cv/cv-markdown"
import { cn } from "@/lib/utils"
import type { CVData } from "@/types/cv"

interface MinimalTemplateProps {
  data: CVData
  pageRef?: RefObject<HTMLElement | null>
}

function dateRange(startDate?: string, endDate?: string, current?: boolean) {
  return [startDate, current ? "Actualidad" : endDate].filter(Boolean).join(" - ")
}

function Section({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="grid grid-cols-[18mm_1fr] gap-5">
      <div className="pt-0.5 text-[10px] font-semibold text-zinc-400">{number}</div>
      <div className="space-y-3 border-t border-zinc-200 pt-3">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-950">
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

function OnePageSection({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="grid grid-cols-[14mm_1fr] gap-4">
      <div className="pt-0.5 text-[9px] font-semibold text-zinc-400">{number}</div>
      <div className="space-y-2.5 border-t border-zinc-200 pt-2.5">
        <h2 className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-950">
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

function SkillPills({ items }: { items: string[] }) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-zinc-100 px-2.5 py-1 text-[9px] font-medium text-zinc-700"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function CompactPills({ items }: { items: string[] }) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) return null

  return (
    <p className="text-[8.5px] font-medium leading-3.5 text-zinc-500">
      {filtered.join(" | ")}
    </p>
  )
}

function CompactTextList({ items }: { items: string[] }) {
  const filtered = items.filter(Boolean)
  if (filtered.length === 0) return null

  return (
    <ul className="list-disc space-y-0.5 pl-4 text-[9.5px] leading-4 text-zinc-700">
      {filtered.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function MinimalOnePageExperienceItem({
  item,
  bodyText,
}: {
  item: CVData["experience"][number]
  bodyText: string
}) {
  const bullets = item.bullets.filter(Boolean)

  return (
    <article className="break-inside-avoid border-b border-zinc-200 pb-2.5 last:border-0 last:pb-0">
      <div className="grid grid-cols-[1fr_34mm] gap-4">
        <div>
          <h3 className="text-[12px] font-bold leading-4 text-zinc-950">{item.position}</h3>
          <p className="text-[9.5px] font-semibold leading-3.5 text-zinc-600">{item.company}</p>
          {item.location ? (
            <p className="text-[8px] leading-3 text-zinc-500">{item.location}</p>
          ) : null}
        </div>
        <p className="pt-0.5 text-right text-[8px] font-semibold leading-3 text-zinc-500">
          {dateRange(item.startDate, item.endDate, item.current)}
        </p>
      </div>

      {item.description ? (
        <CVMarkdown className={cn("mt-1.5", bodyText, "text-zinc-700")}>
          {item.description}
        </CVMarkdown>
      ) : null}

      {bullets.length > 0 ? (
        <ul className={cn("mt-1 list-disc space-y-0 pl-3.5 text-zinc-700", bodyText)}>
          {bullets.slice(0, 3).map((bullet) => (
            <li key={bullet}>
              <CVMarkdown>{bullet}</CVMarkdown>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-1">
        <CompactPills items={item.technologies} />
      </div>
    </article>
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
    <article className="grid break-inside-avoid grid-cols-[1fr_36mm] gap-5">
      <div className="space-y-2">
        <div>
          <h3 className="text-[14px] font-bold leading-tight">{item.position}</h3>
          <p className="text-[11px] font-semibold text-zinc-600">{item.company}</p>
          {item.location ? (
            <p className="text-[9px] text-zinc-500">{item.location}</p>
          ) : null}
        </div>
        {item.description ? (
          <CVMarkdown className={cn(bodyText, "text-zinc-700")}>
            {item.description}
          </CVMarkdown>
        ) : null}
        <ul className={cn("list-disc space-y-0.5 pl-4 text-zinc-700", bodyText)}>
          {item.bullets.filter(Boolean).map((bullet) => (
            <li key={bullet}>
              <CVMarkdown>{bullet}</CVMarkdown>
            </li>
          ))}
        </ul>
        <SkillPills items={item.technologies} />
      </div>
      <p className="pt-0.5 text-right text-[9px] font-semibold leading-4 text-zinc-500">
        {dateRange(item.startDate, item.endDate, item.current)}
      </p>
    </article>
  )
}

export function MultiPageMinimalTemplate({ data, pageRef }: MinimalTemplateProps) {
  const dense = data.settings.spacing === "compact" || data.settings.fontSize === "compact"
  const bodyText = dense ? "text-[11px] leading-[1.45]" : "text-[12px] leading-[1.6]"
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.settings.showLocation ? data.personal.location : "",
    ...(data.settings.showLinks
      ? data.personal.links
          .filter((link) => link.label.trim() && link.url.trim())
          .map((link) => link.url)
      : []),
  ].filter(Boolean)
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
          className="h-[297mm] overflow-hidden bg-[#fbfbfa] px-12 py-10 text-zinc-950"
        >
          <header className="grid grid-cols-[1fr_58mm] gap-8 border-b border-zinc-950 pb-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Currículum
              </p>
              <h1 className="mt-3 max-w-[120mm] text-[42px] font-semibold leading-[0.95]">
                {data.personal.firstName}
                <br />
                {data.personal.lastName}
              </h1>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-[13px] font-semibold leading-5 text-zinc-800">
                {data.personal.professionalTitle}
              </p>
              <div className="mt-4 space-y-1 text-[9px] leading-4 text-zinc-600">
                {contacts.map((contact) => (
                  <p key={contact}>{contact}</p>
                ))}
              </div>
            </div>
          </header>

          <main className="space-y-5 pt-6">
            {data.summary.trim() ? (
              <Section number="01" title="Perfil">
                <CVMarkdown className={cn(bodyText, "max-w-[138mm] text-zinc-700")}>
                  {data.summary}
                </CVMarkdown>
              </Section>
            ) : null}

            {firstExperience ? (
              <Section number="02" title="Experiencia">
                <ExperienceItem item={firstExperience} bodyText={bodyText} />
              </Section>
            ) : null}
          </main>
        </article>
      </A4Page>

      {hasSecondPage ? (
        <A4Page>
          <article className="h-[297mm] overflow-hidden bg-[#fbfbfa] px-12 py-10 text-zinc-950">
            <main className="space-y-5">
              {remainingExperience.length > 0 ? (
                <Section number="02" title="Experiencia">
                  <div className="space-y-4">
                    {remainingExperience.map((item) => (
                      <ExperienceItem key={item.id} item={item} bodyText={bodyText} />
                    ))}
                  </div>
                </Section>
              ) : null}

              {showProjects ? (
                <Section number="03" title="Proyectos">
                  <div className="space-y-3">
                    {data.projects.map((project) => (
                      <article key={project.id} className="space-y-1.5 break-inside-avoid">
                        <h3 className="text-[12px] font-bold">{project.name}</h3>
                        {project.description ? (
                          <CVMarkdown className={cn(bodyText, "text-zinc-700")}>
                            {project.description}
                          </CVMarkdown>
                        ) : null}
                        <SkillPills items={project.technologies} />
                      </article>
                    ))}
                  </div>
                </Section>
              ) : null}

              <div className="grid grid-cols-2 gap-8">
                <Section number="04" title="Educación">
                  <div className="space-y-3">
                    {data.education.map((item) => (
                      <article key={item.id} className="break-inside-avoid">
                        <h3 className="text-[11px] font-bold">{item.degree}</h3>
                        <p className="text-[10px] text-zinc-700">{item.institution}</p>
                        <p className="text-[9px] text-zinc-500">
                          {dateRange(item.startDate, item.endDate)}
                        </p>
                      </article>
                    ))}
                  </div>
                </Section>

                <Section number="05" title="Habilidades">
                  <div className="space-y-3">
                    {data.skills.map((category) => (
                      <div key={category.id} className="space-y-1.5 break-inside-avoid">
                        <h3 className="text-[10px] font-bold text-zinc-950">{category.name}</h3>
                        <SkillPills items={category.skills} />
                      </div>
                    ))}
                  </div>
                </Section>
              </div>

              {data.languages.length > 0 ? (
                <Section number="06" title="Idiomas">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-zinc-700">
                    {data.languages.map((item) => (
                      <p key={item.id}>
                        <span className="font-bold text-zinc-950">{item.language}</span> · {item.level}
                      </p>
                    ))}
                  </div>
                </Section>
              ) : null}

              {showSpecializations ? (
                <Section number="07" title="Áreas de especialización">
                  <CompactTextList items={data.specializations} />
                </Section>
              ) : null}
            </main>
          </article>
        </A4Page>
      ) : null}
    </div>
  )
}

export function MinimalTemplate({ data, pageRef }: MinimalTemplateProps) {
  const dense = data.settings.spacing === "compact" || data.settings.fontSize === "compact"
  const bodyText = dense ? "text-[9.5px] leading-[1.32]" : "text-[10.25px] leading-[1.4]"
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.settings.showLocation ? data.personal.location : "",
    ...(data.settings.showLinks
      ? data.personal.links
          .filter((link) => link.label.trim() && link.url.trim())
          .map((link) => link.url)
      : []),
  ].filter(Boolean)

  return (
    <A4Page>
      <article
        ref={pageRef}
        className="h-[297mm] overflow-hidden bg-[#fbfbfa] px-10 py-6 text-zinc-950"
      >
        <header className="grid grid-cols-[1fr_64mm] gap-6 border-b border-zinc-950 pb-4">
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Currículum
            </p>
            <h1 className="mt-1.5 max-w-[120mm] text-[32px] font-semibold leading-[0.94]">
              {data.personal.firstName}
              <br />
              {data.personal.lastName}
            </h1>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[11px] font-semibold leading-4 text-zinc-800">
              {data.personal.professionalTitle}
            </p>
            <div className="mt-2 space-y-0.5 text-[7.75px] leading-3 text-zinc-600">
              {contacts.map((contact) => (
                <p key={contact}>{contact}</p>
              ))}
            </div>
          </div>
        </header>

        <main className="space-y-3 pt-4">
          {data.summary.trim() ? (
            <OnePageSection number="01" title="Perfil">
              <CVMarkdown className={cn(bodyText, "text-zinc-700")}>
                {data.summary}
              </CVMarkdown>
            </OnePageSection>
          ) : null}

          <OnePageSection number="02" title="Experiencia">
            <div className="space-y-2.5">
              {data.experience.map((item) => (
                <MinimalOnePageExperienceItem key={item.id} item={item} bodyText={bodyText} />
              ))}
            </div>
          </OnePageSection>

          <OnePageSection number="03" title="Formación y habilidades">
            <div className="grid gap-5 md:grid-cols-[56mm_1fr]">
              <div className="space-y-2">
                <h3 className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Educación
                </h3>
                <div className="space-y-2">
                  {data.education.map((item) => (
                    <article key={item.id}>
                      <h4 className="text-[10px] font-bold leading-3.5">{item.degree}</h4>
                      <p className="text-[8.75px] leading-3.5 text-zinc-700">{item.institution}</p>
                      <p className="text-[8px] leading-3 text-zinc-500">
                        {dateRange(item.startDate, item.endDate)}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Habilidades
                </h3>
                <div className="grid gap-x-4 gap-y-1.5 md:grid-cols-2">
                  {data.skills.map((category) => (
                    <div key={category.id} className="space-y-0.5">
                      <h4 className="text-[8.75px] font-bold leading-3 text-zinc-950">
                        {category.name}
                      </h4>
                      <CompactPills items={category.skills} />
                    </div>
                  ))}
                </div>

                {(data.languages.length > 0 ||
                  (data.settings.showSpecializations && data.specializations.length > 0)) ? (
                  <div className="grid gap-4 border-t border-zinc-200 pt-1.5 md:grid-cols-2">
                    {data.languages.length > 0 ? (
                      <div>
                        <h3 className="mb-1 text-[8.75px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                          Idiomas
                        </h3>
                        <div className="space-y-0.5 text-[8.75px] leading-3.5 text-zinc-700">
                          {data.languages.map((item) => (
                            <p key={item.id}>
                              <span className="font-bold text-zinc-950">{item.language}</span> · {item.level}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {data.settings.showSpecializations && data.specializations.length > 0 ? (
                      <div>
                        <h3 className="mb-1 text-[8.75px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                          Áreas de especialización
                        </h3>
                        <CompactTextList items={data.specializations} />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </OnePageSection>
        </main>
      </article>
    </A4Page>
  )
}
