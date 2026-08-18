import { ClassicTemplate } from "@/components/cv/classic-template"
import { getCVData } from "@/lib/cv-repository"

export const dynamic = "force-dynamic"

export default async function CVPrintPage() {
  const data = await getCVData()

  return (
    <main className="bg-white">
      <ClassicTemplate data={data} />
    </main>
  )
}
