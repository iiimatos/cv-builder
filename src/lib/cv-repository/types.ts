import type { CVData } from "@/types/cv"

export interface CVRepository {
  get(): Promise<CVData>
  save(data: CVData): Promise<CVData>
}
