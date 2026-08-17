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

export function usePageOverflow(
  ref: RefObject<HTMLElement | null>,
  dependency?: unknown
): PageOverflow {
  const [overflow, setOverflow] = useState<PageOverflow>({
    percentage: 0,
    overflowPixels: 0,
    overflowing: false,
    status: "ok",
  })

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let frameId = 0

    const update = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(() => {
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

        setOverflow((current) => {
          if (
            current.percentage === percentage &&
            current.overflowPixels === overflowPixels &&
            current.overflowing === overflowing &&
            current.status === status
          ) {
            return current
          }

          return { percentage, overflowPixels, overflowing, status }
        })
      })
    }

    update()

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(element)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
    }
  }, [dependency, ref])

  return overflow
}
