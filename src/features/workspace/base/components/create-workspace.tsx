"use client";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCreateWorkspace } from "../hooks";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadImage } from "@/components/upload-image";

export function CreateWorkspace() {
  const { form, action, handleSubmitWithAction } = useCreateWorkspace();

  return (
    <form className="flex flex-1 flex-col items-center justify-center gap-8 p-6" onSubmit={handleSubmitWithAction} autoComplete="off">
      <div className="border-border bg-background flex w-full max-w-lg flex-col items-center rounded-2xl border p-6 shadow-sm">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-foreground text-2xl font-semibold tracking-wide md:text-xl">Create your workspace</h1>
          </div>
          <FieldGroup>
            <Controller
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Workspace image</FieldLabel>
                  <UploadImage value={field.value instanceof File ? field.value : undefined} onChange={field.onChange} accept="image/jpeg, image/jpg, image/png, image/svg" maxSize={5 * 1024 * 1024} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">
                    Workspace name{" "}
                    <span className="text-destructive" title="Required">
                      *
                    </span>
                  </FieldLabel>
                  <Input id="name" placeholder="Enter your workspace name" className="bg-muted h-9" {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea id="description" placeholder="Enter workspace description (optional)" className="bg-muted min-h-20" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Button type="submit" size="lg" className="w-full text-base md:text-sm" disabled={action.isPending}>
              {action.isPending ? "Creating workspace..." : "Create workspace"}
            </Button>
          </FieldGroup>
        </div>
      </div>
    </form>
  );
}
