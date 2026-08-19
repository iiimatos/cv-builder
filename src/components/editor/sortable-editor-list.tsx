"use client"

import type { ReactNode } from "react"
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
import { GripVertical } from "lucide-react"

import { useMessages } from "@/hooks/use-messages"
import { cn } from "@/lib/utils"

interface SortableEditorListProps<T extends { id: string }> {
  items: T[]
  getLabel: (item: T) => string
  getDescription?: (item: T) => string
  onReorder: (activeId: string, overId: string) => void
  renderItem: (item: T) => ReactNode
}

interface SortableItemProps<T extends { id: string }> {
  item: T
  label: string
  description?: string
  children: ReactNode
}

function SortableItem<T extends { id: string }>({
  item,
  label,
  description,
  children,
}: SortableItemProps<T>) {
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
      className={cn("rounded-lg border bg-background p-4 shadow-sm", isDragging && "opacity-70")}
    >
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          className="grid size-8 shrink-0 place-items-center rounded-md border text-muted-foreground"
          aria-label={ui.reorderElement}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{label}</h3>
          {description ? (
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </article>
  )
}

export function SortableEditorList<T extends { id: string }>({
  items,
  getLabel,
  getDescription,
  onReorder,
  renderItem,
}: SortableEditorListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    onReorder(String(active.id), String(over.id))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              label={getLabel(item)}
              description={getDescription?.(item)}
            >
              {renderItem(item)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
