"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator,
  FieldContent,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/input-password";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import { loginSchema, type LoginFormData } from "../schemas";
import Link from "next/link";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-8">
      <Link href="/" className="lg:hidden">
        <div className="w-40 h-10 overflow-hidden relative">
          <Image
            src="dark-logo.svg"
            alt="logo"
            fill
            className="object-contain"
          />
        </div>
      </Link>
      <div className="flex flex-col gap-4 items-center text-center">
        <h1 className="text-3xl lg:text-4xl text-primary tracking-tight">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Enter your email and password to access your account
        </p>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex justify-center"
      >
        <FieldGroup className="w-full max-w-md">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState: { invalid, error } }) => (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="user@company.com"
                  aria-invalid={invalid}
                />
                {invalid && <FieldError>{error?.message}</FieldError>}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState: { invalid, error } }) => (
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputPassword
                  {...field}
                  id="password"
                  placeholder="Enter password"
                  aria-invalid={invalid}
                />
                {invalid && <FieldError>{error?.message}</FieldError>}
              </Field>
            )}
          />

          <FieldGroup className="grid grid-cols-2">
            <Field orientation="horizontal">
              <Checkbox id="remember-me" />
              <FieldLabel
                htmlFor="remember-me"
                className="text-sm text-muted-foreground"
              >
                Remember me
              </FieldLabel>
            </Field>

            <Field>
              <FieldContent className="text-right">
                <a href="#" className="text-sm text-indigo-600">
                  Forgot your password?
                </a>
              </FieldContent>
            </Field>
          </FieldGroup>

          <Field>
            <Button type="submit">Log In</Button>
          </Field>

          <FieldSeparator>OR LOGIN WITH</FieldSeparator>

          <FieldGroup className="grid grid-cols-2">
            <Field>
              <Button type="button" variant="outline">
                <FcGoogle />
                Google
              </Button>
            </Field>

            <Field>
              <Button type="button" variant="outline">
                <FaGithub />
                Github
              </Button>
            </Field>
          </FieldGroup>

          <Field>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-indigo-600">
                Register now.
              </Link>
            </div>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export { LoginForm };
