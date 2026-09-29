"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
    RiUploadCloud2Line,
    RiLoaderLine,
    RiCloseLine,
} from "@remixicon/react";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCreateWorkspace } from "../hooks";

export function CreateWorkspaceForm() {
    const { form, handleSubmitWithAction, action } = useCreateWorkspace();
    const {
        register,
        setValue,
        formState: { errors },
    } = form;

    const isPending = action.isPending;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
                setValue("avatarUrl", data.secure_url);
                setPreviewUrl(data.secure_url);
            }
        } catch {
            // silently fail – user can retry
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
        setValue("avatarUrl", "");
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    return (
        <form
            onSubmit={handleSubmitWithAction}
            className="space-y-6 w-full"
        >
            <div className="space-y-1">
                <h1 className="font-bold text-2xl tracking-tight">Create Workspace</h1>
                <p className="text-muted-foreground text-sm">
                    Set up a new workspace to organize your projects and collaborate with your team.
                </p>
            </div>

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
            </FieldSet>

            {/* Submit */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isPending || isUploading}
                >
                    {isPending && (
                        <RiLoaderLine className="size-4 animate-spin" />
                    )}
                    {isPending ? "Creating..." : "Create Workspace"}
                </Button>
            </div>
        </form>
    );
}
