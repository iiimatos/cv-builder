import { IvanClassicPDFDocument } from "@/components/cv/classic-pdf-document"
import type { CVData } from "@/types/cv"

interface CVPDFDocumentRendererProps {
  data: CVData
  photoPath?: string
}

export function CVPDFDocumentRenderer({ data, photoPath }: CVPDFDocumentRendererProps) {
  return <IvanClassicPDFDocument data={data} photoPath={photoPath} />
}
