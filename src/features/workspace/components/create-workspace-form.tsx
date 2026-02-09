"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import {
  createWorkspaceSchema,
  type CreateWorkspaceFormData,
} from "../schemas";
import { useCreateWorkspace } from "../hooks/use-create-workspace";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import Image from "next/image";

const CreateWorkspaceForm = () => {
  const { mutate, isPending } = useCreateWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("file", file);
    }

    event.target.value = "";
  };

  const onSubmit = (data: CreateWorkspaceFormData) => {
    form.reset();

    return mutate({ form: data });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create Workspace</CardTitle>
        <CardDescription className="text-base">
          Create a new workspace to manage your projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full h-full flex-col items-center justify-center gap-8">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex justify-center"
          >
            <FieldGroup className="w-full max-w-md">
              <Controller
                name="file"
                control={form.control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Field>
                    <FieldLabel htmlFor="logo">Workspace Logo</FieldLabel>
                    <div className="flex items-center gap-2">
                      <div className="size-16 rounded-sm border border-border border-dashed bg-muted flex items-center justify-center relative text-muted-foreground/50 overflow-hidden">
                        <ImageIcon className="size-6" />
                        {field.value && (
                          <Image
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt="logo"
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => inputRef.current?.click()}
                        >
                          <UploadSimpleIcon
                            weight="bold"
                            className="size-4 mr-0.5"
                          />
                          Upload
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, JPEG or SVG (max. 5MB)
                        </p>
                      </div>
                      <input
                        id="logo"
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                    {invalid && <FieldError>{error?.message}</FieldError>}
                  </Field>
                )}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Workspace Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Enter workspace name"
                      aria-invalid={invalid}
                    />
                    {invalid && <FieldError>{error?.message}</FieldError>}
                  </Field>
                )}
              />

              <Field orientation="horizontal" className="justify-end">
                <Button type="button" variant="secondary" disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner />
                      <span>Creating Workspace...</span>
                    </>
                  ) : (
                    "Create Workspace"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export { CreateWorkspaceForm };
