import type { RefObject } from "react"

import { AtsTemplate, MultiPageAtsTemplate } from "@/components/cv/ats-template"
import { IvanClassicTemplate, MultiPageClassicTemplate } from "@/components/cv/classic-template"
import { MinimalTemplate, MultiPageMinimalTemplate } from "@/components/cv/minimal-template"
import type { CVData } from "@/types/cv"

interface CVTemplateRendererProps {
  data: CVData
  pageRef?: RefObject<HTMLElement | null>
}

export function CVTemplateRenderer({ data, pageRef }: CVTemplateRendererProps) {
  if (data.settings.pageMode === "multi") {
    if (data.settings.template === "ats") {
      return <MultiPageAtsTemplate data={data} pageRef={pageRef} />
    }

    if (data.settings.template === "minimal") {
      return <MultiPageMinimalTemplate data={data} pageRef={pageRef} />
    }

    return <MultiPageClassicTemplate data={data} pageRef={pageRef} />
  }

  if (data.settings.template === "ats") {
    return <AtsTemplate data={data} pageRef={pageRef} />
  }

  if (data.settings.template === "minimal") {
    return <MinimalTemplate data={data} pageRef={pageRef} />
  }

  return <IvanClassicTemplate data={data} pageRef={pageRef} />
}
