"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiEyeLine, RiEyeOffLine, RiGoogleFill, RiLoaderLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import { signUp } from "@/lib/auth-client";
import { signUpSchema, type SignUpInput } from "../types";

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignUpInput) {
    setIsPending(true);
    try {
      await signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            toast.success("Account created successfully!");
            router.push("/workspaces");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to create account. Please try again.");
          },
        }
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mx-auto w-full max-w-sm"
    >
      <div className="space-y-1">
        <h1 className="font-bold text-2xl tracking-tight">Sign Up</h1>
        <p className="text-muted-foreground text-sm">
          Create your account to get started 🚀
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="gap-2 w-full"
        size="lg"
      >
        <RiGoogleFill className="size-4" />
        Sign up with Google
      </Button>

      <FieldSeparator>or Sign up with Email</FieldSeparator>

      <FieldSet>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            placeholder="E.g. John Doe"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="E.g. johndoe@email.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <RiEyeOffLine className="size-4 text-muted-foreground" />
                ) : (
                  <RiEyeLine className="size-4 text-muted-foreground" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
      </FieldSet>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isPending}
      >
        {isPending && (
          <RiLoaderLine className="size-4 animate-spin" />
        )}
        {isPending ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-muted-foreground text-sm text-center">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Sign in ↗
        </Link>
      </p>
    </form>
  );
}
