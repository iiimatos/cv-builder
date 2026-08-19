"use client"

import { getMessages } from "@/lib/i18n"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"

export function useMessages() {
  const locale = useCVEditorStore((state) => state.data?.settings.locale)

  return getMessages(locale)
}
