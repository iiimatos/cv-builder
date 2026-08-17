"use client"

import type { ChangeEvent } from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"
import type { PersonalInfo, PersonalLink } from "@/types/cv"

const fields: Array<{
  name: Exclude<keyof PersonalInfo, "links" | "photo">
  label: string
  placeholder?: string
}> = [
  { name: "firstName", label: "Nombre" },
  { name: "lastName", label: "Apellido" },
  { name: "professionalTitle", label: "Título profesional" },
  { name: "location", label: "Ubicación" },
  { name: "email", label: "Correo electrónico" },
  { name: "phone", label: "Teléfono" },
]

function createPersonalLink(): PersonalLink {
  return {
    id: crypto.randomUUID(),
    label: "Nuevo enlace",
    url: "",
  }
}

export function PersonalForm() {
  const personal = useCVEditorStore((state) => state.data?.personal)
  const setPersonal = useCVEditorStore((state) => state.setPersonal)
  const { register, reset } = useForm<PersonalInfo>({
    values: personal,
  })

  useEffect(() => {
    if (personal) reset(personal)
  }, [personal, reset])

  if (!personal) return null

  const updateLink = (id: string, updates: Partial<PersonalLink>) => {
    setPersonal({
      links: personal.links.map((link) => (link.id === id ? { ...link, ...updates } : link)),
    })
  }

  const addLink = () => {
    setPersonal({ links: [...personal.links, createPersonalLink()] })
  }

  const removeLink = (id: string) => {
    setPersonal({ links: personal.links.filter((link) => link.id !== id) })
  }

  return (
    <section id="informacion" className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Información personal</h2>
        <p className="text-sm text-muted-foreground">
          Datos principales que aparecen en la cabecera y sidebar del CV.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className="space-y-1.5">
            <span className="text-sm font-medium">{field.label}</span>
            <Input
              {...register(field.name, {
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                  setPersonal({ [field.name]: event.target.value })
                },
              })}
              placeholder={field.placeholder}
            />
          </label>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">Enlaces</h3>
            <p className="text-sm text-muted-foreground">
              Sitios personales, redes profesionales o cualquier perfil relevante.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addLink}>
            <Plus className="size-4" />
            Agregar
          </Button>
        </div>

        <div className="space-y-3">
          {personal.links.map((link) => (
            <div key={link.id} className="grid gap-3 rounded-lg border p-3 md:grid-cols-[1fr_2fr_auto]">
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Nombre</span>
                <Input
                  value={link.label}
                  onChange={(event) => updateLink(link.id, { label: event.target.value })}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">URL</span>
                <Input
                  value={link.url}
                  onChange={(event) => updateLink(link.id, { url: event.target.value })}
                />
              </label>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => removeLink(link.id)}
                  aria-label="Eliminar enlace"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
