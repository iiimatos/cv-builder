import { z } from "zod"

export const personalLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1, "El nombre del enlace es requerido"),
  url: z.string().trim().min(1, "La URL del enlace es requerida"),
})

export const personalInfoSchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es requerido"),
  lastName: z.string().trim().min(1, "El apellido es requerido"),
  professionalTitle: z.string().trim().min(1, "El título profesional es requerido"),
  phone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  links: z.array(personalLinkSchema).default([]),
  location: z.string().trim().optional(),
  photo: z.string().trim().optional(),
})

export const experienceItemSchema = z.object({
  id: z.string().min(1),
  company: z.string().trim().min(1, "La empresa es requerida"),
  position: z.string().trim().min(1, "El puesto es requerido"),
  location: z.string().trim().optional(),
  startDate: z.string().trim().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().trim().optional(),
  current: z.boolean(),
  description: z.string().trim().optional(),
  bullets: z.array(z.string().trim()).default([]),
  technologies: z.array(z.string().trim()).default([]),
})

export const educationItemSchema = z.object({
  id: z.string().min(1),
  institution: z.string().trim().min(1),
  degree: z.string().trim().min(1),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
  description: z.string().trim().optional(),
})

export const skillCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  skills: z.array(z.string().trim()).default([]),
})

export const languageItemSchema = z.object({
  id: z.string().min(1),
  language: z.string().trim().min(1),
  level: z.string().trim().min(1),
})

export const projectItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  url: z.string().trim().optional(),
  technologies: z.array(z.string().trim()).default([]),
  bullets: z.array(z.string().trim()).default([]),
})

export const cvSettingsSchema = z.object({
  template: z.enum(["classic", "ats", "minimal"]),
  pageMode: z.enum(["single", "multi"]).default("single"),
  fontSize: z.enum(["compact", "normal", "large"]),
  spacing: z.enum(["compact", "normal", "comfortable"]),
  showPhoto: z.boolean(),
  showLocation: z.boolean(),
  showLinks: z.boolean(),
  showProjects: z.boolean(),
  showSpecializations: z.boolean().default(true),
})

export const cvDataSchema = z.object({
  personal: personalInfoSchema,
  summary: z.string(),
  experience: z.array(experienceItemSchema),
  education: z.array(educationItemSchema),
  skills: z.array(skillCategorySchema),
  languages: z.array(languageItemSchema),
  specializations: z.array(z.string().trim()).default([]),
  projects: z.array(projectItemSchema),
  settings: cvSettingsSchema,
})

export type CVDataInput = z.infer<typeof cvDataSchema>
