import { readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"

import { cvDataSchema } from "@/schemas/cv-schema"
import type { CVData } from "@/types/cv"
import type { CVRepository } from "./types"

const CV_FILE_PATH = path.join(process.cwd(), "data", "cv.json")
const CV_TEMP_FILE_PATH = `${CV_FILE_PATH}.tmp`

export class JsonCVRepository implements CVRepository {
  async get(): Promise<CVData> {
    const file = await readFile(CV_FILE_PATH, "utf8")
    const parsed: unknown = JSON.parse(file)

    return cvDataSchema.parse(parsed)
  }

  async save(data: CVData): Promise<CVData> {
    const validated = cvDataSchema.parse(data)
    const contents = `${JSON.stringify(validated, null, 2)}\n`

    await writeFile(CV_TEMP_FILE_PATH, contents, "utf8")
    await rename(CV_TEMP_FILE_PATH, CV_FILE_PATH)

    return validated
  }
}
