export type CVTemplate = "classic" | "ats"

export interface CVSettings {
  template: CVTemplate
  pageMode: "single" | "multi"
  fontSize: "compact" | "normal" | "large"
  spacing: "compact" | "normal" | "comfortable"
  showPhoto: boolean
  showLocation: boolean
  showLinks: boolean
  showProjects: boolean
  showSpecializations: boolean
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  professionalTitle: string
  phone?: string
  email?: string
  links: PersonalLink[]
  location?: string
  photo?: string
}

export interface PersonalLink {
  id: string
  label: string
  url: string
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
  bullets: string[]
  technologies: string[]
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface SkillCategory {
  id: string
  name: string
  skills: string[]
}

export interface LanguageItem {
  id: string
  language: string
  level: string
}

export interface ProjectItem {
  id: string
  name: string
  description?: string
  url?: string
  technologies: string[]
  bullets: string[]
}

export interface CVData {
  personal: PersonalInfo
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillCategory[]
  languages: LanguageItem[]
  specializations: string[]
  projects: ProjectItem[]
  settings: CVSettings
}
