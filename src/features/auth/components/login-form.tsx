"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { LoginFormData, loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";
import { Spinner } from "@/components/ui/spinner";

type LoginFormProps = React.ComponentProps<"form">;

const LoginForm = ({ className, ...props }: LoginFormProps) => {
  const { mutate, isPending } = useLogin();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormData) => {
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
          <h1 className="text-2xl font-medium">Welcome back</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

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

                {/*Forget Password */}
                <a
                  className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
                  href="*"
                >
                  Forgot your password?
                </a>
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

        <Field>
          <Button disabled={isPending} className="w-full" type="submit">
            {isPending ? (
              <>
                <Spinner />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Field>

        <FieldSeparator className="w-full flex items-center">
          Or continue with
        </FieldSeparator>

        {/*Login with Google */}
        <Field>
          <Button
            disabled={isPending}
            className="w-full gap-2"
            type="button"
            variant="outline"
          >
            <FcGoogle />
            Login with Google
          </Button>
        </Field>

        {/*Login with GitHub */}
        <Field>
          <Button
            disabled={isPending}
            className="w-full gap-2"
            type="button"
            variant="outline"
          >
            <FaGithub />
            Login with GitHub
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Don&apos;t have a account?{" "}
          <Link href={"/sign-up"} className="underline-offset-4 underline">
            Sign up
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
};

export { LoginForm };
