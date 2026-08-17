"use client"

import { RefObject, useEffect, useState } from "react"

interface PageOverflow {
  percentage: number
  overflowPixels: number
  overflowing: boolean
  status: "ok" | "near" | "overflow"
}

const OVERFLOW_TOLERANCE_PX = 16
const NEAR_LIMIT_PERCENTAGE = 95

export function usePageOverflow(ref: RefObject<HTMLElement | null>): PageOverflow {
  const [overflow, setOverflow] = useState<PageOverflow>({
    percentage: 0,
    overflowPixels: 0,
    overflowing: false,
    status: "ok",
  })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      const height = element.scrollHeight
      const visibleHeight = element.clientHeight || height
      const rawPercentage = visibleHeight > 0 ? (height / visibleHeight) * 100 : 0
      const overflowPixels = Math.max(0, height - visibleHeight)
      const overflowing = overflowPixels > OVERFLOW_TOLERANCE_PX
      const percentage = Math.round(overflowing ? rawPercentage : Math.min(rawPercentage, 100))
      const status = overflowing
        ? "overflow"
        : percentage >= NEAR_LIMIT_PERCENTAGE
          ? "near"
          : "ok"

      setOverflow({ percentage, overflowPixels, overflowing, status })
    }

    update()

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(element)
    Array.from(element.children).forEach((child) => resizeObserver.observe(child))

    const mutationObserver = new MutationObserver(() => {
      Array.from(element.children).forEach((child) => resizeObserver.observe(child))
      update()
    })
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [ref])

  return overflow
}
