"use client"

import { useCVEditorStore } from "@/stores/use-cv-editor-store"
import type { CVSettings } from "@/types/cv"

export function DesignForm() {
  const settings = useCVEditorStore((state) => state.data?.settings)
  const updateSettings = useCVEditorStore((state) => state.updateSettings)

  if (!settings) return null

  return (
    <section id="diseno" className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Diseño</h2>
        <p className="text-sm text-muted-foreground">
          Ajustes rápidos para controlar qué aparece en el CV y cuánto espacio ocupa.
        </p>
      </div>

      <div className="grid gap-4 rounded-lg border bg-background p-4 md:grid-cols-2">
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Plantilla</span>
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
          <span className="text-sm font-medium">Modo de página</span>
          <select
            value={settings.pageMode}
            onChange={(event) =>
              updateSettings({ pageMode: event.target.value as CVSettings["pageMode"] })
            }
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="single">Una página</option>
            <option value="multi">Multipágina</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Una página mantiene el control de espacio. Multipágina deja que el PDF continúe en
            páginas adicionales.
          </p>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">Tamaño de texto</span>
          <select
            value={settings.fontSize}
            onChange={(event) =>
              updateSettings({ fontSize: event.target.value as CVSettings["fontSize"] })
            }
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="compact">Compacto</option>
            <option value="normal">Normal</option>
            <option value="large">Grande</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">Espaciado</span>
          <select
            value={settings.spacing}
            onChange={(event) =>
              updateSettings({ spacing: event.target.value as CVSettings["spacing"] })
            }
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="compact">Compacto</option>
            <option value="normal">Normal</option>
            <option value="comfortable">Cómodo</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings.showPhoto}
            onChange={(event) => updateSettings({ showPhoto: event.target.checked })}
            className="size-4 rounded border-input"
          />
          Mostrar foto
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings.showLocation}
            onChange={(event) => updateSettings({ showLocation: event.target.checked })}
            className="size-4 rounded border-input"
          />
          Mostrar ubicación
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings.showLinks}
            onChange={(event) => updateSettings({ showLinks: event.target.checked })}
            className="size-4 rounded border-input"
          />
          Mostrar enlaces
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings.showProjects}
            onChange={(event) => updateSettings({ showProjects: event.target.checked })}
            className="size-4 rounded border-input"
          />
          Mostrar proyectos
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings.showSpecializations}
            onChange={(event) => updateSettings({ showSpecializations: event.target.checked })}
            className="size-4 rounded border-input"
          />
          Mostrar áreas de especialización
        </label>
      </div>
    </section>
  )
}
