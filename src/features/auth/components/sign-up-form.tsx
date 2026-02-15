"use client";

import { useActionState } from "react";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/input-password";

import { register } from "../actions/register";
import { Spinner } from "@/components/ui/spinner";
import { Controller, useForm } from "react-hook-form";
import { SignUpFormData, signUpSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "../hooks/use-sign-up";

type SignUpFormProps = React.ComponentProps<"form">;

const SignUpForm = ({ className, ...props }: SignUpFormProps) => {
  const { mutate, isPending } = useSignUp();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SignUpFormData) => {
    mutate({ json: values });

    form.reset();
  };

  return (
    <form
      {...props}
      className={cn("flex flex-col gap-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>

          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to create your account
          </p>
        </div>

        {/*Field Name*/}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="Enter your name"
                aria-invalid={invalid}
                {...field}
              />

              {invalid && <FieldError errors={[error]} />}
            </Field>
          )}
        />

        {/*Field Email*/}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="user@company.com"
                aria-invalid={invalid}
                {...field}
              />

              {invalid && <FieldError errors={[error]} />}
            </Field>
          )}
        />

        {/*Field Password*/}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
              </div>
              <InputPassword
                id="password"
                placeholder="••••••••"
                aria-invalid={invalid}
                {...field}
              />
              {invalid && <FieldError errors={[error]} />}
            </Field>
          )}
        />

        {/*Field Confirm Password*/}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
              </div>
              <InputPassword
                id="confirmPassword"
                placeholder="••••••••"
                aria-invalid={invalid}
                {...field}
              />

              {invalid && <FieldError errors={[error]} />}
            </Field>
          )}
        />

        <Field>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                Creating Account
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>

        <FieldSeparator className="w-full flex items-center">
          Or continue with
        </FieldSeparator>

        {/*Login with Google */}
        <Field>
          <Button
            className="w-full gap-2"
            type="button"
            variant="outline"
            disabled={isPending}
          >
            <FcGoogle />
            Sign Up with Google
          </Button>
        </Field>

        {/*Login with GitHub */}
        <Field>
          <Button
            className="w-full gap-2"
            type="button"
            variant="outline"
            disabled={isPending}
          >
            <FaGithub />
            Sign Up with GitHub
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Already have a account?{" "}
          <Link href={"/login"} className="underline-offset-4 underline">
            Login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
};

export { SignUpForm };
