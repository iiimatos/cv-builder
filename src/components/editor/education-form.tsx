"use client"

import { Plus, Trash2 } from "lucide-react"

import { SortableEditorList } from "@/components/editor/sortable-editor-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMessages } from "@/hooks/use-messages"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"

export function EducationForm() {
  const education = useCVEditorStore((state) => state.data?.education ?? [])
  const addEducation = useCVEditorStore((state) => state.addEducation)
  const updateEducation = useCVEditorStore((state) => state.updateEducation)
  const removeEducation = useCVEditorStore((state) => state.removeEducation)
  const reorderEducation = useCVEditorStore((state) => state.reorderEducation)
  const { ui } = useMessages()

  return (
    <section id="educacion" className="scroll-mt-20 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{ui.education}</h2>
          <p className="text-sm text-muted-foreground">{ui.educationDescription}</p>
        </div>
        <Button type="button" onClick={addEducation}>
          <Plus className="size-4" />
          {ui.add}
        </Button>
      </div>

      <SortableEditorList
        items={education}
        getLabel={(item) => item.degree}
        getDescription={(item) => item.institution}
        onReorder={reorderEducation}
        renderItem={(item) => (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium">{ui.institution}</span>
                <Input
                  value={item.institution}
                  onChange={(event) =>
                    updateEducation(item.id, { institution: event.target.value })
                  }
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">{ui.degree}</span>
                <Input
                  value={item.degree}
                  onChange={(event) => updateEducation(item.id, { degree: event.target.value })}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">{ui.start}</span>
                <Input
                  value={item.startDate ?? ""}
                  onChange={(event) =>
                    updateEducation(item.id, { startDate: event.target.value })
                  }
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">{ui.end}</span>
                <Input
                  value={item.endDate ?? ""}
                  onChange={(event) => updateEducation(item.id, { endDate: event.target.value })}
                />
              </label>
            </div>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">{ui.description}</span>
              <span className="block text-xs text-muted-foreground">{ui.basicMarkdown}</span>
              <Textarea
                value={item.description ?? ""}
                onChange={(event) =>
                  updateEducation(item.id, { description: event.target.value })
                }
              />
            </label>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeEducation(item.id)}
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
