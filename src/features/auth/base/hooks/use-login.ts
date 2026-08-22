"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { login } from "../actions";
import { loginSchema } from "../schemas";

export function useLogin() {
  const router = useRouter();

  const { resetFormAndAction, ...props } = useHookFormAction(
    login,
    zodResolver(loginSchema),
    {
      formProps: {
        defaultValues: {
          email: "",
          password: "",
        },
      },
      actionProps: {
        onSuccess: () => {
          resetFormAndAction();

          toast.success("Logged in successfully.");

          router.push("/workspaces");
        },
        onError: ({ error }) => {
          if (error.serverError) {
            toast.error(error.serverError);
          } else {
            toast.error("Someting went wrong. Please, try again later.");
          }
        },
      },
    },
  );

  return props;
}
