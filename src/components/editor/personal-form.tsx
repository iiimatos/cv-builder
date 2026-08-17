"use client"

import Image from "next/image"
import type { ChangeEvent } from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ImagePlus, Plus, Trash2 } from "lucide-react"

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
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const { register, reset } = useForm<PersonalInfo>({
    values: personal,
  })

  useEffect(() => {
    if (personal) reset(personal)
  }, [personal, reset])

  if (!personal) return null
  const photoPreview = personal.photo?.split("?")[0] ?? ""

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

  const uploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    setPhotoError(null)

    try {
      const formData = new FormData()
      formData.append("photo", file)

      const response = await fetch("/api/profile-photo", {
        method: "POST",
        body: formData,
      })

      const payload = (await response.json()) as { photo?: string; error?: string }

      if (!response.ok || !payload.photo) {
        throw new Error(payload.error ?? "No se pudo subir la foto.")
      }

      setPersonal({ photo: payload.photo })
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "No se pudo subir la foto.")
    } finally {
      setUploadingPhoto(false)
      event.target.value = ""
    }
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

      <div className="space-y-3 rounded-lg border p-3">
        <div>
          <h3 className="text-base font-semibold">Foto</h3>
          <p className="text-sm text-muted-foreground">
            Se guarda localmente dentro de public/profile.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt="Foto cargada"
              width={96}
              height={120}
              className="h-30 w-24 rounded-md border object-cover"
            />
          ) : (
            <div className="grid h-30 w-24 place-items-center rounded-md border bg-muted text-xs text-muted-foreground">
              Sin foto
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-input bg-background px-2.5 text-sm font-medium hover:bg-muted">
              <ImagePlus className="size-4" />
              {uploadingPhoto ? "Subiendo..." : "Subir foto"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={uploadingPhoto}
                onChange={uploadPhoto}
              />
            </label>
          {personal.photo ? (
            <>
              <span className="max-w-sm truncate text-sm text-muted-foreground">
                {personal.photo}
              </span>
              <Button type="button" variant="outline" size="sm" onClick={() => setPersonal({ photo: "" })}>
                Quitar
              </Button>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Sin foto cargada</span>
          )}
          </div>
        </div>
        {photoError ? <p className="text-sm text-destructive">{photoError}</p> : null}
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
