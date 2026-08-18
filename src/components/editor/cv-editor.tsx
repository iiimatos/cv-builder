"use client"

import { useDeferredValue, useEffect, useRef } from "react"
import {
  CheckCircle2,
  Clock3,
  FileDown,
  Loader2,
  MoreHorizontal,
  RotateCcw,
  Save,
  TriangleAlert,
} from "lucide-react"

import { CVTemplateRenderer } from "@/components/cv/cv-template-renderer"
import { DesignForm } from "@/components/editor/design-form"
import { EducationForm } from "@/components/editor/education-form"
import { ExperienceForm } from "@/components/editor/experience-form"
import { LanguagesForm } from "@/components/editor/languages-form"
import { PersonalForm } from "@/components/editor/personal-form"
import { ProjectsForm } from "@/components/editor/projects-form"
import { SkillsForm } from "@/components/editor/skills-form"
import { SpecializationsForm } from "@/components/editor/specializations-form"
import { SummaryForm } from "@/components/editor/summary-form"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePageOverflow } from "@/hooks/use-page-overflow"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"
import type { CVSettings } from "@/types/cv"

function SaveStatus() {
  const status = useCVEditorStore((state) => state.status)
  const error = useCVEditorStore((state) => state.error)

  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-zinc-600">
        <Loader2 className="size-4 animate-spin" />
        Guardando...
      </span>
    )
  }

  if (status === "editing") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-zinc-600">
        <Clock3 className="size-4" />
        Editando...
      </span>
    )
  }

  if (status === "error") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-sm text-destructive"
        title={error ?? ""}
      >
        <TriangleAlert className="size-4" />
        Error al guardar
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700">
      <CheckCircle2 className="size-4" />
      Guardado
    </span>
  )
}

