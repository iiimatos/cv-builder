import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

import { NextResponse } from "next/server"

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
])

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("photo")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Debes seleccionar una imagen." },
        { status: 400 }
      )
    }

    const extension = ALLOWED_TYPES.get(file.type)

    if (!extension) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes JPG, PNG o WebP." },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const profileDir = path.join(process.cwd(), "public", "profile")
    const fileName = `profile-${Date.now()}.${extension}`

    await mkdir(profileDir, { recursive: true })
    await writeFile(path.join(profileDir, fileName), Buffer.from(bytes))

    return NextResponse.json({ photo: `/profile/${fileName}` })
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar la foto." },
      { status: 500 }
    )
  }
}
