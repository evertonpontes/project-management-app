"use client";

import { ChangeEvent, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { EditWorkspaceFormData, editWorkspaceSchema } from "../schemas";
import { useEditWorkspace } from "../hooks/use-edit-workspace";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { ArrowLeftIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { Workspace } from "../types";
import { useRouter } from "next/navigation";

interface EditWorkspaceFormProps {
  initialValues: Workspace;
}

const EditWorkspaceForm = ({ initialValues }: EditWorkspaceFormProps) => {
  const router = useRouter();

  const { mutate, isPending } = useEditWorkspace({
    workspaceId: initialValues.$id,
  });
  const form = useForm<EditWorkspaceFormData>({
    resolver: zodResolver(editWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ? initialValues.imageUrl : undefined,
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (values: EditWorkspaceFormData) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate({ form: finalValues, param: { workspaceId: initialValues.$id } });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    form.setValue("image", file);

    e.target.value = "";
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-start gap-1 text-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/workspaces/${initialValues.$id}`)}
          >
            <ArrowLeftIcon />
            Back
          </Button>
          <h1 className="text-2xl font-medium mx-auto">{initialValues.name}</h1>
        </div>

        <FieldSeparator />

        {/*Field Workspace Image*/}
        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Field>
              <FieldLabel htmlFor="image">Workspace Logo</FieldLabel>
              <div className="flex items-center w-full gap-4">
                <div className="w-full max-w-42">
                  <AspectRatio
                    ratio={1 / 1}
                    className="bg-muted rounded-lg ring ring-muted-foreground/10 aria-invalid:ring-destructive"
                    aria-invalid={invalid}
                  >
                    {field.value ? (
                      <Image
                        src={
                          field.value instanceof File
                            ? URL.createObjectURL(field.value)
                            : field.value
                        }
                        alt="workspace-logo"
                        fill
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-lg w-full text-muted-foreground">
                        <UploadSimpleIcon size={36} />
                      </div>
                    )}
                  </AspectRatio>
                </div>
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                >
                  Upload file
                </Button>
              </div>

              <input
                ref={inputRef}
                id="image"
                type="file"
                className="hidden"
                onChange={handleInputChange}
                accept="image/png, image/jpeg, image/svg"
              />

              {invalid && <FieldError errors={[error]} />}
            </Field>
          )}
        />

        {/*Field Workspace Name*/}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Field>
              <FieldLabel htmlFor="mame">Name</FieldLabel>
              <Input
                id="name"
                placeholder="Enter workspace name"
                aria-invalid={invalid}
                {...field}
              />

              {invalid && <FieldError errors={[error]} />}
            </Field>
          )}
        />

        <Field orientation="horizontal" className="justify-end">
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default EditWorkspaceForm;
