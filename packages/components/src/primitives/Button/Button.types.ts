import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Icon placed before the label */
  leadingIcon?: ReactNode;
  /** Icon placed after the label */
  trailingIcon?: ReactNode;
  /** Fills the width of its container */
  fullWidth?: boolean;
  /** Loading state — disables interaction and shows spinner */
  isLoading?: boolean;
}
