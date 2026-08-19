"use client"

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMessages } from "@/hooks/use-messages"
import { cn } from "@/lib/utils"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"
import type { ExperienceItem } from "@/types/cv"

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

interface SortableExperienceProps {
  item: ExperienceItem
}

function SortableExperience({ item }: SortableExperienceProps) {
  const updateExperience = useCVEditorStore((state) => state.updateExperience)
  const removeExperience = useCVEditorStore((state) => state.removeExperience)
  const { ui } = useMessages()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-background p-4 shadow-sm",
        isDragging && "opacity-70"
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="grid size-8 shrink-0 place-items-center rounded-md border text-muted-foreground"
          aria-label={ui.reorderExperience}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{item.company}</h3>
          <p className="truncate text-xs text-muted-foreground">{item.position}</p>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          onClick={() => removeExperience(item.id)}
          aria-label={ui.remove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium">{ui.organization}</span>
          <Input
            value={item.company}
            onChange={(event) => updateExperience(item.id, { company: event.target.value })}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">{ui.position}</span>
          <Input
            value={item.position}
            onChange={(event) => updateExperience(item.id, { position: event.target.value })}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">{ui.location}</span>
          <Input
            value={item.location ?? ""}
            onChange={(event) => updateExperience(item.id, { location: event.target.value })}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">{ui.start}</span>
          <Input
            value={item.startDate}
            onChange={(event) => updateExperience(item.id, { startDate: event.target.value })}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">{ui.end}</span>
          <Input
            value={item.endDate ?? ""}
            disabled={item.current}
            onChange={(event) => updateExperience(item.id, { endDate: event.target.value })}
          />
        </label>
        <label className="flex items-center gap-2 pt-7 text-sm font-medium">
          <input
            type="checkbox"
            checked={item.current}
            onChange={(event) => updateExperience(item.id, { current: event.target.checked })}
            className="size-4 rounded border-input"
          />
          {ui.currentJob}
        </label>
      </div>

      <label className="mt-3 block space-y-1.5">
        <span className="text-sm font-medium">{ui.description}</span>
        <span className="block text-xs text-muted-foreground">{ui.basicMarkdown}</span>
        <Textarea
          value={item.description ?? ""}
          onChange={(event) => updateExperience(item.id, { description: event.target.value })}
        />
      </label>

      <label className="mt-3 block space-y-1.5">
        <span className="text-sm font-medium">{ui.bullets}</span>
        <span className="block text-xs text-muted-foreground">{ui.oneItemPerLineMarkdown}</span>
        <Textarea
          value={item.bullets.join("\n")}
          onChange={(event) => updateExperience(item.id, { bullets: toLines(event.target.value) })}
        />
      </label>

      <label className="mt-3 block space-y-1.5">
        <span className="text-sm font-medium">{ui.technologies}</span>
        <span className="block text-xs text-muted-foreground">{ui.technologiesHelp}</span>
        <Textarea
          value={item.technologies.join("\n")}
          onChange={(event) =>
            updateExperience(item.id, { technologies: toLines(event.target.value) })
          }
        />
      </label>
    </article>
  )
}

export function ExperienceForm() {
  const experience = useCVEditorStore((state) => state.data?.experience ?? [])
  const addExperience = useCVEditorStore((state) => state.addExperience)
  const reorderExperience = useCVEditorStore((state) => state.reorderExperience)
  const { ui } = useMessages()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    reorderExperience(String(active.id), String(over.id))
  }

  return (
    <section id="experiencia" className="scroll-mt-20 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{ui.experience}</h2>
          <p className="text-sm text-muted-foreground">{ui.experienceDescription}</p>
        </div>
        <Button type="button" onClick={addExperience}>
          <Plus className="size-4" />
          {ui.add}
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={experience.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {experience.map((item) => (
              <SortableExperience key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  )
}
