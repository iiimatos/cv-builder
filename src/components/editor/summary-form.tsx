"use client"

import { Textarea } from "@/components/ui/textarea"
import { useMessages } from "@/hooks/use-messages"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"

export function SummaryForm() {
  const summary = useCVEditorStore((state) => state.data?.summary ?? "")
  const setSummary = useCVEditorStore((state) => state.setSummary)
  const { ui } = useMessages()

  return (
    <section id="perfil" className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{ui.professionalSummary}</h2>
        <p className="text-sm text-muted-foreground">{ui.professionalSummaryDescription}</p>
      </div>
      <Textarea
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
        className="min-h-36"
      />
    </section>
  )
}