function EditorNavigation() {
  const items = [
    { label: "Información", target: "informacion" },
    { label: "Perfil", target: "perfil" },
    { label: "Experiencia", target: "experiencia" },
    { label: "Educación", target: "educacion" },
    { label: "Habilidades", target: "habilidades" },
    { label: "Idiomas", target: "idiomas" },
    { label: "Especialización", target: "especializacion" },
    { label: "Proyectos", target: "proyectos" },
    { label: "Diseño", target: "diseno" },
  ]

  return (
    <nav className="hidden border-r bg-zinc-50 p-4 lg:block">
      <div className="sticky top-20 space-y-1">
        {items.map((item) => (
          <button
            key={item.target}
            type="button"
            onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" })}
            className="flex h-9 w-full items-center rounded-md px-3 text-left text-sm font-medium text-zinc-600 hover:bg-white hover:text-zinc-950"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

function OverflowMeter({
  pageMode,
  percentage,
  overflowPixels,
  overflowing,
  status,
}: {
  pageMode: CVSettings["pageMode"]
  percentage: number
  overflowPixels: number
  overflowing: boolean
  status: "ok" | "near" | "overflow"
}) {
  if (pageMode === "multi") {
    return (
      <div className="rounded-lg border bg-white p-3 text-sm shadow-sm">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="font-medium">Multipágina</span>
          <span className="font-semibold text-emerald-700">Activo</span>
        </div>
        <p className="text-xs font-medium text-zinc-600">
          El PDF puede continuar en páginas adicionales. El medidor de una página queda desactivado.
        </p>
      </div>
    )
  }

  const barWidth = `${Math.min(percentage, 100)}%`
  const tone =
    status === "overflow"
      ? "text-destructive"
      : status === "near"
        ? "text-amber-700"
        : "text-emerald-700"
  const barTone =
    status === "overflow"
      ? "bg-destructive"
      : status === "near"
        ? "bg-amber-500"
        : "bg-emerald-600"

  return (
    <div className="rounded-lg border bg-white p-3 text-sm shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-medium">Página 1</span>
        <span className={`font-semibold ${tone}`}>
          {percentage}% ocupado
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
        <div className={`h-full ${barTone}`} style={{ width: barWidth }} />
      </div>
      {overflowing ? (
        <p className="mt-2 text-xs font-medium text-destructive">
          El contenido excede una página A4 por aproximadamente {overflowPixels}px.
        </p>
      ) : status === "near" ? (
        <p className="mt-2 text-xs font-medium text-amber-700">
          La página está casi llena, pero todavía entra dentro del margen esperado.
        </p>
      ) : null}
    </div>
  )
}

function PreviewPanel() {
  const data = useCVEditorStore((state) => state.data)
  const deferredData = useDeferredValue(data)
  const pageRef = useRef<HTMLElement | null>(null)
  const overflow = usePageOverflow(pageRef, deferredData)

  if (!deferredData) return null

  return (
    <aside className="border-l bg-zinc-100 lg:h-[calc(100vh-57px)] lg:overflow-auto">
      <div className="sticky top-0 z-10 border-b bg-zinc-100/95 p-4 pb-5 backdrop-blur">
        <OverflowMeter pageMode={deferredData.settings.pageMode} {...overflow} />
      </div>
      <div className="px-4 pb-8 pt-8">
        <div className="origin-top scale-[0.42] sm:scale-[0.5] lg:scale-[0.42] xl:scale-[0.5] 2xl:scale-[0.62]">
          <CVTemplateRenderer data={deferredData} pageRef={pageRef} />
        </div>
      </div>
    </aside>
  )
}

function EditorForms() {
  return (
    <div className="space-y-8 p-4 md:p-6">
      <PersonalForm />
      <SummaryForm />
      <ExperienceForm />
      <EducationForm />
      <SkillsForm />
      <LanguagesForm />
      <SpecializationsForm />
      <ProjectsForm />
      <DesignForm />
    </div>
  )
}

export function CVEditor() {
  const data = useCVEditorStore((state) => state.data)
  const dirty = useCVEditorStore((state) => state.dirty)
  const loading = useCVEditorStore((state) => state.loading)
  const saving = useCVEditorStore((state) => state.saving)
  const loadCV = useCVEditorStore((state) => state.loadCV)
  const saveCV = useCVEditorStore((state) => state.saveCV)
  const resetChanges = useCVEditorStore((state) => state.resetChanges)

  useEffect(() => {
    void loadCV()
  }, [loadCV])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
        <div>
          <h1 className="text-base font-semibold">CV Builder</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Editor local con archivos JSON
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus />
          <Button
            type="button"
            variant="outline"
            onClick={() => void saveCV()}
            disabled={!data || !dirty || saving}
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {saving ? "Guardando..." : "Guardar"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button type="button" variant="outline" size="icon" aria-label="Abrir acciones" />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                render={
                  <a
                    href="/api/pdf"
                    download="ivan-matos-cv.pdf"
                    aria-disabled={!data || dirty}
                    className={!data || dirty ? "pointer-events-none opacity-50" : undefined}
                    title={
                      dirty
                        ? "Espera a que el CV termine de guardarse antes de exportar."
                        : undefined
                    }
                  />
                }
                disabled={!data || dirty}
              >
                <FileDown className="size-4" />
                Descargar PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetChanges} disabled={!data}>
                <RotateCcw className="size-4" />
                Restablecer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {loading || !data ? (
        <main className="grid min-h-[calc(100vh-57px)] place-items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Cargando CV local...
          </div>
        </main>
      ) : (
        <>
          <div className="hidden grid-cols-[180px_minmax(420px,1fr)_minmax(420px,44vw)] lg:grid">
            <EditorNavigation />
            <main className="h-[calc(100vh-57px)] overflow-auto">
              <EditorForms />
            </main>
            <PreviewPanel />
          </div>

          <main className="lg:hidden">
            <Tabs defaultValue="edit" className="p-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Editar</TabsTrigger>
                <TabsTrigger value="preview">Vista previa</TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="pt-4">
                <EditorForms />
              </TabsContent>
              <TabsContent value="preview" className="pt-4">
                <PreviewPanel />
              </TabsContent>
            </Tabs>
          </main>
        </>
      )}
    </div>
  )
}
