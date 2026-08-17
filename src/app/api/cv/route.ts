import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { getCVData, saveCVData } from "@/lib/cv-repository"
import { cvDataSchema } from "@/schemas/cv-schema"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const data = await getCVData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el CV local." },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = cvDataSchema.parse(body)
    const updated = await saveCVData(parsed)

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "El CV no cumple con el esquema esperado.", issues: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "No se pudo guardar el CV local." },
      { status: 500 }
    )
  }
}
