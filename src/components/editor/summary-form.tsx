"use client"

import { Textarea } from "@/components/ui/textarea"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"

export function SummaryForm() {
  const summary = useCVEditorStore((state) => state.data?.summary ?? "")
  const setSummary = useCVEditorStore((state) => state.setSummary)

  return (
    <section id="perfil" className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Resumen profesional</h2>
        <p className="text-sm text-muted-foreground">
          Una descripción breve del perfil profesional. Acepta Markdown básico.
        </p>
      </div>
      <Textarea
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
        className="min-h-36"
      />
    </section>
  )
}
