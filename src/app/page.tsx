import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Download,
  FileText,
  LayoutTemplate,
  MonitorSmartphone,
  Save,
  SlidersHorizontal,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const workflow = [
  {
    icon: FileText,
    title: "Edita el contenido",
    description: "Centraliza perfil, experiencia, educación, habilidades, idiomas y proyectos.",
  },
  {
    icon: LayoutTemplate,
    title: "Elige la plantilla",
    description: "Cambia entre estilos Classic, ATS y Minimal sin tocar la información base.",
  },
  {
    icon: Download,
    title: "Exporta en PDF",
    description: "Revisa la vista previa, guarda los cambios y descarga una versión lista para enviar.",
  },
]

const highlights = [
  "Información organizada en un solo lugar",
  "Modo una página o multipágina",
  "Previsualización en tiempo real",
  "Exportación PDF desde el servidor",
]

const editorSections = ["Perfil", "Experiencia", "Educación", "Habilidades", "Diseño"]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#f7f7f5]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-md bg-zinc-950 text-white">
              <FileText className="size-4" />
            </span>
            CV Builder
          </Link>
          <Link href="/editor" className={buttonVariants({ size: "lg" })}>
            Abrir editor
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 shadow-sm">
            <BadgeCheck className="size-3.5 text-emerald-700" />
            Editor para currículums profesionales
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-normal text-zinc-950 md:text-6xl">
            Crea un CV claro, editable y listo para exportar.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 md:text-lg">
            Una herramienta práctica para mantener tu información profesional organizada,
            comparar estilos y generar PDFs consistentes sin depender de editores externos.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/editor" className={buttonVariants({ size: "lg", className: "h-11 px-4" })}>
              Empezar ahora
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#flujo"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-11 bg-white px-4",
              })}
            >
              Ver cómo funciona
            </a>
          </div>

          <div className="mt-8 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
            {highlights.map((item) => (
              <p key={item} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-700" />
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-200/70">
          <div className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
              <div>
                <p className="text-sm font-semibold">CV Builder</p>
                <p className="text-xs text-zinc-500">Editor estructurado</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 text-xs font-medium text-emerald-700 sm:flex">
                  <CheckCircle2 className="size-3.5" />
                  Guardado
                </span>
                <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-zinc-950 px-3 text-xs font-semibold text-white">
                  <Download className="size-3.5" />
                  PDF
                </span>
              </div>
            </div>

            <div className="grid min-h-[440px] md:grid-cols-[142px_1fr]">
              <aside className="hidden border-r border-zinc-200 bg-white p-3 md:block">
                <div className="space-y-1">
                  {editorSections.map((item, index) => (
                    <div
                      key={item}
                      className={cn(
                        "rounded-md px-3 py-2 text-xs font-medium",
                        index === 0 ? "bg-zinc-950 text-white" : "text-zinc-500"
                      )}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </aside>

              <div className="grid gap-4 p-4 md:grid-cols-[1fr_220px]">
                <section className="space-y-4">
                  <div className="rounded-md border border-zinc-200 bg-white p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <Save className="size-4 text-zinc-500" />
                      <p className="text-sm font-semibold">Información personal</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="h-9 rounded-md border border-zinc-200 bg-zinc-50" />
                      <div className="h-9 rounded-md border border-zinc-200 bg-zinc-50" />
                      <div className="h-9 rounded-md border border-zinc-200 bg-zinc-50 sm:col-span-2" />
                    </div>
                  </div>
                  <div className="rounded-md border border-zinc-200 bg-white p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <SlidersHorizontal className="size-4 text-zinc-500" />
                      <p className="text-sm font-semibold">Diseño</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                        Plantilla
                      </p>
                      {["Classic", "ATS", "Minimal"].map((item, index) => (
                        <span
                          key={item}
                          className={cn(
                            "flex h-8 items-center justify-between rounded-md border px-3 text-[11px] font-semibold",
                            index === 0
                              ? "border-zinc-950 bg-zinc-950 text-white"
                              : "border-zinc-200 bg-zinc-50 text-zinc-600"
                          )}
                        >
                          {item}
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              index === 0 ? "bg-white" : "bg-zinc-300"
                            )}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="hidden bg-zinc-100 p-4 md:block">
                  <div className="mx-auto h-[340px] w-[218px] bg-white px-5 py-6 shadow-lg">
                    <div className="mb-5 h-4 w-24 bg-zinc-950" />
                    <div className="mb-2 h-2 w-32 bg-zinc-300" />
                    <div className="mb-8 h-2 w-24 bg-zinc-300" />
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-zinc-200" />
                      <div className="h-2 w-11/12 bg-zinc-200" />
                      <div className="h-2 w-10/12 bg-zinc-200" />
                    </div>
                    <div className="mt-8 grid grid-cols-[1fr_58px] gap-4">
                      <div className="space-y-2">
                        <div className="h-2 w-20 bg-zinc-950" />
                        <div className="h-2 w-full bg-zinc-200" />
                        <div className="h-2 w-10/12 bg-zinc-200" />
                        <div className="h-2 w-11/12 bg-zinc-200" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-12 bg-zinc-950" />
                        <div className="h-2 w-full bg-zinc-200" />
                        <div className="h-2 w-9/12 bg-zinc-200" />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="flujo" className="scroll-mt-24 border-y border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-24 md:grid-cols-3 md:px-8 lg:py-32">
          {workflow.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-lg border border-zinc-200 p-7">
              <Icon className="mb-5 size-5 text-zinc-700" />
              <h2 className="text-base font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="plantillas"
        className="scroll-mt-24 border-b border-zinc-200 bg-[#f7f7f5]"
      >
        <div className="h-12 bg-linear-to-b from-white to-[#f7f7f5]" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-24 pt-16 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:pb-32 lg:pt-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Plantillas y control
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal md:text-4xl">
              Diseña para cada contexto sin duplicar tu CV.
            </h2>
          </div>
          <div id="control" className="grid scroll-mt-24 gap-4 sm:grid-cols-2">
            {[
              "Plantillas para lectura visual o compatibilidad ATS.",
              "Ajustes de foto, ubicación, enlaces y proyectos.",
              "Control de una página con sugerencias de espacio.",
              "Modo multipágina para perfiles con mayor trayectoria.",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-5">
                <MonitorSmartphone className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                <p className="text-sm leading-6 text-zinc-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
