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
import { CopyIcon, KeyIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { Workspace } from "../types";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../hooks/use-delete-workspace";
import { toast } from "sonner";
import { useResetInviteCode } from "../hooks/use-reset-invite-code";

interface EditWorkspaceFormProps {
  initialValues: Workspace;
}

const EditWorkspaceForm = ({ initialValues }: EditWorkspaceFormProps) => {
  const router = useRouter();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Are you absolutely sure?",
    "This action cannot be undone. This will permanently delete your workspace from our servers.",
    "destructive",
  );

  const [ResetInviteCodeDialog, confirmResetInviteCode] = useConfirm(
    "Are you absolutely sure?",
    "This will invalidate the current invite code.",
    "destructive",
  );

  const { mutate, isPending } = useEditWorkspace({
    workspaceId: initialValues.$id,
  });

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace({
      workspaceId: initialValues.$id,
    });

  const { mutate: resetInviteCode, isPending: isResetingInvideCode } =
    useResetInviteCode({
      workspaceId: initialValues.$id,
    });

  const form = useForm<EditWorkspaceFormData>({
    resolver: zodResolver(editWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ? initialValues.imageUrl : undefined,
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => router.push("/workspaces"),
      },
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmResetInviteCode();

    if (!ok) return;

    resetInviteCode({
      param: { workspaceId: initialValues.$id },
    });
  };

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

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <DeleteDialog />
      <ResetInviteCodeDialog />
      <FieldGroup className="w-full bg-card rounded-lg ring ring-muted-foreground/10 shadow-xs py-6">
        {/*Field Workspace Image*/}
        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Field className="px-8 mb-8">
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
            <Field className="px-8">
              <FieldLabel htmlFor="name">Name</FieldLabel>
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

        <FieldSeparator />

        <Field orientation="horizontal" className="justify-end px-8">
          <Button disabled={isPending} type="submit" variant="outline">
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

      {/*Invite Code */}
      <FieldGroup className="w-full bg-card rounded-lg ring ring-muted-foreground/10 shadow-xs py-6">
        <div className="flex flex-col gap-4 w-full px-8">
          <div className="flex flex-col text-start gap-2">
            <h2 className="text-xl font-semibold">Invite Members</h2>
            <p className="text-sm leading-4 text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input disabled value={fullInviteLink} />
            <Button
              className="size-10"
              variant="secondary"
              type="button"
              onClick={handleCopyInviteLink}
            >
              <CopyIcon />
            </Button>
          </div>
        </div>
        <FieldSeparator />
        <Field orientation="horizontal" className="justify-end px-8">
          <Button
            disabled={isPending || isResetingInvideCode}
            type="button"
            variant="outline"
            onClick={handleResetInviteCode}
          >
            Reset Invite Code
          </Button>
        </Field>
      </FieldGroup>

      {/*Delete Workspace */}
      <FieldGroup className="w-full bg-card rounded-lg ring ring-muted-foreground/10 shadow-xs py-6">
        <div className="flex flex-col md:flex-row gap-4 w-full px-8">
          <div className="flex flex-col text-start gap-2">
            <h2 className="text-xl font-semibold">Delete Workspace</h2>
            <p className="text-sm leading-4 text-muted-foreground">
              The Workspace will be permanently deleted, including all the
              associated data. This action is irreversible.
            </p>
          </div>
          <Alert className="w-full bg-muted/20">
            <AlertTitle>{initialValues.name}</AlertTitle>
            <AlertDescription className="flex items-center gap-2 leading-4">
              {initialValues.$id}
              <KeyIcon />
            </AlertDescription>
            <AlertDescription>
              Last Updated{" "}
              {formatDate(initialValues.$updatedAt, "MMM dd, yyyy, HH:mm")}
            </AlertDescription>
          </Alert>
        </div>
        <FieldSeparator />
        <Field orientation="horizontal" className="justify-end px-8">
          <Button
            disabled={isPending || isDeletingWorkspace}
            type="button"
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Workspace
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default EditWorkspaceForm;
