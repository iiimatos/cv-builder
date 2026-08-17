import type { ReactNode, RefObject } from "react"
import Image from "next/image"
import { Globe2, LinkIcon, Mail, MapPin, Phone } from "lucide-react"

import { A4Page } from "@/components/cv/a4-page"
import { cn } from "@/lib/utils"
import type { CVData } from "@/types/cv"

interface IvanClassicTemplateProps {
  data: CVData
  pageRef?: RefObject<HTMLElement | null>
}

interface SectionProps {
  title: string
  children: ReactNode
  className?: string
  dense?: boolean
}

function Section({ title, children, className, dense = false }: SectionProps) {
  return (
    <section className={className}>
      <div className={cn("flex items-center gap-3", dense ? "mb-2" : "mb-3")}>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-950">
          {title}
        </h2>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>
      {children}
    </section>
  )
}

function ChipList({ items, dense = false }: { items: string[]; dense?: boolean }) {
  if (items.length === 0) return null

  return (
    <div className={cn("flex flex-wrap", dense ? "gap-1" : "gap-1.5")}>
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "rounded-md border border-zinc-200 bg-zinc-50 font-medium text-zinc-700",
            dense ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]"
          )}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function dateRange(startDate?: string, endDate?: string, current?: boolean) {
  return [startDate, current ? "Actualidad" : endDate].filter(Boolean).join(" - ")
}

function contactItems(data: CVData) {
  return [
    data.settings.showLocation && data.personal.location
      ? { icon: MapPin, label: "Ubicación", value: data.personal.location }
      : null,
    data.personal.email
      ? { icon: Mail, label: "Correo", value: data.personal.email }
      : null,
    data.personal.phone
      ? { icon: Phone, label: "Teléfono", value: data.personal.phone }
      : null,
  ].filter((item): item is { icon: typeof MapPin; label: string; value: string } => Boolean(item))
}

