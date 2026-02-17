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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { CreateWorkspaceFormData, createWorkspaceSchema } from "../schemas";
import { useCreateWorkspace } from "../hooks/use-create-workspace";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { UploadSimpleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const { mutate, isPending } = useCreateWorkspace();
  const form = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (values: CreateWorkspaceFormData) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate({ form: finalValues });

    form.reset();
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
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-medium">Create New Workspace</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter the details below to create a new workspace.
          </p>
        </div>

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

        <Field orientation="horizontal" className="justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className={cn(!onCancel && "invisible")}
          >
            Cancel
          </Button>
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Spinner />
                Creating workspace...
              </>
            ) : (
              "Create Workspace"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default CreateWorkspaceForm;
