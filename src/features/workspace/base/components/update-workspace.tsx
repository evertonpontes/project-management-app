"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  useDeleteWorkspace,
  useDeleteWorkspaceModal,
  useUpdateWorkspace,
} from "../hooks";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadImage } from "@/components/upload-image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  RemixiconComponentType,
  RiAlertLine,
  RiBuilding4Line,
  RiDeleteBinLine,
  RiMenuLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkspaceSettingsProps {
  workspace: {
    name: string;
    description: string;
    image: string | null;
    workspaceId: string;
  };
}

type Tab = "general" | "danger";

export function WorkspaceSettings({ ...props }: WorkspaceSettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const tabs: { id: Tab; label: string; icon: RemixiconComponentType }[] = [
    { id: "general", label: "General", icon: RiBuilding4Line },
    { id: "danger", label: "Danger zone", icon: RiDeleteBinLine },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center gap-2 p-6">
      <div className="flex w-full justify-between p-2">
        <div className="flex w-full flex-col gap-1">
          <h2 className="text-foreground text-xl font-semibold tracking-tight md:text-lg">
            Settings
          </h2>
          <p className="text-muted-foreground text-base tracking-wide md:text-sm">
            Manage your workspace preferences
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="md:hidden [&>svg]:size-6">
            <RiMenuLine />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-50 p-2">
            <DropdownMenuGroup>
              {tabs.map((tab) => (
                <DropdownMenuItem
                  onClick={() => setActiveTab(tab.id)}
                  data-active={tab.id === activeTab}
                  key={tab.id}
                  className={cn(
                    "text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-md p-2 text-sm transition-colors duration-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    tab.id === "danger"
                      ? "data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive"
                      : "data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
                  )}
                >
                  <tab.icon />
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="hidden w-54 flex-col gap-2 px-4 py-6 md:flex">
          {tabs.map((tab) => (
            <button
              onClick={() => setActiveTab(tab.id)}
              data-active={tab.id === activeTab}
              key={tab.id}
              className={cn(
                "text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-md p-2 text-sm transition-colors duration-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                tab.id === "danger"
                  ? "data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive"
                  : "data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
              )}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "general" && <WorkspaceDetails {...props} />}
        {activeTab === "danger" && (
          <DangerZone workspaceId={props.workspace.workspaceId} />
        )}
      </div>
    </div>
  );
}

function WorkspaceDetails({ workspace }: WorkspaceSettingsProps) {
  const { form, action, handleSubmitWithAction } = useUpdateWorkspace({
    ...workspace,
  });

  const imageUrl = form.watch("image");

  const supabase = createClient();

  useEffect(() => {
    if (imageUrl && typeof imageUrl === "string") {
      const downloadImage = async () => {
        const imagePaths = imageUrl.split("/");

        const { data, error } = await supabase.storage
          .from(imagePaths[0])
          .download(imagePaths[1]);

        if (error || !data) {
          return;
        }

        const file = new File([data], imageUrl, {
          type: data.type,
          lastModified: Date.now(),
        });

        form.setValue("image", file);
      };

      downloadImage();
    }
  }, [form, imageUrl, supabase.storage]);

  return (
    <form
      className="mx-auto flex w-xl flex-col items-center justify-center gap-8 p-6"
      onSubmit={handleSubmitWithAction}
      autoComplete="off"
    >
      <div className="border-border bg-background flex w-full max-w-xl flex-col items-center rounded-2xl border p-6 shadow-sm">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-foreground text-xl font-semibold tracking-wide md:text-lg">
              Workspace details
            </h2>
          </div>
          <FieldGroup>
            <Controller
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Workspace image</FieldLabel>
                  <UploadImage
                    key={
                      field.value instanceof File
                        ? field.value.name
                        : field.name
                    }
                    value={
                      field.value instanceof File ? field.value : undefined
                    }
                    onChange={field.onChange}
                    accept="image/jpeg, image/jpg, image/png, image/svg"
                    maxSize={5 * 1024 * 1024}
                  />
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
                  <Input
                    id="name"
                    placeholder="Enter your workspace name"
                    className="bg-muted h-9"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Enter workspace description (optional)"
                    className="bg-muted min-h-20"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="ml-auto text-base md:text-sm"
              disabled={action.isPending}
            >
              {action.isPending ? "Saving changes..." : "Save changes"}
            </Button>
          </FieldGroup>
        </div>
      </div>
    </form>
  );
}

function DangerZone({ workspaceId }: { workspaceId: string }) {
  const isMobile = useIsMobile();
  const { action } = useDeleteWorkspace({ workspaceId });
  const [onDeleteModalToggle, DeleteWorkspaceModal] = useDeleteWorkspaceModal({
    workspaceId,
  });

  return (
    <form
      className="mx-auto flex w-xl flex-col items-center justify-center gap-8 p-6"
      autoComplete="off"
    >
      <div className="border-border bg-background flex w-full max-w-xl flex-col items-center rounded-2xl border p-6 shadow-sm">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-foreground flex items-center gap-2 text-xl font-semibold tracking-wide md:text-lg">
              <RiAlertLine className="text-destructive/80 size-6" />
              Danger zone
            </h2>
            <p className="text-muted-foreground text-base tracking-wide md:text-sm">
              Actions here are irreversible. Please be certain.
            </p>
          </div>
          <FieldSeparator />
          <FieldGroup>
            <Field orientation={isMobile ? "vertical" : "horizontal"}>
              <div className="flex flex-auto flex-col">
                <FieldLabel>Delete workspace</FieldLabel>
                <p className="text-muted-foreground text-sm md:text-xs">
                  Permanently delete this workspace and all its data.
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                variant="destructive"
                className="ml-auto text-base md:text-sm"
                onClick={onDeleteModalToggle}
                disabled={action.isPending}
              >
                {action.isPending ? "Deleting..." : "Delete workspace"}
              </Button>
            </Field>
          </FieldGroup>
        </div>
      </div>
      {DeleteWorkspaceModal}
    </form>
  );
}
