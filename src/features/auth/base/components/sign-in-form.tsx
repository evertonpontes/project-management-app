"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiGoogleFill,
  RiLoaderLine,
} from "@remixicon/react";

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

import { signIn } from "@/lib/auth-client";
import { signInSchema, type SignInInput } from "../types";

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInInput) {
    setIsPending(true);
    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            console.error(ctx.error.message);
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
      className="mx-auto w-full max-w-sm space-y-6"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Login</h1>
        <p className="text-sm text-muted-foreground">Hi, Welcome back 👋</p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        size="lg"
      >
        <RiGoogleFill className="size-4" />
        Login with Google
      </Button>

      <FieldSeparator>or Login with Email</FieldSeparator>

      <FieldSet>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
          <Input
            id="sign-in-email"
            type="email"
            placeholder="E.g. johndoe@email.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="sign-in-password"
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

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 rounded border-input accent-primary"
          />
          Remember Me
        </label>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isPending}
      >
        {isPending && <RiLoaderLine className="size-4 animate-spin" />}
        {isPending ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Not registered yet?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account ↗
        </Link>
      </p>
    </form>
  );
}