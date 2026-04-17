import type { HTMLAttributes, ReactNode } from "react";

export type ButtonGroupAlign = "start" | "center" | "end" | "justify";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Horizontal alignment of buttons within the group */
  align?: ButtonGroupAlign;
  /** Button elements to render in the group */
  children: ReactNode;
}
