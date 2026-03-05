import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import "@/components/ui/warcraftcn/styles/warcraft.css";

const CheckboxVariants = cva(
  "font-bold",
  {
    variants: {
      faction: {
        default: "wc-avatar-default text-yellow-100",
        orc: "wc-avatar-orc text-red-100",
        elf: "wc-avatar-elf text-green-100",
        human: "wc-avatar-human text-blue-100",
        undead: "wc-avatar-undead text-purple-100",
      },
    },
    defaultVariants: {
      faction: "default",
    },
  }
);

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "checked" | "disabled" | "onChange"
  >,
  VariantProps<typeof CheckboxVariants> {
  faction?: "default" | "orc" | "elf" | "human" | "undead";
  label?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  faction = "default",
  label,
  className,
  checked,
  disabled,
  onChange,
  ...props
}) => {
  return (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer select-none fantasy mb-2",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        type="checkbox"
        className={cn(
          "checkbox",
          `checkbox-${faction}`,
          "w-12 h-12"
        )}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />      
      {label && (
        <span className={CheckboxVariants({ faction })}>
          {label}
        </span>
      )}
    </label>
  );
};