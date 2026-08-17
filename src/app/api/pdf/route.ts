import { existsSync } from "node:fs"
import { join } from "node:path"
import { createElement } from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import type { DocumentProps } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { IvanClassicPDFDocument } from "@/components/cv/ivan-classic-pdf-document"
import { getCVData } from "@/lib/cv-repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getPublicPhotoPath(photo?: string) {
  const photoPath = photo?.split("?")[0]
  if (!photoPath?.startsWith("/")) return undefined

  const publicPath = join(process.cwd(), "public", photoPath)

  return existsSync(publicPath) ? publicPath : undefined
}

export async function GET() {
  try {
    const data = await getCVData()
    const document = createElement(IvanClassicPDFDocument, {
      data,
      photoPath: getPublicPhotoPath(data.personal.photo),
    }) as unknown as ReactElement<DocumentProps>
    const pdf = await renderToBuffer(document)

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ivan-matos-cv.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF generation failed", error)

    return Response.json(
      { error: "No se pudo generar el PDF." },
      { status: 500 }
    )
  }
}