export function IvanClassicTemplate({ data, pageRef }: IvanClassicTemplateProps) {
  const contacts = contactItems(data)
  const links = data.settings.showLinks
    ? data.personal.links.filter((link) => link.label.trim() && link.url.trim())
    : []
  const photoSrc = data.personal.photo?.split("?")[0] ?? ""
  const dense = data.settings.spacing === "compact" || data.settings.fontSize === "compact"
  const bodyText = dense ? "text-[12px] leading-5" : "text-[13px] leading-[1.55]"
  const smallText = dense ? "text-[10px] leading-4" : "text-[11px] leading-[1.45]"
  const sectionSpace = dense ? "space-y-4" : "space-y-5"

  return (
    <A4Page>
      <article
        ref={pageRef}
        className="flex h-[297mm] flex-col overflow-hidden bg-white px-10 py-8"
      >
        <header className="border-b border-zinc-900 pb-4">
          <div className="grid gap-4 md:grid-cols-[1fr_48mm]">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Currículum profesional
              </p>
              <h1 className="mt-2 text-[38px] font-semibold leading-[0.95] tracking-normal text-zinc-950">
                {data.personal.firstName} {data.personal.lastName}
              </h1>
              <p className="mt-2 text-sm font-medium text-zinc-700">
                {data.personal.professionalTitle}
              </p>
            </div>

            {data.settings.showPhoto ? (
              <div className="flex justify-start md:justify-end">
                {photoSrc ? (
                  <Image
                    src={photoSrc}
                    alt={`Foto de ${data.personal.firstName} ${data.personal.lastName}`}
                    width={80}
                    height={80}
                    className="size-20 rounded-lg border border-zinc-200 object-cover"
                  />
                ) : (
                  <div className="grid size-20 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    Foto
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="mt-3 grid gap-x-4 gap-y-1 text-[10px] leading-4 text-zinc-600 md:grid-cols-2">
            {contacts.map(({ icon: Icon, label, value }) => (
              <p key={label} className="flex min-w-0 items-center gap-2">
                <Icon className="size-3 shrink-0 text-zinc-500" />
                <span className="font-semibold text-zinc-800">{label}:</span>
                <span className="truncate">{value}</span>
              </p>
            ))}
            {links.map((link) => (
              <p key={link.id} className="flex min-w-0 items-center gap-2">
                <LinkIcon className="size-3 shrink-0 text-zinc-500" />
                <span className="font-semibold text-zinc-800">{link.label}:</span>
                <span className="truncate">{link.url}</span>
              </p>
            ))}
          </div>
        </header>

        <main className="grid flex-1 gap-6 pt-5 md:grid-cols-[1fr_68mm]">
          <div className={sectionSpace}>
            {data.summary.trim() ? (
              <Section title="Resumen profesional" dense={dense}>
                <p className={cn(bodyText, "text-zinc-700")}>{data.summary}</p>
              </Section>
            ) : null}

            {data.settings.showProjects && data.projects.length > 0 ? (
              <Section title="Proyectos" dense={dense}>
                <div className={dense ? "space-y-3" : "space-y-4"}>
                  {data.projects.map((project) => (
                    <article key={project.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-[13px] font-bold text-zinc-950">{project.name}</h3>
                        {project.url ? (
                          <Globe2 className="mt-0.5 size-3.5 shrink-0 text-zinc-500" />
                        ) : null}
                      </div>
                      {project.description ? (
                        <p className={cn(bodyText, "text-zinc-700")}>{project.description}</p>
                      ) : null}
                      {project.bullets.length > 0 ? (
                        <ul className={cn("list-disc pl-4 text-zinc-700", bodyText)}>
                          {project.bullets.filter(Boolean).map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                      <ChipList items={project.technologies} dense={dense} />
                    </article>
                  ))}
                </div>
              </Section>
            ) : null}

            <Section title="Experiencia" dense={dense}>
              <div className={dense ? "space-y-3.5" : "space-y-4"}>
                {data.experience.map((item) => (
                  <article
                    key={item.id}
                    className={cn(
                      "grid border-b border-zinc-100 last:border-0 last:pb-0",
                      dense ? "gap-2 pb-3.5" : "gap-2.5 pb-4"
                    )}
                  >
                    <div className="grid gap-1 md:grid-cols-[1fr_auto] md:gap-4">
                      <div>
                        <h3 className="text-[14px] font-bold leading-tight text-zinc-950">
                          {item.position}
                        </h3>
                        <p className="text-[12px] font-semibold leading-5 text-zinc-700">
                          {item.company}
                        </p>
                        {item.location ? (
                          <p className="text-[10px] leading-4 text-zinc-500">{item.location}</p>
                        ) : null}
                      </div>
                      <p className="text-[10px] font-medium leading-4 text-zinc-500">
                        {dateRange(item.startDate, item.endDate, item.current)}
                      </p>
                    </div>

                    {item.description ? (
                      <p className={cn(bodyText, "text-zinc-700")}>{item.description}</p>
                    ) : null}

                    <ul className={cn("list-disc pl-4 text-zinc-700", bodyText, dense ? "space-y-0.5" : "space-y-1")}>
                      {item.bullets.filter(Boolean).map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>

                    <ChipList items={item.technologies} dense={dense} />
                  </article>
                ))}
              </div>
            </Section>

          </div>

          <aside className={cn("border-l border-zinc-200 pl-5", dense ? "space-y-4" : "space-y-5")}>
            {data.education.length > 0 ? (
              <Section title="Educación" dense={dense}>
                <div className={dense ? "space-y-3" : "space-y-4"}>
                  {data.education.map((item) => (
                    <article key={item.id}>
                      <h3 className="text-[12px] font-bold leading-4 text-zinc-950">{item.degree}</h3>
                      <p className={cn(smallText, "text-zinc-700")}>{item.institution}</p>
                      <p className="text-[10px] font-medium leading-4 text-zinc-500">
                        {dateRange(item.startDate, item.endDate)}
                      </p>
                      {item.description ? (
                        <p className={cn("mt-1 text-zinc-600", smallText)}>
                          {item.description}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </Section>
            ) : null}

            {data.skills.length > 0 ? (
              <Section title="Habilidades" dense={dense}>
                <div className={dense ? "space-y-2.5" : "space-y-3"}>
                  {data.skills.map((category) => (
                    <div key={category.id} className="space-y-1.5">
                      <h3 className="text-[11px] font-bold leading-4 text-zinc-950">
                        {category.name}
                      </h3>
                      <ChipList items={category.skills} dense={dense} />
                    </div>
                  ))}
                </div>
              </Section>
            ) : null}

            {data.languages.length > 0 ? (
              <Section title="Idiomas" dense={dense}>
                <div className="space-y-1.5">
                  {data.languages.map((item) => (
                    <p key={item.id} className="flex justify-between gap-3 text-[11px] leading-4 text-zinc-700">
                      <span className="font-semibold text-zinc-950">{item.language}</span>
                      <span>{item.level}</span>
                    </p>
                  ))}
                </div>
              </Section>
            ) : null}
          </aside>
        </main>
      </article>
    </A4Page>
  )
}
