"use client"

import { useEffect, useRef } from "react"

import { useCVEditorStore } from "@/stores/use-cv-editor-store"

const SAVE_DELAY_MS = 700

export function useDebouncedCVSave() {
  const data = useCVEditorStore((state) => state.data)
  const dirty = useCVEditorStore((state) => state.dirty)
  const loading = useCVEditorStore((state) => state.loading)
  const saving = useCVEditorStore((state) => state.saving)
  const saveCV = useCVEditorStore((state) => state.saveCV)
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }

    if (!dirty || loading || saving) return

    const timeoutId = window.setTimeout(() => {
      void saveCV()
    }, SAVE_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [data, dirty, loading, saving, saveCV])
}
