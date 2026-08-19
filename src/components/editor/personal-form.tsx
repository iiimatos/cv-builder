"use client"

import Image from "next/image"
import type { ChangeEvent } from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ImagePlus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMessages } from "@/hooks/use-messages"
import { useCVEditorStore } from "@/stores/use-cv-editor-store"
import type { PersonalInfo, PersonalLink } from "@/types/cv"

function createPersonalLink(label: string): PersonalLink {
  return {
    id: crypto.randomUUID(),
    label,
    url: "",
  }
}

export function PersonalForm() {
  const personal = useCVEditorStore((state) => state.data?.personal)
  const setPersonal = useCVEditorStore((state) => state.setPersonal)
  const { ui } = useMessages()
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
  const fields: Array<{
    name: Exclude<keyof PersonalInfo, "links" | "photo">
    label: string
    placeholder?: string
  }> = [
    { name: "firstName", label: ui.firstName },
    { name: "lastName", label: ui.lastName },
    { name: "professionalTitle", label: ui.professionalTitle },
    { name: "location", label: ui.location },
    { name: "email", label: ui.email },
    { name: "phone", label: ui.phone },
  ]

  const updateLink = (id: string, updates: Partial<PersonalLink>) => {
    setPersonal({
      links: personal.links.map((link) => (link.id === id ? { ...link, ...updates } : link)),
    })
  }

  const addLink = () => {
    setPersonal({ links: [...personal.links, createPersonalLink(ui.newLink)] })
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
        throw new Error(payload.error ?? ui.photoUploadError)
      }

      setPersonal({ photo: payload.photo })
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : ui.photoUploadError)
    } finally {
      setUploadingPhoto(false)
      event.target.value = ""
    }
  }

  return (
    <section id="informacion" className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{ui.personalInfo}</h2>
        <p className="text-sm text-muted-foreground">{ui.personalInfoDescription}</p>
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
          <h3 className="text-base font-semibold">{ui.photo}</h3>
          <p className="text-sm text-muted-foreground">{ui.photoDescription}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt={ui.loadedPhotoAlt}
              width={96}
              height={120}
              className="h-30 w-24 rounded-md border object-cover"
            />
          ) : (
            <div className="grid h-30 w-24 place-items-center rounded-md border bg-muted text-xs text-muted-foreground">
              {ui.noPhoto}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-input bg-background px-2.5 text-sm font-medium hover:bg-muted">
              <ImagePlus className="size-4" />
              {uploadingPhoto ? ui.uploading : ui.uploadPhoto}
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
                {ui.removePhoto}
              </Button>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">{ui.noPhotoUploaded}</span>
          )}
          </div>
        </div>
        {photoError ? <p className="text-sm text-destructive">{photoError}</p> : null}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{ui.links}</h3>
            <p className="text-sm text-muted-foreground">{ui.linksDescription}</p>
          </div>
          <Button type="button" variant="outline" onClick={addLink}>
            <Plus className="size-4" />
            {ui.add}
          </Button>
        </div>

        <div className="space-y-3">
          {personal.links.map((link) => (
            <div key={link.id} className="grid gap-3 rounded-lg border p-3 md:grid-cols-[1fr_2fr_auto]">
              <label className="space-y-1.5">
                <span className="text-sm font-medium">{ui.linkName}</span>
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
                  aria-label={ui.removeLink}
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
