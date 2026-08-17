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

export function MinimalTemplate({ data, pageRef }: MinimalTemplateProps) {
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

  return (
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

          <Section number="02" title="Experiencia">
            <div className="space-y-4">
              {data.experience.map((item) => (
                <article key={item.id} className="grid grid-cols-[1fr_36mm] gap-5">
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
              ))}
            </div>
          </Section>

          <div className="grid grid-cols-2 gap-8">
            <Section number="03" title="Educación">
              <div className="space-y-3">
                {data.education.map((item) => (
                  <article key={item.id}>
                    <h3 className="text-[11px] font-bold">{item.degree}</h3>
                    <p className="text-[10px] text-zinc-700">{item.institution}</p>
                    <p className="text-[9px] text-zinc-500">
                      {dateRange(item.startDate, item.endDate)}
                    </p>
                  </article>
                ))}
              </div>
            </Section>

            <Section number="04" title="Habilidades">
              <div className="space-y-3">
                {data.skills.map((category) => (
                  <div key={category.id} className="space-y-1.5">
                    <h3 className="text-[10px] font-bold text-zinc-950">{category.name}</h3>
                    <SkillPills items={category.skills} />
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {data.languages.length > 0 ? (
            <Section number="05" title="Idiomas">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-zinc-700">
                {data.languages.map((item) => (
                  <p key={item.id}>
                    <span className="font-bold text-zinc-950">{item.language}</span> · {item.level}
                  </p>
                ))}
              </div>
            </Section>
          ) : null}
        </main>
      </article>
    </A4Page>
  )
}
