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

function toCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function ProjectsForm() {
  const projects = useCVEditorStore((state) => state.data?.projects ?? [])
  const addProject = useCVEditorStore((state) => state.addProject)
  const updateProject = useCVEditorStore((state) => state.updateProject)
  const removeProject = useCVEditorStore((state) => state.removeProject)
  const reorderProject = useCVEditorStore((state) => state.reorderProject)

  return (
    <section id="proyectos" className="scroll-mt-20 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Proyectos</h2>
          <p className="text-sm text-muted-foreground">
            Proyectos relevantes, productos internos o trabajo destacable.
          </p>
        </div>
        <Button type="button" onClick={addProject}>
          <Plus className="size-4" />
          Agregar
        </Button>
      </div>

      <SortableEditorList
        items={projects}
        getLabel={(item) => item.name}
        getDescription={(item) => item.url ?? ""}
        onReorder={reorderProject}
        renderItem={(item) => (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Nombre</span>
                <Input
                  value={item.name}
                  onChange={(event) => updateProject(item.id, { name: event.target.value })}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">URL</span>
                <Input
                  value={item.url ?? ""}
                  onChange={(event) => updateProject(item.id, { url: event.target.value })}
                />
              </label>
            </div>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Descripción</span>
              <Textarea
                value={item.description ?? ""}
                onChange={(event) => updateProject(item.id, { description: event.target.value })}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Puntos</span>
              <Textarea
                value={item.bullets.join("\n")}
                onChange={(event) => updateProject(item.id, { bullets: toLines(event.target.value) })}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Tecnologías</span>
              <Input
                value={item.technologies.join(", ")}
                onChange={(event) =>
                  updateProject(item.id, { technologies: toCommaList(event.target.value) })
                }
              />
            </label>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeProject(item.id)}
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
