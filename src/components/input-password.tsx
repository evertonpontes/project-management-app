"use client";

import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type InputPasswordProps = React.ComponentProps<"input">;

const InputPassword = ({ className, ...props }: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const tooglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <InputGroup className={cn("h-10", className)}>
      <InputGroupInput {...props} type={showPassword ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={tooglePasswordVisibility}>
          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          <span className="sr-only">Toggle button</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export { InputPassword };
