"use client";

import React from "react";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";

type InputPasswordProps = React.ComponentProps<"input">;

const InputPassword = ({ ...props }: InputPasswordProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <InputGroup className="rounded-sm h-12 shadow-none">
      <InputGroupInput {...props} type={showPassword ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton type="button" onClick={toggleShowPassword}>
          {showPassword ? (
            <EyeSlashIcon className="size-4 text-muted-foreground" />
          ) : (
            <EyeIcon className="size-4 text-muted-foreground" />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export { InputPassword };
