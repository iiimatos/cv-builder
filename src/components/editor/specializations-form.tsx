"use client"

import { Textarea } from "@/components/ui/textarea"
import { useMessages } from "@/hooks/use-messages"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

export function SpecializationsForm() {
  const specializations = useCVEditorStore((state) => state.data?.specializations ?? [])
  const setSpecializations = useCVEditorStore((state) => state.setSpecializations)
  const { ui } = useMessages()

  return (
    <section id="especializacion" className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{ui.specializations}</h2>
        <p className="text-sm text-muted-foreground">{ui.specializationsDescription}</p>
      </div>

      <label className="block space-y-1.5 rounded-lg border bg-background p-4">
        <span className="text-sm font-medium">{ui.areas}</span>
        <span className="block text-xs text-muted-foreground">{ui.specializationsHelp}</span>
        <Textarea
          value={specializations.join("\n")}
          onChange={(event) => setSpecializations(toLines(event.target.value))}
          placeholder={"Desarrollo full stack\nArquitectura de software\nAutomatización de procesos"}
        />
      </label>
    </section>
  )
}
