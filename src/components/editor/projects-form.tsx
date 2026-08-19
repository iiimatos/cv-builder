"use client"

import { Plus, Trash2 } from "lucide-react"

import { SortableEditorList } from "@/components/editor/sortable-editor-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMessages } from "@/hooks/use-messages"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

export function ProjectsForm() {
  const projects = useCVEditorStore((state) => state.data?.projects ?? [])
  const addProject = useCVEditorStore((state) => state.addProject)
  const updateProject = useCVEditorStore((state) => state.updateProject)
  const removeProject = useCVEditorStore((state) => state.removeProject)
  const reorderProject = useCVEditorStore((state) => state.reorderProject)
  const { ui } = useMessages()

  return (
    <section id="proyectos" className="scroll-mt-20 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{ui.projects}</h2>
          <p className="text-sm text-muted-foreground">{ui.projectsDescription}</p>
        </div>
        <Button type="button" onClick={addProject}>
          <Plus className="size-4" />
          {ui.add}
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
                <span className="text-sm font-medium">{ui.name}</span>
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
              <span className="text-sm font-medium">{ui.description}</span>
              <span className="block text-xs text-muted-foreground">{ui.basicMarkdown}</span>
              <Textarea
                value={item.description ?? ""}
                onChange={(event) => updateProject(item.id, { description: event.target.value })}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">{ui.bullets}</span>
              <span className="block text-xs text-muted-foreground">{ui.oneItemPerLineMarkdown}</span>
              <Textarea
                value={item.bullets.join("\n")}
                onChange={(event) => updateProject(item.id, { bullets: toLines(event.target.value) })}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">{ui.technologies}</span>
              <span className="block text-xs text-muted-foreground">{ui.technologiesHelp}</span>
              <Textarea
                value={item.technologies.join("\n")}
                onChange={(event) =>
                  updateProject(item.id, { technologies: toLines(event.target.value) })
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
              {ui.remove}
            </Button>
          </div>
        )}
      />
    </section>
  )
}
