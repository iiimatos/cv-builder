"use client"

import { Plus, Trash2 } from "lucide-react"

import { SortableEditorList } from "@/components/editor/sortable-editor-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

export function SkillsForm() {
  const skills = useCVEditorStore((state) => state.data?.skills ?? [])
  const addSkillCategory = useCVEditorStore((state) => state.addSkillCategory)
  const updateSkillCategory = useCVEditorStore((state) => state.updateSkillCategory)
  const removeSkillCategory = useCVEditorStore((state) => state.removeSkillCategory)
  const reorderSkillCategory = useCVEditorStore((state) => state.reorderSkillCategory)

  return (
    <section id="habilidades" className="scroll-mt-20 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Habilidades</h2>
          <p className="text-sm text-muted-foreground">
            Agrupa tecnologías y capacidades por categoría.
          </p>
        </div>
        <Button type="button" onClick={addSkillCategory}>
          <Plus className="size-4" />
          Agregar
        </Button>
      </div>

      <SortableEditorList
        items={skills}
        getLabel={(item) => item.name}
        getDescription={(item) => item.skills.join(", ")}
        onReorder={reorderSkillCategory}
        renderItem={(item) => (
          <div className="space-y-3">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Categoría</span>
              <Input
                value={item.name}
                onChange={(event) => updateSkillCategory(item.id, { name: event.target.value })}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Habilidades</span>
              <span className="block text-xs text-muted-foreground">
                Una habilidad por línea. Puedes usar comas dentro de cada habilidad.
              </span>
              <Textarea
                value={item.skills.join("\n")}
                onChange={(event) =>
                  updateSkillCategory(item.id, { skills: toLines(event.target.value) })
                }
                placeholder={"React\nNext.js\nTypeScript"}
              />
            </label>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeSkillCategory(item.id)}
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
