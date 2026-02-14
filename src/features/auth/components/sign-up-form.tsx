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

type SignUpFormProps = React.ComponentProps<"form">;

const SignUpForm = ({ className, ...props }: SignUpFormProps) => {
  const [state, formAction, isPending] = useActionState(register, {});

  return (
    <form
      {...props}
      className={cn("flex flex-col gap-6", className)}
      action={formAction}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>

          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to create your account
          </p>
        </div>
        {/*Field Name*/}
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your name"
            aria-invalid={!!state.errors?.name}
          />

          {state.errors?.name && (
            <FieldError>{state.errors.name.errors}</FieldError>
          )}
        </Field>

        {/*Field Email*/}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="user@company.com"
            aria-invalid={!!state.errors?.email}
          />

          {state.errors?.email && (
            <FieldError>{state.errors.email.errors}</FieldError>
          )}
        </Field>

        {/*Field Password*/}
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <InputPassword
            id="password"
            name="password"
            placeholder="••••••••"
            aria-invalid={!!state.errors?.password}
          />
          {state.errors?.password && (
            <FieldError>{state.errors.password.errors}</FieldError>
          )}
        </Field>

        {/*Field Confirm Password*/}
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          </div>
          <InputPassword
            id="confirm-password"
            name="confirmPassword"
            placeholder="••••••••"
            aria-invalid={!!state.errors?.confirmPassword}
          />
          {state.errors?.confirmPassword && (
            <FieldError>{state.errors.confirmPassword.errors}</FieldError>
          )}
        </Field>

        <Field>
          <Button className="w-full" type="submit">
            Create Account
          </Button>
        </Field>

        <FieldSeparator className="w-full flex items-center">
          Or continue with
        </FieldSeparator>

        {/*Login with Google */}
        <Field>
          <Button className="w-full gap-2" type="button" variant="outline">
            <FcGoogle />
            SignUp with Google
          </Button>
        </Field>

        {/*Login with GitHub */}
        <Field>
          <Button className="w-full gap-2" type="button" variant="outline">
            <FaGithub />
            SignUp with GitHub
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
