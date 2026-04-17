import type { HTMLAttributes } from "react";

export type TextContentTitleAlign = "left" | "center" | "right";

export interface TextContentTitleProps extends HTMLAttributes<HTMLDivElement> {
  /** Main heading text */
  title: string;
  /** Optional subtitle displayed below the title */
  subtitle?: string;
  /** Horizontal text alignment */
  align?: TextContentTitleAlign;
}
