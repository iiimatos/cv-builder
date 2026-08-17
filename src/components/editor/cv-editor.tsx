"use client"

import { useEffect, useRef } from "react"
import { CheckCircle2, Clock3, Loader2, RotateCcw, TriangleAlert } from "lucide-react"

import { IvanClassicTemplate } from "@/components/cv/ivan-classic-template"
import { ExperienceForm } from "@/components/editor/experience-form"
import { PersonalForm } from "@/components/editor/personal-form"
import { SummaryForm } from "@/components/editor/summary-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebouncedCVSave } from "@/hooks/use-debounced-cv-save"
import { usePageOverflow } from "@/hooks/use-page-overflow"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"

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
  percentage,
  overflowPixels,
  overflowing,
  status,
}: {
  percentage: number
  overflowPixels: number
  overflowing: boolean
  status: "ok" | "near" | "overflow"
}) {
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
  const pageRef = useRef<HTMLElement | null>(null)
  const overflow = usePageOverflow(pageRef)

  if (!data) return null

  return (
    <aside className="border-l bg-zinc-100 lg:h-[calc(100vh-57px)] lg:overflow-auto">
      <div className="sticky top-0 z-10 border-b bg-zinc-100/95 p-4 pb-5 backdrop-blur">
        <OverflowMeter {...overflow} />
      </div>
      <div className="px-4 pb-8 pt-8">
        <div className="origin-top scale-[0.42] sm:scale-[0.5] lg:scale-[0.42] xl:scale-[0.5] 2xl:scale-[0.62]">
          <IvanClassicTemplate data={data} pageRef={pageRef} />
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
    </div>
  )
}

export function CVEditor() {
  const data = useCVEditorStore((state) => state.data)
  const loading = useCVEditorStore((state) => state.loading)
  const loadCV = useCVEditorStore((state) => state.loadCV)
  const resetChanges = useCVEditorStore((state) => state.resetChanges)

  useDebouncedCVSave()

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
          <Button type="button" variant="outline" onClick={resetChanges} disabled={!data}>
            <RotateCcw className="size-4" />
            Restablecer
          </Button>
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
