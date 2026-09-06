"use client";

import { cn } from "@/lib/utils";
import { RiCloseLine, RiUploadCloud2Line } from "@remixicon/react";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

interface UploadImageProps {
  value?: File;
  accept?: string;
  maxSize?: number;
  onChange?: (file: File | undefined) => void;
}

export function UploadImage({ ...props }: UploadImageProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const [file, setFile] = useState<File | undefined>(props.value);

  const [draggingOver, setDraggingOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const dragCounter = useRef(0);

  const maxSizeMb = useMemo(() => {
    if (props.maxSize) {
      return Math.round(props.maxSize / 1024 / 1024).toFixed(2);
    }

    return 50.0;
  }, [props.maxSize]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors([]);

      const file = event.target.files?.[0];

      if (!file) return;

      if (props.maxSize && file.size > props.maxSize) {
        setErrors((prev) => ["Maximum size exceeded.", ...prev]);
        return;
      }

      setFile(file);
      props.onChange?.(file);
      dragCounter.current = 0;
      setDraggingOver(false);
    },
    [props],
  );

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current++;
    setDraggingOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDraggingOver(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      setErrors([]);
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];

      if (!file) return;

      if (props.maxSize && file.size > props.maxSize) {
        setErrors((prev) => ["Maximum size exceeded.", ...prev]);
        return;
      }

      setFile(file);
      props.onChange?.(file);
      dragCounter.current = 0;
      setDraggingOver(false);
    },
    [props],
  );

  const onRemoveImage = useCallback(() => {
    setFile(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    props.onChange?.(undefined);
  }, [props]);

  return (
    <div className="flex flex-col gap-2">
      <div onDragOver={handleDragOver} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} className={cn("group-upc bg-muted border-border relative flex aspect-square size-54! items-center justify-center overflow-hidden rounded-md border-2 border-dashed p-2 transition-colors duration-150", draggingOver && "bg-primary/5 border-primary/80", "aria-invalid:border-destructive aria-invalid:bg-destructive/5")} aria-invalid={errors.length > 0}>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="from-background to-muted border-border text-muted-foreground flex items-center justify-center rounded-md border bg-linear-to-b p-2">
            <RiUploadCloud2Line />
          </div>
          {file && <Image src={URL.createObjectURL(file)} alt={file.name.split(".")[0]} fill />}
          {file && (
            <button type="button" className="bg-background/40 text-foreground/30 hover:bg-background/60 absolute top-1 right-1 z-1 flex size-8 items-center justify-center overflow-hidden rounded-full transition-colors duration-150" title="Remove image" onClick={onRemoveImage}>
              <RiCloseLine />
            </button>
          )}
          <p className="text-muted-foreground text-center text-xs leading-relaxed tracking-tight">
            Drag & drop or{" "}
            <span className="text-primary cursor-pointer underline underline-offset-2" title="Upload image" onClick={() => inputRef.current?.click()}>
              Choose file
            </span>{" "}
            to upload. Image format: JPG, PNG, & SVG. Max {maxSizeMb}MB
          </p>
        </div>
        <input ref={inputRef} type="file" accept={props.accept} className="hidden" onChange={handleFileChange} />
      </div>
      {errors.map((error, index) => (
        <p key={index} className="text-destructive text-sm">
          {error}
        </p>
      ))}
    </div>
  );
}
