import type { HTMLAttributes, ReactNode } from "react";

export interface HeroActionsProps extends HTMLAttributes<HTMLElement> {
  /** Main hero heading text */
  title: string;
  /** Optional subtitle displayed below the title */
  subtitle?: string;
  /** Action buttons rendered in the actions area */
  children?: ReactNode;
}
