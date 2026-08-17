import ReactMarkdown from "react-markdown"

import { cn } from "@/lib/utils"

interface CVMarkdownProps {
  children: string
  className?: string
}

export function CVMarkdown({ children, className }: CVMarkdownProps) {
  return (
    <ReactMarkdown
      skipHtml
      disallowedElements={["img", "h1", "h2", "h3", "h4", "h5", "h6"]}
      unwrapDisallowed
      components={{
        p: (props) => (
          <p {...props} className={cn("my-0", className)} />
        ),
        strong: (props) => (
          <strong {...props} className="font-bold text-zinc-950" />
        ),
        em: (props) => (
          <em {...props} className="italic" />
        ),
        ul: (props) => (
          <ul {...props} className={cn("my-0 list-disc space-y-0.5 pl-4", className)} />
        ),
        ol: (props) => (
          <ol {...props} className={cn("my-0 list-decimal space-y-0.5 pl-4", className)} />
        ),
        li: (props) => (
          <li {...props} className="pl-0.5" />
        ),
        a: (props) => (
          <a {...props} className="font-medium text-zinc-950 underline underline-offset-2" />
        ),
        code: (props) => (
          <code {...props} className="rounded bg-zinc-100 px-1 text-[0.92em]" />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
