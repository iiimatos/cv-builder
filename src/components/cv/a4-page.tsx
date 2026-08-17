import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface A4PageProps {
  children: ReactNode
  className?: string
}

export function A4Page({ children, className }: A4PageProps) {
  return (
    <section
      className={cn(
        "mx-auto w-[210mm] min-h-[297mm] overflow-hidden bg-white text-zinc-950 shadow-xl print:shadow-none",
        className
      )}
    >
      {children}
    </section>
  )
}
