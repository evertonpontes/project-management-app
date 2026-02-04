"use client";

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

const WorkspaceForm = () => {
  const { mutate, isPending } = useCreateWorkspace();

  const form = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateWorkspaceFormData) => {
    return mutate({ json: data });
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

              <Field>
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

export { WorkspaceForm };
