"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    RiUploadCloud2Line,
    RiLoaderLine,
    RiCloseLine,
    RiRefreshLine,
    RiFileCopyLine,
    RiCheckLine,
    RiAlertLine,
    RiUserSharedLine,
    RiDeleteBinLine,
} from "@remixicon/react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateKey } from "@/lib/utils";

import { useDeleteWorkspace, useUpdateWorkspace } from "../hooks";
import { useConfirm } from "@/hooks";

export interface SettingsWorkspaceProps {
    workspace?: {
        id: string;
        name: string;
        description?: string | null;
        avatarUrl?: string | null;
        key?: string | null;
        ownerId?: string;
    } | null;
    workspaceId?: string;
}

export function SettingsWorkspace({
    workspace,
    workspaceId,
}: SettingsWorkspaceProps) {
    const currentWorkspaceId = workspace?.id || workspaceId || "";

    const { form, handleSubmitWithAction, action } = useUpdateWorkspace(
        currentWorkspaceId,
        {
            name: workspace?.name ?? "",
            description: workspace?.description ?? "",
            avatarUrl: workspace?.avatarUrl ?? "",
            key: workspace?.key ?? "",
        }
    );

    const { action: deleteWorkspaceAction } = useDeleteWorkspace(currentWorkspaceId);

    const [DeleteWorkspaceDialog, confirmDeleteWorkspace] = useConfirm(
        "Delete workspace?",
        "This action cannot be undone. All projects, tasks, and data in this workspace will be permanently removed.",
        "destructive"
    )

    const handleDeleteWorkspace = async () => {
        const ok = await confirmDeleteWorkspace();

        if (!ok) return;

        await deleteWorkspaceAction.executeAsync({ id: currentWorkspaceId });
    }

    const {
        register,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = form;

    const isPending = action.isPending;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        workspace?.avatarUrl ?? null
    );

    const [origin, setOrigin] = useState("");
    const [hasCopied, setHasCopied] = useState(false);

    const currentKey = watch("key") || "";

    useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin);
        }
    }, []);

    useEffect(() => {
        if (workspace) {
            reset({
                id: workspace.id,
                name: workspace.name ?? "",
                description: workspace.description ?? "",
                avatarUrl: workspace.avatarUrl ?? "",
                key: workspace.key ?? "",
            });
            setPreviewUrl(workspace.avatarUrl ?? null);
        }
    }, [workspace, reset]);

    const inviteUrl = origin && currentKey
        ? `${origin}/workspaces/invite/${currentKey}`
        : currentKey
            ? `/workspaces/invite/${currentKey}`
            : "";

    function handleGenerateKey() {
        const newKey = generateKey(10);
        setValue("key", newKey, { shouldDirty: true, shouldValidate: true });
    }

    async function handleCopyInviteUrl() {
        if (!inviteUrl) return;

        try {
            await navigator.clipboard.writeText(inviteUrl);
            setHasCopied(true);
            toast.success("Invite URL copied to clipboard!");
            setTimeout(() => setHasCopied(false), 2000);
        } catch {
            toast.error("Failed to copy invite URL.");
        }
    }

    async function handleImageUpload(file: File) {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
            );

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: "POST", body: formData }
            );

            const data = await res.json();

            if (data.secure_url) {
                setValue("avatarUrl", data.secure_url, { shouldDirty: true });
                setPreviewUrl(data.secure_url);
            }
        } catch {
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageUpload(file);
    }

    function handleRemoveImage() {
        setValue("avatarUrl", "", { shouldDirty: true });
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    return (
        <div className="space-y-8 mx-auto py-8 md:py-10 w-full max-w-2xl">
            {/* Page Header */}
            <div className="space-y-1">
                <h1 className="font-bold text-2xl tracking-tight">Workspace Settings</h1>
                <p className="text-muted-foreground text-sm">
                    Manage your workspace details, invite key, and preferences.
                </p>
            </div>

            {/* General Settings Card */}
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                        Update your workspace profile, name, avatar, and invitation key.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitWithAction}>
                    <CardContent className="space-y-6 py-8">
                        <FieldSet>
                            {/* Image upload */}
                            <Field>
                                <FieldLabel>Workspace Avatar</FieldLabel>
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    className="flex flex-col items-center gap-3 bg-muted/30 hover:bg-muted/50 p-6 border border-border border-dashed rounded-lg transition-colors"
                                >
                                    {previewUrl ? (
                                        <div className="relative">
                                            <Image
                                                src={previewUrl}
                                                alt="Workspace avatar preview"
                                                width={80}
                                                height={80}
                                                className="ring-border rounded-full ring-2 size-20 object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon-xs"
                                                className="-top-1 -right-1 absolute rounded-full"
                                                onClick={handleRemoveImage}
                                                disabled={isPending}
                                            >
                                                <RiCloseLine className="size-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={isPending || isUploading}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {isUploading ? (
                                                <RiLoaderLine className="size-4 animate-spin" />
                                            ) : (
                                                <RiUploadCloud2Line className="size-4" />
                                            )}
                                            {isUploading ? "Uploading..." : "Upload"}
                                        </Button>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={isPending}
                                    />

                                    <div className="space-y-1 text-center">
                                        <p className="text-muted-foreground text-sm">
                                            {previewUrl
                                                ? "Click the × to remove or drop a new image"
                                                : "Change images or drag & drop it here"}
                                        </p>
                                        <p className="text-muted-foreground/70 text-xs">
                                            JPG, JPEG, PNG and WEBP. Max 20 MB.
                                        </p>
                                    </div>
                                </div>
                            </Field>

                            {/* Name */}
                            <Field data-invalid={!!errors.name}>
                                <FieldLabel htmlFor="workspace-name">
                                    Workspace Name
                                </FieldLabel>
                                <Input
                                    id="workspace-name"
                                    placeholder="E.g. My Workspace"
                                    disabled={isPending}
                                    aria-invalid={!!errors.name}
                                    {...register("name")}
                                />
                                <FieldError>{errors.name?.message}</FieldError>
                            </Field>

                            {/* Description */}
                            <Field data-invalid={!!errors.description}>
                                <FieldLabel htmlFor="workspace-description">
                                    Description
                                </FieldLabel>
                                <Textarea
                                    id="workspace-description"
                                    placeholder="What's this workspace about?"
                                    disabled={isPending}
                                    aria-invalid={!!errors.description}
                                    {...register("description")}
                                />
                                <FieldError>{errors.description?.message}</FieldError>
                            </Field>

                            {/* Key */}
                            <Field data-invalid={!!errors.key}>
                                <FieldLabel htmlFor="workspace-key">
                                    Invite Key
                                </FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="workspace-key"
                                        value={currentKey}
                                        disabled
                                        readOnly
                                        placeholder="Generate a key"
                                        aria-invalid={!!errors.key}
                                        className="font-mono text-sm"
                                        {...register("key")}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleGenerateKey}
                                        disabled={isPending}
                                        title="Generate random key"
                                        aria-label="Generate random key"
                                    >
                                        <RiRefreshLine className="size-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleCopyInviteUrl}
                                        disabled={!currentKey}
                                        title={hasCopied ? "Copied!" : "Copy invite URL"}
                                        aria-label="Copy invite URL"
                                    >
                                        {hasCopied ? (
                                            <RiCheckLine className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        ) : (
                                            <RiFileCopyLine className="size-4" />
                                        )}
                                    </Button>
                                </div>
                                <FieldDescription className="text-xs break-all">
                                    Invite URL:{" "}
                                    <span className="font-mono font-medium text-foreground">
                                        {inviteUrl || "No key generated yet"}
                                    </span>
                                </FieldDescription>
                                <FieldError>{errors.key?.message}</FieldError>
                            </Field>
                        </FieldSet>
                    </CardContent>

                    <CardFooter className="flex justify-end pt-4 border-border border-t">
                        <Button
                            type="submit"
                            disabled={isPending || isUploading}
                        >
                            {isPending && (
                                <RiLoaderLine className="size-4 animate-spin" />
                            )}
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            {/* Danger Zone Card */}
            <Card className="bg-destructive/[0.02] border-destructive/30">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <RiAlertLine className="size-5 text-destructive" />
                        <CardTitle className="font-semibold text-destructive">
                            Danger Zone
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Irreversible and sensitive actions for this workspace. Proceed with caution.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Transfer / Change Owner Action (Yellow / Amber highlight) */}
                    <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 bg-amber-500/5 dark:bg-amber-500/10 p-4 border border-amber-500/30 rounded-lg">
                        <div className="space-y-1">
                            <h3 className="font-medium text-amber-900 dark:text-amber-200 text-sm">
                                Change Workspace Owner
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                Transfer ownership of this workspace to another team member. You will lose owner permissions once completed.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="hover:bg-amber-500/10 dark:hover:bg-amber-400/10 border-amber-500/40 text-amber-600 hover:text-amber-700 dark:text-amber-400 shrink-0"
                        >
                            <RiUserSharedLine className="mr-1.5 size-4" />
                            Change Owner
                        </Button>
                    </div>

                    {/* Delete Workspace Action (Red / Destructive highlight) */}
                    <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 bg-destructive/5 dark:bg-destructive/10 p-4 border border-destructive/30 rounded-lg">
                        <div className="space-y-1">
                            <h3 className="font-medium text-destructive text-sm">
                                Delete Workspace
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                Permanently delete this workspace and all associated projects, tasks, and data. This action cannot be undone.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            className="shrink-0"
                            onClick={handleDeleteWorkspace}
                        >
                            <RiDeleteBinLine className="mr-1.5 size-4" />
                            Delete Workspace
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <DeleteWorkspaceDialog />
        </div>
    );
}

export default SettingsWorkspace;
