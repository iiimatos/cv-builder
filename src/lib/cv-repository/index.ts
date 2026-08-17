import { JsonCVRepository } from "./json-cv-repository"
import type { CVRepository } from "./types"

const cvRepository: CVRepository = new JsonCVRepository()

export async function getCVData() {
  return cvRepository.get()
}

export async function saveCVData(data: Parameters<CVRepository["save"]>[0]) {
  return cvRepository.save(data)
}

export type { CVRepository }
