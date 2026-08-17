import { chromium } from "playwright"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    const origin = new URL(request.url).origin

    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({
      viewport: {
        width: 794,
        height: 1123,
      },
      deviceScaleFactor: 1,
    })

    await page.goto(`${origin}/cv/print`, {
      waitUntil: "networkidle",
    })
    await page.emulateMedia({ media: "print" })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    })

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ivan-matos-cv.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF generation failed", error)

    return Response.json(
      { error: "No se pudo generar el PDF." },
      { status: 500 }
    )
  } finally {
    await browser?.close()
  }
}
