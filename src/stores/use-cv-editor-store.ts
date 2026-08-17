"use client"

import { arrayMove } from "@dnd-kit/sortable"
import { create } from "zustand"

import type {
  CVData,
  CVSettings,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  PersonalInfo,
  ProjectItem,
  SkillCategory,
} from "@/types/cv"

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
  addEducation: () => void
  updateEducation: (id: string, updates: Partial<EducationItem>) => void
  removeEducation: (id: string) => void
  reorderEducation: (activeId: string, overId: string) => void
  addSkillCategory: () => void
  updateSkillCategory: (id: string, updates: Partial<SkillCategory>) => void
  removeSkillCategory: (id: string) => void
  reorderSkillCategory: (activeId: string, overId: string) => void
  addLanguage: () => void
  updateLanguage: (id: string, updates: Partial<LanguageItem>) => void
  removeLanguage: (id: string) => void
  reorderLanguage: (activeId: string, overId: string) => void
  addProject: () => void
  updateProject: (id: string, updates: Partial<ProjectItem>) => void
  removeProject: (id: string) => void
  reorderProject: (activeId: string, overId: string) => void
  updateSettings: (settings: Partial<CVSettings>) => void
  saveCV: () => Promise<void>
  resetChanges: () => void
}

function createExperience(): ExperienceItem {
  return {
    id: crypto.randomUUID(),
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    bullets: [""],
    technologies: [],
  }
}

function createEducation(): EducationItem {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
    description: "",
  }
}

function createSkillCategory(): SkillCategory {
  return {
    id: crypto.randomUUID(),
    name: "",
    skills: [],
  }
}

function createLanguage(): LanguageItem {
  return {
    id: crypto.randomUUID(),
    language: "",
    level: "",
  }
}

function createProject(): ProjectItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    url: "",
    technologies: [],
    bullets: [],
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

function updateCollection<T extends { id: string }>(
  items: T[],
  id: string,
  updates: Partial<T>
) {
  return items.map((item) => (item.id === id ? { ...item, ...updates } : item))
}

function reorderCollection<T extends { id: string }>(items: T[], activeId: string, overId: string) {
  if (activeId === overId) return items

  const oldIndex = items.findIndex((item) => item.id === activeId)
  const newIndex = items.findIndex((item) => item.id === overId)

  if (oldIndex === -1 || newIndex === -1) return items

  return arrayMove(items, oldIndex, newIndex)
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

  addEducation() {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, education: [...data.education, createEducation()] },
      dirty: true,
      status: "editing",
    })
  },

  updateEducation(id, updates) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, education: updateCollection(data.education, id, updates) },
      dirty: true,
      status: "editing",
    })
  },

  removeEducation(id) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, education: data.education.filter((item) => item.id !== id) },
      dirty: true,
      status: "editing",
    })
  },

  reorderEducation(activeId, overId) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, education: reorderCollection(data.education, activeId, overId) },
      dirty: true,
      status: "editing",
    })
  },

  addSkillCategory() {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, skills: [...data.skills, createSkillCategory()] },
      dirty: true,
      status: "editing",
    })
  },

  updateSkillCategory(id, updates) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, skills: updateCollection(data.skills, id, updates) },
      dirty: true,
      status: "editing",
    })
  },

  removeSkillCategory(id) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, skills: data.skills.filter((item) => item.id !== id) },
      dirty: true,
      status: "editing",
    })
  },

  reorderSkillCategory(activeId, overId) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, skills: reorderCollection(data.skills, activeId, overId) },
      dirty: true,
      status: "editing",
    })
  },

  addLanguage() {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, languages: [...data.languages, createLanguage()] },
      dirty: true,
      status: "editing",
    })
  },

  updateLanguage(id, updates) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, languages: updateCollection(data.languages, id, updates) },
      dirty: true,
      status: "editing",
    })
  },

  removeLanguage(id) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, languages: data.languages.filter((item) => item.id !== id) },
      dirty: true,
      status: "editing",
    })
  },

  reorderLanguage(activeId, overId) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, languages: reorderCollection(data.languages, activeId, overId) },
      dirty: true,
      status: "editing",
    })
  },

  addProject() {
    const data = get().data
    if (!data) return

    set({
      data: {
        ...data,
        projects: [...data.projects, createProject()],
        settings: { ...data.settings, showProjects: true },
      },
      dirty: true,
      status: "editing",
    })
  },

  updateProject(id, updates) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, projects: updateCollection(data.projects, id, updates) },
      dirty: true,
      status: "editing",
    })
  },

  removeProject(id) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, projects: data.projects.filter((item) => item.id !== id) },
      dirty: true,
      status: "editing",
    })
  },

  reorderProject(activeId, overId) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, projects: reorderCollection(data.projects, activeId, overId) },
      dirty: true,
      status: "editing",
    })
  },

  updateSettings(settings) {
    const data = get().data
    if (!data) return

    set({
      data: { ...data, settings: { ...data.settings, ...settings } },
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
