"use client"

import { arrayMove } from "@dnd-kit/sortable"
import { create } from "zustand"

import type { CVData, ExperienceItem, PersonalInfo } from "@/types/cv"

type SaveStatus = "idle" | "editing" | "saving" | "saved" | "error"

interface CVEditorState {
  data: CVData | null
  originalData: CVData | null
  loading: boolean
  saving: boolean
  dirty: boolean
  error: string | null
  status: SaveStatus
  loadCV: () => Promise<void>
  setPersonal: (personal: Partial<PersonalInfo>) => void
  setSummary: (summary: string) => void
  addExperience: () => void
  updateExperience: (id: string, updates: Partial<ExperienceItem>) => void
  removeExperience: (id: string) => void
  reorderExperience: (activeId: string, overId: string) => void
  saveCV: () => Promise<void>
  resetChanges: () => void
}

function createExperience(): ExperienceItem {
  return {
    id: crypto.randomUUID(),
    company: "Nueva empresa",
    position: "Nuevo puesto",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    bullets: [""],
    technologies: [],
  }
}

function replaceExperience(
  data: CVData,
  id: string,
  updater: (item: ExperienceItem) => ExperienceItem
): CVData {
  return {
    ...data,
    experience: data.experience.map((item) => (item.id === id ? updater(item) : item)),
  }
}

export const useCVEditorStore = create<CVEditorState>((set, get) => ({
  data: null,
  originalData: null,
  loading: false,
  saving: false,
  dirty: false,
  error: null,
  status: "idle",

  async loadCV() {
    set({ loading: true, error: null, status: "idle" })

    try {
      const response = await fetch("/api/cv", { cache: "no-store" })

      if (!response.ok) {
        throw new Error("No se pudo cargar el CV.")
      }

      const data = (await response.json()) as CVData
      set({
        data,
        originalData: structuredClone(data),
        loading: false,
        dirty: false,
        status: "saved",
      })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "No se pudo cargar el CV.",
        status: "error",
      })
    }
  },

  setPersonal(personal) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, personal: { ...data.personal, ...personal } },
      dirty: true,
      status: "editing",
    })
  },

  setSummary(summary) {
    const data = get().data
    if (!data) return

    set({ data: { ...data, summary }, dirty: true, status: "editing" })
  },

  addExperience() {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, experience: [...data.experience, createExperience()] },
      dirty: true,
      status: "editing",
    })
  },

  updateExperience(id, updates) {
    const data = get().data
    if (!data) return

    set({
      data: replaceExperience(data, id, (item) => ({ ...item, ...updates })),
      dirty: true,
      status: "editing",
    })
  },

  removeExperience(id) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, experience: data.experience.filter((item) => item.id !== id) },
      dirty: true,
      status: "editing",
    })
  },

  reorderExperience(activeId, overId) {
    const data = get().data
    if (!data || activeId === overId) return

    const oldIndex = data.experience.findIndex((item) => item.id === activeId)
    const newIndex = data.experience.findIndex((item) => item.id === overId)

    if (oldIndex === -1 || newIndex === -1) return

    set({
      data: { ...data, experience: arrayMove(data.experience, oldIndex, newIndex) },
      dirty: true,
      status: "editing",
    })
  },

  async saveCV() {
    const data = get().data
    if (!data) return

    set({ saving: true, error: null, status: "saving" })

    try {
      const response = await fetch("/api/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("No se pudo guardar el CV.")
      }

      const updated = (await response.json()) as CVData
      const currentData = get().data

      if (currentData !== data) {
        set({
          data: currentData,
          originalData: structuredClone(updated),
          saving: false,
          dirty: true,
          status: "editing",
        })
        return
      }

      set({
        data: updated,
        originalData: structuredClone(updated),
        saving: false,
        dirty: false,
        status: "saved",
      })
    } catch (error) {
      set({
        saving: false,
        error: error instanceof Error ? error.message : "Error al guardar",
        status: "error",
      })
    }
  },

  resetChanges() {
    const originalData = get().originalData
    if (!originalData) return

    set({
      data: structuredClone(originalData),
      dirty: false,
      error: null,
      status: "saved",
    })
  },
}))
