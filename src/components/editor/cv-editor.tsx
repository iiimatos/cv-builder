"use client"

import { useDeferredValue, useEffect, useRef, useState } from "react"
import {
  ChevronDown,
  CheckCircle2,
  Clock3,
  Eye,
  FileDown,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  RotateCcw,
  Save,
  TriangleAlert,
  X,
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMessages } from "@/hooks/use-messages"
import { usePageOverflow } from "@/hooks/use-page-overflow"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"
import type { CVSettings } from "@/types/cv"

type UIMessages = ReturnType<typeof useMessages>["ui"]

function SaveStatus({ labels }: { labels: UIMessages }) {
  const status = useCVEditorStore((state) => state.status)
  const error = useCVEditorStore((state) => state.error)

  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-zinc-600">
        <Loader2 className="size-4 animate-spin" />
        {labels.saving}
      </span>
    )
  }

  if (status === "editing") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-zinc-600">
        <Clock3 className="size-4" />
        {labels.editing}
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
        {labels.errorSaving}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700">
      <CheckCircle2 className="size-4" />
      {labels.saved}
    </span>
  )
}

function EditorNavigation({ labels }: { labels: UIMessages }) {
  const items = [
    { label: labels.personalInfo, target: "informacion" },
    { label: labels.professionalProfile, target: "perfil" },
    { label: labels.experience, target: "experiencia" },
    { label: labels.education, target: "educacion" },
    { label: labels.skills, target: "habilidades" },
    { label: labels.languages, target: "idiomas" },
    { label: labels.specialization, target: "especializacion" },
    { label: labels.projects, target: "proyectos" },
    { label: labels.design, target: "diseno" },
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

function LocaleSwitcher({ labels }: { labels: UIMessages }) {
  const locale = useCVEditorStore((state) => state.data?.settings.locale ?? "es")
  const updateSettings = useCVEditorStore((state) => state.updateSettings)
  const disabled = !useCVEditorStore((state) => state.data)

  const localeFlag: Record<CVSettings["locale"], string> = {
    es: "🇪🇸",
    en: "🇺🇸",
  }

  return (
    <label
      className="group relative flex h-8 shrink-0 items-center rounded-lg border border-input bg-background text-sm shadow-xs transition-colors hover:bg-muted/50 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20"
      title={labels.interfaceTemplateLanguage}
    >
      <span className="pointer-events-none absolute left-2.5 text-sm leading-none">
        {localeFlag[locale]}
      </span>
      <span className="pointer-events-none absolute left-8 h-4 w-px bg-border" />
      <span className="sr-only">{labels.interfaceTemplateLanguage}</span>
      <select
        value={locale}
        disabled={disabled}
        onChange={(event) =>
          updateSettings({ locale: event.target.value as CVSettings["locale"] })
        }
        className="h-full w-[128px] appearance-none rounded-lg bg-transparent pl-10 pr-8 text-sm font-medium outline-none disabled:opacity-50"
      >
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
    </label>
  )
}

function PdfPreviewDialog({
  disabled,
  dirty,
  labels,
}: {
  disabled: boolean
  dirty: boolean
  labels: UIMessages
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("/api/pdf")

  const refreshPreview = () => {
    setLoading(true)
    setPreviewUrl(`/api/pdf?preview=${Date.now()}`)
  }

  const openPreview = () => {
    if (disabled || dirty) return
    setOpen(true)
    refreshPreview()
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={openPreview}
        disabled={disabled || dirty}
        title={dirty ? labels.previewSaveFirst : undefined}
      >
        <Eye className="size-4" />
        <span className="hidden sm:inline">{labels.preview}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="grid h-[calc(100dvh-2rem)] max-h-[920px] max-w-[min(1180px,calc(100vw-2rem))] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-[min(1180px,calc(100vw-2rem))]"
          showCloseButton={false}
        >
          <DialogHeader className="border-b bg-background px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <DialogTitle>{labels.previewPdfTitle}</DialogTitle>
                <DialogDescription>
                  {labels.previewPdfDescription}
                </DialogDescription>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={refreshPreview}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="size-3.5" />
                  )}
                  {labels.refresh}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  render={<a href="/api/pdf" download="cv.pdf" />}
                >
                  <FileDown className="size-3.5" />
                  {labels.download}
                </Button>
                <DialogClose render={<Button type="button" variant="ghost" size="icon-sm" />}>
                  <X className="size-4" />
                  <span className="sr-only">{labels.close}</span>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>

          <div className="relative min-h-0 bg-zinc-200 p-2 sm:p-4">
            {loading ? (
              <div className="absolute inset-0 z-10 grid place-items-center bg-zinc-200/80 backdrop-blur-[1px]">
                <div className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium shadow-sm">
                  <Loader2 className="size-4 animate-spin" />
                  {labels.generatingPdf}
                </div>
              </div>
            ) : null}
            <iframe
              key={previewUrl}
              src={previewUrl}
              title={labels.previewPdf}
              className="h-full w-full rounded-lg border bg-white shadow-sm"
              onLoad={() => setLoading(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function OverflowMeter({
  pageMode,
  percentage,
  overflowPixels,
  overflowing,
  status,
  labels,
}: {
  pageMode: CVSettings["pageMode"]
  percentage: number
  overflowPixels: number
  overflowing: boolean
  status: "ok" | "near" | "overflow"
  labels: UIMessages
}) {
  const updateSettings = useCVEditorStore((state) => state.updateSettings)

  if (pageMode === "multi") {
    return (
      <div className="rounded-lg border bg-white p-3 text-sm shadow-sm">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="font-medium">{labels.fullPageMode}</span>
          <span className="font-semibold text-emerald-700">{labels.active}</span>
        </div>
        <p className="text-xs font-medium text-zinc-600">
          {labels.fullVersion}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 h-8 w-full"
          onClick={() => updateSettings({ pageMode: "single" })}
        >
          {labels.testSinglePage}
        </Button>
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
        <span className="font-medium">{labels.pageOne}</span>
        <span className={`font-semibold ${tone}`}>
          {percentage}% {labels.occupied}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
        <div className={`h-full ${barTone}`} style={{ width: barWidth }} />
      </div>
      {overflowing ? (
        <div className="mt-2 space-y-2">
          <p className="text-xs font-medium text-destructive">
            {labels.overflowBy.replace("{pixels}", String(overflowPixels))}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => updateSettings({ pageMode: "multi" })}
          >
            {labels.switchToMulti}
          </Button>
        </div>
      ) : status === "near" ? (
        <p className="mt-2 text-xs font-medium text-amber-700">
          {labels.singlePageNear}
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
  const { ui } = useMessages()

  if (!deferredData) return null

  return (
    <aside className="border-l bg-zinc-100 lg:h-[calc(100vh-57px)] lg:overflow-auto">
      <div className="sticky top-0 z-10 border-b bg-zinc-100/95 p-4 pb-5 backdrop-blur">
        <OverflowMeter pageMode={deferredData.settings.pageMode} labels={ui} {...overflow} />
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
  const { ui } = useMessages()

  useEffect(() => {
    void loadCV()
  }, [loadCV])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
        <div>
          <h1 className="text-base font-semibold">CV Builder</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">{ui.appSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitcher labels={ui} />
          <SaveStatus labels={ui} />
          <PdfPreviewDialog disabled={!data} dirty={dirty} labels={ui} />
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
            {saving ? ui.saving : ui.save}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button type="button" variant="outline" size="icon" aria-label={ui.openActions} />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                render={
                  <a
                    href="/api/pdf"
                    download="cv.pdf"
                    aria-disabled={!data || dirty}
                    className={!data || dirty ? "pointer-events-none opacity-50" : undefined}
                    title={dirty ? ui.previewSaveFirst : undefined}
                  />
                }
                disabled={!data || dirty}
              >
                <FileDown className="size-4" />
                {ui.downloadPdf}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetChanges} disabled={!data}>
                <RotateCcw className="size-4" />
                {ui.reset}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {loading || !data ? (
        <main className="grid min-h-[calc(100vh-57px)] place-items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {ui.loadingCv}
          </div>
        </main>
      ) : (
        <>
          <div className="hidden grid-cols-[180px_minmax(420px,1fr)_minmax(420px,44vw)] lg:grid">
            <EditorNavigation labels={ui} />
            <main className="h-[calc(100vh-57px)] overflow-auto">
              <EditorForms />
            </main>
            <PreviewPanel />
          </div>

          <main className="lg:hidden">
            <Tabs defaultValue="edit" className="p-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">{ui.edit}</TabsTrigger>
                <TabsTrigger value="preview">{ui.preview}</TabsTrigger>
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
