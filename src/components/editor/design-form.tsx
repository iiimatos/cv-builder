"use client"

import { useMessages } from "@/hooks/use-messages"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"
import type { CVSettings } from "@/types/cv"

export function DesignForm() {
  const settings = useCVEditorStore((state) => state.data?.settings)
  const updateSettings = useCVEditorStore((state) => state.updateSettings)
  const { ui } = useMessages()

  if (!settings) return null

  return (
    <section id="diseno" className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{ui.design}</h2>
        <p className="text-sm text-muted-foreground">{ui.designDescription}</p>
      </div>

      <div className="grid gap-4 rounded-lg border bg-background p-4 md:grid-cols-2">
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">{ui.template}</span>
          <select
            value={settings.template}
            onChange={(event) =>
              updateSettings({ template: event.target.value as CVSettings["template"] })
            }
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="classic">Classic</option>
            <option value="ats">ATS</option>
          </select>
        </label>

        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">{ui.pageMode}</span>
          <select
            value={settings.pageMode}
            onChange={(event) =>
              updateSettings({ pageMode: event.target.value as CVSettings["pageMode"] })
            }
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="single">{ui.singlePageMode}</option>
            <option value="multi">{ui.fullPageMode}</option>
          </select>
          <p className="text-xs text-muted-foreground">{ui.fullPageModeDescription}</p>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">{ui.textSize}</span>
          <select
            value={settings.fontSize}
            onChange={(event) =>
              updateSettings({ fontSize: event.target.value as CVSettings["fontSize"] })
            }
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="compact">{ui.compact}</option>
            <option value="normal">{ui.normal}</option>
            <option value="large">{ui.large}</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">{ui.spacing}</span>
          <select
            value={settings.spacing}
            onChange={(event) =>
              updateSettings({ spacing: event.target.value as CVSettings["spacing"] })
            }
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="compact">{ui.compact}</option>
            <option value="normal">{ui.normal}</option>
            <option value="comfortable">{ui.comfortable}</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings.showPhoto}
            onChange={(event) => updateSettings({ showPhoto: event.target.checked })}
            className="size-4 rounded border-input"
          />
          {ui.showPhoto}
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings.showLocation}
            onChange={(event) => updateSettings({ showLocation: event.target.checked })}
            className="size-4 rounded border-input"
          />
          {ui.showLocation}
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings.showLinks}
            onChange={(event) => updateSettings({ showLinks: event.target.checked })}
            className="size-4 rounded border-input"
          />
          {ui.showLinks}
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings.showProjects}
            onChange={(event) => updateSettings({ showProjects: event.target.checked })}
            className="size-4 rounded border-input"
          />
          {ui.showProjects}
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings.showSpecializations}
            onChange={(event) => updateSettings({ showSpecializations: event.target.checked })}
            className="size-4 rounded border-input"
          />
          {ui.showSpecializations}
        </label>
      </div>
    </section>
  )
}
