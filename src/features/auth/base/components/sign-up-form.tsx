"use client";

import { Controller } from "react-hook-form";
import {
  RiEyeCloseLine,
  RiEyeLine,
  RiGithubFill,
  RiGoogleFill,
} from "@remixicon/react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "../hooks";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function SignUpForm() {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const { form, action, handleSubmitWithAction } = useSignUp();

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((prev) => !prev);
  }, []);

  return (
    <form
      className="flex flex-1 flex-col items-center justify-center gap-8 p-6"
      onSubmit={handleSubmitWithAction}
      autoComplete="off"
    >
      <div className="border-border bg-background flex w-full max-w-md flex-col items-center rounded-2xl border p-6 shadow-sm">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-foreground text-2xl font-semibold tracking-wide md:text-xl">
              Create an account
            </h1>
            <p className="text-muted-foreground text-lg leading-tight md:text-base">
              Please enter your details to create an account.
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <Button
              variant="outline"
              type="button"
              size="lg"
              className="text-base md:text-sm"
            >
              <RiGoogleFill />
              Continue with google
            </Button>
            <Button
              variant="outline"
              type="button"
              size="lg"
              className="text-base md:text-sm"
            >
              <RiGithubFill />
              Continue with github
            </Button>
          </div>

          <FieldSeparator>OR</FieldSeparator>

          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Jane Smith"
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
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
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
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup className="bg-muted h-9">
                    <InputGroupInput
                      id="password"
                      type={passwordVisibility ? "text" : "password"}
                      placeholder="At least 8 characters"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={togglePasswordVisibility}
                        title={
                          passwordVisibility ? "Hide password" : "Show password"
                        }
                      >
                        {passwordVisibility ? (
                          <RiEyeCloseLine />
                        ) : (
                          <RiEyeLine />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full text-base md:text-sm"
              disabled={action.isPending}
            >
              {action.isPending ? "Creating account..." : "Create an account"}
            </Button>
          </FieldGroup>
        </div>
      </div>
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Already have an account? </span>{" "}
        <Link
          href="/login"
          className="text-primary text-sm font-semibold tracking-wide underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
