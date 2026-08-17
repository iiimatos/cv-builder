import Link from "next/link"
import { FileText } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 px-6">
      <section className="w-full max-w-2xl space-y-6 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-lg bg-zinc-950 text-white">
          <FileText className="size-7" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-normal text-zinc-950">CV Builder</h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-zinc-600">
            Editor local para crear, ajustar y previsualizar el CV de Ivan Matos usando
            archivos JSON dentro del proyecto.
          </p>
        </div>
        <Link href="/editor" className={buttonVariants({ size: "lg" })}>
          Abrir editor
        </Link>
      </section>
    </main>
  )
}
