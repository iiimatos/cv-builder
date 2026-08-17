"use client"

import { Plus, Trash2 } from "lucide-react"

import { SortableEditorList } from "@/components/editor/sortable-editor-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"

export function LanguagesForm() {
  const languages = useCVEditorStore((state) => state.data?.languages ?? [])
  const addLanguage = useCVEditorStore((state) => state.addLanguage)
  const updateLanguage = useCVEditorStore((state) => state.updateLanguage)
  const removeLanguage = useCVEditorStore((state) => state.removeLanguage)
  const reorderLanguage = useCVEditorStore((state) => state.reorderLanguage)

  return (
    <section id="idiomas" className="scroll-mt-20 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Idiomas</h2>
          <p className="text-sm text-muted-foreground">
            Idiomas y nivel de dominio.
          </p>
        </div>
        <Button type="button" onClick={addLanguage}>
          <Plus className="size-4" />
          Agregar
        </Button>
      </div>

      <SortableEditorList
        items={languages}
        getLabel={(item) => item.language}
        getDescription={(item) => item.level}
        onReorder={reorderLanguage}
        renderItem={(item) => (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Idioma</span>
                <Input
                  value={item.language}
                  onChange={(event) => updateLanguage(item.id, { language: event.target.value })}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Nivel</span>
                <Input
                  value={item.level}
                  onChange={(event) => updateLanguage(item.id, { level: event.target.value })}
                />
              </label>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeLanguage(item.id)}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          </div>
        )}
      />
    </section>
  )
}
