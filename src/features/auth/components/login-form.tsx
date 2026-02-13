"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/input-password";

type LoginFormProps = React.ComponentProps<"form">;

const LoginForm = ({ className, ...props }: LoginFormProps) => {
  return (
    <form {...props} className={cn("flex flex-col gap-6", className)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-medium">Welcome back</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {/*Field Email*/}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="user@company.com" />
        </Field>

        {/*Field Password*/}
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
          <InputPassword placeholder="••••••••" />
        </Field>

        <Field>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </Field>

        <FieldSeparator className="w-full flex items-center">
          Or continue with
        </FieldSeparator>

        {/*Login with Google */}
        <Field>
          <Button className="w-full gap-2" type="button" variant="outline">
            <FcGoogle />
            Login with Google
          </Button>
        </Field>

        {/*Login with GitHub */}
        <Field>
          <Button className="w-full gap-2" type="button" variant="outline">
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
