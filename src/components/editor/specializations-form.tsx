"use client"

import { Textarea } from "@/components/ui/textarea"
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

  return (
    <section id="especializacion" className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Áreas de especialización</h2>
        <p className="text-sm text-muted-foreground">
          Enfoques profesionales que resumen dónde aportas más valor.
        </p>
      </div>

      <label className="block space-y-1.5 rounded-lg border bg-background p-4">
        <span className="text-sm font-medium">Áreas</span>
        <span className="block text-xs text-muted-foreground">
          Una área por línea. Se muestran según la plantilla y la configuración de diseño.
        </span>
        <Textarea
          value={specializations.join("\n")}
          onChange={(event) => setSpecializations(toLines(event.target.value))}
          placeholder={"Desarrollo full stack\nArquitectura de software\nAutomatización de procesos"}
        />
      </label>
    </section>
  )
}
