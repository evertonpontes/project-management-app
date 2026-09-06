"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { signUp } from "../actions";
import { signUpSchema } from "../schemas";

export function useSignUp() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { resetFormAndAction, ...props } = useHookFormAction(signUp, zodResolver(signUpSchema), {
    formProps: {
      defaultValues: {
        name: "",
        email: "",
        password: "",
      },
    },
    actionProps: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });

        resetFormAndAction();

        toast.success("Signed up successfully.");

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
  });

  return props;
}
